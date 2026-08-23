use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::{
    models::{ReadContentUriRequest, ReadContentUriResponse, WriteContentUriRequest},
    Result,
};

#[cfg(target_os = "android")]
const PLUGIN_IDENTIFIER: &str = "com.ntustray.androidcontent";

pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> Result<AndroidContent<R>> {
    #[cfg(target_os = "android")]
    let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "AndroidContentPlugin")?;
    Ok(AndroidContent(handle))
}

pub struct AndroidContent<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> AndroidContent<R> {
    pub fn open_document(
        &self,
        payload: crate::models::OpenDocumentRequest,
    ) -> Result<crate::models::OpenDocumentResponse> {
        self.0
            .run_mobile_plugin("openDocument", payload)
            .map_err(Into::into)
    }

    pub fn read_content_uri(
        &self,
        payload: ReadContentUriRequest,
    ) -> Result<ReadContentUriResponse> {
        self.0
            .run_mobile_plugin("readContentUri", payload)
            .map_err(Into::into)
    }

    pub fn write_content_uri(&self, payload: WriteContentUriRequest) -> Result<()> {
        self.0
            .run_mobile_plugin("writeContentUri", payload)
            .map_err(Into::into)
    }
}
