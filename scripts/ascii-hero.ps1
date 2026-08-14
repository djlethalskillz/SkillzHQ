param(
  [Parameter(Mandatory = $true)][string]$Path,
  [int]$Cols = 160,
  [int]$Rows = 80,
  [int]$CropX = 0,
  [int]$CropY = 0,
  [int]$CropW = 0,
  [int]$CropH = 0
)
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($Path)
$w = $img.Width
$h = $img.Height
if ($CropW -eq 0 -or $CropH -eq 0) { $CropW = $w; $CropH = $h }
$chars = " .:-=+*#%@"
for ($r = 0; $r -lt $Rows; $r++) {
  $line = ""
  for ($c = 0; $c -lt $Cols; $c++) {
    $px = [Math]::Min($w - 1, [int]($CropX + ($c + 0.5) / $Cols * $CropW))
    $py = [Math]::Min($h - 1, [int]($CropY + ($r + 0.5) / $Rows * $CropH))
    $col = $img.GetPixel($px, $py)
    $lum = 0.299 * $col.R + 0.587 * $col.G + 0.114 * $col.B
    $idx = [int]($lum / 256 * $chars.Length)
    if ($idx -ge $chars.Length) { $idx = $chars.Length - 1 }
    $line += $chars[$idx]
  }
  Write-Output $line
}
$img.Dispose()
