package com.ntustray.androidcontent

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.OpenableColumns
import android.util.Base64
import app.tauri.annotation.Command
import app.tauri.annotation.ActivityCallback
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import androidx.activity.result.ActivityResult
import java.io.ByteArrayOutputStream

@InvokeArg
class ReadContentUriArgs {
    lateinit var uri: String
    var maxBytes: Long = 0
}

@InvokeArg
class WriteContentUriArgs {
    lateinit var uri: String
    lateinit var data: String
}

@InvokeArg
class OpenDocumentArgs {
    lateinit var mimeTypes: Array<String>
}

@TauriPlugin
class AndroidContentPlugin(private val activity: Activity) : Plugin(activity) {
    @Command
    fun openDocument(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(OpenDocumentArgs::class.java)
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
            intent.addCategory(Intent.CATEGORY_OPENABLE)
            intent.type = "*/*"
            intent.putExtra(Intent.EXTRA_MIME_TYPES, args.mimeTypes)
            intent.addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION or
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                    Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
            )
            startActivityForResult(invoke, intent, "openDocumentResult")
        } catch (error: Exception) {
            invoke.reject(error.message ?: "Unable to open the document picker")
        }
    }

    @ActivityCallback
    fun openDocumentResult(invoke: Invoke, result: ActivityResult) {
        try {
            val response = JSObject()
            if (result.resultCode != Activity.RESULT_OK) {
                response.put("uri", null)
                invoke.resolve(response)
                return
            }

            val intent = result.data
            val uri = intent?.data
                ?: throw IllegalStateException("The document picker returned no document")
            val grantFlags = intent.flags and
                (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            activity.contentResolver.takePersistableUriPermission(uri, grantFlags)
            response.put("uri", uri.toString())
            invoke.resolve(response)
        } catch (error: Exception) {
            invoke.reject(error.message ?: "Unable to access the selected document")
        }
    }

    @Command
    fun readContentUri(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(ReadContentUriArgs::class.java)
            val uri = Uri.parse(args.uri)
            val bytes = readBytes(uri, args.maxBytes)
            val result = JSObject()
            result.put("data", Base64.encodeToString(bytes, Base64.NO_WRAP))
            result.put("name", displayName(uri))
            result.put("size", bytes.size.toLong())
            invoke.resolve(result)
        } catch (error: Exception) {
            invoke.reject(error.message ?: "Unable to read the selected document")
        }
    }

    @Command
    fun writeContentUri(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(WriteContentUriArgs::class.java)
            val bytes = Base64.decode(args.data, Base64.DEFAULT)
            val uri = Uri.parse(args.uri)
            val stream = activity.contentResolver.openOutputStream(uri, "rwt")
                ?: throw IllegalStateException("Unable to open the selected document for writing")
            stream.use { it.write(bytes) }
            invoke.resolve()
        } catch (error: Exception) {
            invoke.reject(error.message ?: "Unable to write the selected document")
        }
    }

    private fun readBytes(uri: Uri, maxBytes: Long): ByteArray {
        require(maxBytes > 0) { "Invalid document size limit" }
        val input = activity.contentResolver.openInputStream(uri)
            ?: throw IllegalStateException("Unable to open the selected document")
        return input.use { stream ->
            val output = ByteArrayOutputStream()
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            var total = 0L
            while (true) {
                val count = stream.read(buffer)
                if (count < 0) break
                total += count
                require(total <= maxBytes) { "file-too-large" }
                output.write(buffer, 0, count)
            }
            output.toByteArray()
        }
    }

    private fun displayName(uri: Uri): String {
        val projection = arrayOf(OpenableColumns.DISPLAY_NAME)
        activity.contentResolver.query(uri, projection, null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) {
                val index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (index >= 0) return cursor.getString(index)
            }
        }
        return uri.lastPathSegment ?: "document"
    }
}
