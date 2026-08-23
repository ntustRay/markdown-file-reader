const COMMANDS: &[&str] = &["open_document", "read_content_uri", "write_content_uri"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .build();
}
