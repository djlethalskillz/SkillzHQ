param(
  [Parameter(Mandatory = $true)][string]$Path,
  [int]$Step = 8,
  [string]$Out
)
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($Path)
$w = $img.Width
$h = $img.Height
$nonBlack = 0; $sum = 0.0; $count = 0; $maxLum = 0
$yellow = 0
for ($y = 0; $y -lt $h; $y += $Step) {
  for ($x = 0; $x -lt $w; $x += $Step) {
    $c = $img.GetPixel($x, $y)
    $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
    $sum += $lum; $count++
    if ($lum -gt 0.5) { $nonBlack++ }
    if ($lum -gt $maxLum) { $maxLum = $lum }
    if ($c.R -gt 180 -and $c.G -gt 150 -and $c.B -lt 120) { $yellow++ }
  }
}
$avg = if ($count) { $sum / $count } else { 0 }
Write-Output "size: ${w}x${h}"
Write-Output "avgLum: $([Math]::Round($avg, 1))"
Write-Output "nonBlackPct: $([Math]::Round(100.0 * $nonBlack / $count, 2))"
Write-Output "maxLum: $([Math]::Round($maxLum, 1))"
Write-Output "yellowPct: $([Math]::Round(100.0 * $yellow / $count, 2))"
$img.Dispose()
