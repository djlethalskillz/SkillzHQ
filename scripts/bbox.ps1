param(
  [Parameter(Mandatory = $true)][string]$Path,
  [int]$Y0 = 0, [int]$Y1 = 0,
  [int]$X0 = 0, [int]$X1 = 0,
  [int]$Lum = 90,
  [int]$Step = 1
)
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($Path)
$w = $img.Width; $h = $img.Height
if ($X1 -eq 0) { $X1 = $w }
if ($Y1 -eq 0) { $Y1 = $h }
$minX = $X1; $maxX = $X0; $minY = $Y1; $maxY = $Y0
$count = 0
for ($y = $Y0; $y -lt $Y1; $y += $Step) {
  for ($x = $X0; $x -lt $X1; $x += $Step) {
    $c = $img.GetPixel($x, $y)
    $l = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
    if ($l -gt $Lum) {
      $count++
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
Write-Output ("img={0}x{1} region x{2}-{3} y{4}-{5} lum>{6} step={7} count={8}" -f $w, $h, $X0, $X1, $Y0, $Y1, $Lum, $Step, $count)
if ($count -gt 0) {
  Write-Output ("bbox: x {0} - {1}  ({2:P1} - {3:P1} of width)" -f $minX, $maxX, ($minX / $w), ($maxX / $w))
  Write-Output ("       y {0} - {1}  ({2:P1} - {3:P1} of height)" -f $minY, $maxY, ($minY / $h), ($maxY / $h))
} else {
  Write-Output "NO BRIGHT PIXELS in region"
}
$img.Dispose()
