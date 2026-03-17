Add-Type -AssemblyName System.Drawing

$bg = [System.Drawing.Color]::FromArgb(0x8B,0x15,0x38)
$white = [System.Drawing.Color]::White

function New-Icon {
    param(
        [string]$Path,
        [int]$Size
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear($bg)

    $brushWhite = New-Object System.Drawing.SolidBrush($white)
    $brushBg = New-Object System.Drawing.SolidBrush($bg)
    $fontSize = [single]($Size * 0.45)
    $fontFamily = New-Object System.Drawing.FontFamily('Segoe UI')
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    $graphics.FillEllipse($brushWhite, $Size * 0.22, $Size * 0.22, $Size * 0.56, $Size * 0.56)
    $graphics.FillEllipse($brushBg, $Size * 0.3, $Size * 0.3, $Size * 0.4, $Size * 0.4)
    $graphics.DrawString('V', $font, $brushWhite, $Size / 2, $Size / 2 + ($Size * 0.03), $format)

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $bmp.Dispose()
}

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$iconDir = Join-Path $scriptDir 'icons'
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

New-Icon -Path (Join-Path $iconDir 'icon-192.png') -Size 192
New-Icon -Path (Join-Path $iconDir 'icon-512.png') -Size 512
