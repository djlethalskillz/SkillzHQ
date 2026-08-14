$DIR = "C:\Users\djlet\Skillz-V1-Website\public\assets"
Add-Type -AssemblyName System.Drawing
$pairs = @(
  @("hero2-dj-lethal-layer.png", "hero2-eoto-layer.png"),
  @("hero2-dj-lethal-layer.png", "hero2-supporting-copy-layer.png"),
  @("hero2-dj-lethal-layer.png", "hero2-cta-layer.png"),
  @("hero2-dj-lethal-layer.png", "hero2-skillz-layer.png"),
  @("hero2-dj-lethal-layer.png", "hero2-archival-layer.png")
)
foreach ($pr in $pairs) {
  $a = [System.Drawing.Bitmap]::FromFile("$DIR\$($pr[0])")
  $b = [System.Drawing.Bitmap]::FromFile("$DIR\$($pr[1])")
  $diffs = 0; $maxDiff = 0; $sample = @()
  for ($y = 0; $y -lt 1086; $y += 10) {
    for ($x = 0; $x -lt 1448; $x += 10) {
      $ca = $a.GetPixel($x, $y); $cb = $b.GetPixel($x, $y)
      $d = [Math]::Abs($ca.R - $cb.R) + [Math]::Abs($ca.G - $cb.G) + [Math]::Abs($ca.B - $cb.B)
      if ($d -gt 0) {
        $diffs++
        if ($d -gt $maxDiff) { $maxDiff = $d }
        if ($sample.Count -lt 6) { $sample += "($x,$y) $($ca.R),$($ca.G),$($ca.B) vs $($cb.R),$($cb.G),$($cb.B)" }
      }
    }
  }
  Write-Output ("--- {0} vs {1} ---" -f $pr[0], $pr[1])
  Write-Output ("diffPct: {0:P1}  maxRGBDelta: {1}" -f ($diffs / (145 * 109)), $maxDiff)
  foreach ($s in $sample) { Write-Output $s }
  $a.Dispose(); $b.Dispose()
}
