use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::{
    models::{ReadContentUriRequest, ReadContentUriResponse, WriteContentUriRequest},
    Error, Result,
};

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<AndroidContent<R>> {
    Ok(AndroidContent(app.clone()))
}

pub struct AndroidContent<R: Runtime>(#[allow(dead_code)] AppHandle<R>);

impl<R: Runtime> AndroidContent<R> {
    pub fn open_document(
        &self,
        _payload: crate::models::OpenDocumentRequest,
    ) -> Result<crate::models::OpenDocumentResponse> {
        Err(Error::UnsupportedPlatform)
    }

    pub fn read_content_uri(
        &self,
        _payload: ReadContentUriRequest,
    ) -> Result<ReadContentUriResponse> {
        Err(Error::UnsupportedPlatform)
    }

    pub fn write_content_uri(&self, _payload: WriteContentUriRequest) -> Result<()> {
        Err(Error::UnsupportedPlatform)
    }
}
