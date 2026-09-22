Add-Type -AssemblyName System.Drawing

if ($PSScriptRoot) { $projectRoot = Split-Path -Parent $PSScriptRoot }
else { $projectRoot = (Get-Location).Path }
$sourcePath = Join-Path $projectRoot 'assets/og-base.png'
$outputPath = Join-Path $projectRoot 'assets/og.png'
$source = [System.Drawing.Image]::FromFile($sourcePath)
$canvas = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.DrawImage($source, 0, 0, 1200, 630)

$ink = [System.Drawing.Color]::FromArgb(18, 18, 18)
$paper = [System.Drawing.Color]::FromArgb(255, 253, 246)
$blue = [System.Drawing.Color]::FromArgb(36, 87, 255)
$orange = [System.Drawing.Color]::FromArgb(255, 90, 54)
$acid = [System.Drawing.Color]::FromArgb(202, 255, 69)
$fontName = 'Malgun Gothic'

$graphics.FillRectangle((New-Object System.Drawing.SolidBrush $ink), 54, 50, 164, 45)
$labelFont = New-Object System.Drawing.Font $fontName, 17, ([System.Drawing.FontStyle]::Bold)
$graphics.DrawString('OLTD / ORUWAN', $labelFont, (New-Object System.Drawing.SolidBrush $paper), 66, 58)

$headlineFont = New-Object System.Drawing.Font $fontName, 52, ([System.Drawing.FontStyle]::Bold)
$graphics.DrawString('오늘도 루팡 완료', $headlineFont, (New-Object System.Drawing.SolidBrush $ink), 50, 142)
$graphics.FillRectangle((New-Object System.Drawing.SolidBrush $orange), 54, 232, 466, 12)

$copyFont = New-Object System.Drawing.Font $fontName, 27, ([System.Drawing.FontStyle]::Regular)
$graphics.DrawString("생각 오래 하지 말고`n느낌대로, 내 캐릭터 찾기.", $copyFont, (New-Object System.Drawing.SolidBrush $ink), 54, 280)

$graphics.FillRectangle((New-Object System.Drawing.SolidBrush $acid), 54, 424, 300, 54)
$tagFont = New-Object System.Drawing.Font $fontName, 18, ([System.Drawing.FontStyle]::Bold)
$graphics.DrawString('28 RESULTS · 4 TESTS', $tagFont, (New-Object System.Drawing.SolidBrush $ink), 68, 434)
$graphics.FillRectangle((New-Object System.Drawing.SolidBrush $blue), 54, 505, 16, 54)
$smallFont = New-Object System.Drawing.Font $fontName, 16, ([System.Drawing.FontStyle]::Bold)
$graphics.DrawString('무료 · 가입 없음 · 결과 이미지 공유', $smallFont, (New-Object System.Drawing.SolidBrush $ink), 86, 519)

$borderPen = New-Object System.Drawing.Pen $ink, 8
$graphics.DrawRectangle($borderPen, 4, 4, 1191, 621)
$canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$borderPen.Dispose()
$labelFont.Dispose()
$headlineFont.Dispose()
$copyFont.Dispose()
$tagFont.Dispose()
$smallFont.Dispose()
$graphics.Dispose()
$canvas.Dispose()
$source.Dispose()
Write-Output $outputPath
