param(
  [Parameter(Mandatory = $true)][string]$Path,
  [int]$Bands = 40,
  [int]$Cols = 64,
  [int]$CropX = 0, [int]$CropY = 0, [int]$CropW = 0, [int]$CropH = 0
)
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($Path)
$w = $img.Width; $h = $img.Height
if ($CropW -eq 0 -or $CropH -eq 0) { $CropW = $w; $CropH = $h }
$bandH = $CropH / $Bands
for ($b = 0; $b -lt $Bands; $b++) {
  $cy = $CropY + [int]($b * $bandH) + [int]($bandH / 2)
  if ($cy -ge $h) { $cy = $h - 1 }
  $count = 0; $yb = 0; $n = 0
  for ($x = $CropX; $x -lt ($CropX + $CropW); $x += $Cols) {
    $c = $img.GetPixel($x, $cy)
    $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
    if ($lum -gt 100) { $count++ }
    if ($c.R -gt 180 -and $c.G -gt 150 -and $c.B -lt 120) { $yb++ }
    $n++
  }
  $bp = [Math]::Round(100.0 * $count / $n, 0)
  $yp = [Math]::Round(100.0 * $yb / $n, 0)
  $spark = ""
  $v = [int]($bp / 4)
  for ($i = 0; $i -lt 25; $i++) { if ($i -lt $v) { $spark += "#" } else { $spark += " " } }
  Write-Output ("{0,2} y={1,4}-{2,4} bright={3,3}% yellow={4,3}% |{5}|" -f $b, ($CropY + [int]($b * $bandH)), ($CropY + [int](($b + 1) * $bandH)), $bp, $yp, $spark)
}
$img.Dispose()
