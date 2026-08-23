use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::AndroidContent;
#[cfg(mobile)]
use mobile::AndroidContent;

pub trait AndroidContentExt<R: Runtime> {
    fn android_content(&self) -> &AndroidContent<R>;
}

impl<R: Runtime, T: Manager<R>> AndroidContentExt<R> for T {
    fn android_content(&self) -> &AndroidContent<R> {
        self.state::<AndroidContent<R>>().inner()
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("android-content")
        .invoke_handler(tauri::generate_handler![
            commands::open_document,
            commands::read_content_uri,
            commands::write_content_uri
        ])
        .setup(|app, api| {
            #[cfg(mobile)]
            let android_content = mobile::init(app, api)?;
            #[cfg(desktop)]
            let android_content = desktop::init(app, api)?;
            app.manage(android_content);
            Ok(())
        })
        .build()
}
