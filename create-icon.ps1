Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.Clear([System.Drawing.Color]::FromArgb(66, 135, 245))
$font = New-Object System.Drawing.Font('Arial', 300, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.DrawString('M', $font, $brush, 300, 250)
$graphics.Dispose()
$bmp.Save('app-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Icon created successfully!"
