use tauri::{command, AppHandle, Runtime};

use crate::{
    models::{
        OpenDocumentRequest, OpenDocumentResponse, ReadContentUriRequest,
        ReadContentUriResponse, WriteContentUriRequest,
    },
    AndroidContentExt, Result,
};

#[command]
pub(crate) async fn open_document<R: Runtime>(
    app: AppHandle<R>,
    payload: OpenDocumentRequest,
) -> Result<OpenDocumentResponse> {
    app.android_content().open_document(payload)
}

#[command]
pub(crate) async fn read_content_uri<R: Runtime>(
    app: AppHandle<R>,
    payload: ReadContentUriRequest,
) -> Result<ReadContentUriResponse> {
    app.android_content().read_content_uri(payload)
}

#[command]
pub(crate) async fn write_content_uri<R: Runtime>(
    app: AppHandle<R>,
    payload: WriteContentUriRequest,
) -> Result<()> {
    app.android_content().write_content_uri(payload)
}
