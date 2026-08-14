# Dense grid diff: shot vs reconstructed composite (no interpolation — direct sampling)
param([int]$Step = 16)
Add-Type -AssemblyName System.Drawing
$DIR = "C:\Users\djlet\Skillz-V1-Website\public\assets"
$shot = [System.Drawing.Bitmap]::FromFile("C:\Users\djlet\AppData\Local\Temp\hero2-1440.png")

$layers = @(
  @("hero2-archival-layer.png", 0),
  @("hero2-skillz-layer.png", 0),
  @("hero2-dj-lethal-layer.png", 0),
  @("hero2-eoto-layer.png", 0),
  @("hero2-supporting-copy-layer.png", 0),
  @("hero2-cta-layer.png", 0)
)
$master = [System.Drawing.Bitmap]::FromFile("$DIR\skillz-hero2-master.png")

# row accumulators
$rows = [math]::Ceiling(900.0 / $Step)
$rowDiff = New-Object float[] $rows
$rowN = New-Object int[] $rows
$worst = @{ d = 0.0; x = 0; y = 0; sc = ""; rc = "" }

$blits = New-Object System.Collections.Generic.List[object]
for ($y = 0; $y -lt 900; $y += $Step) {
  for ($x = 0; $x -lt 1200; $x += $Step) {
    $sc = $shot.GetPixel(120 + $x, $y)
    $r = 0.0; $g = 0.0; $b = 0.0; $a = 0.0
    foreach ($L in $layers) {
      $im = [System.Drawing.Bitmap]::FromFile("$DIR\$($L[0])")
      $px = [int]($x / 1200 * 1448); $py = [int]($y / 900 * 1086)
      $c = $im.GetPixel($px, $py)
      $sa = $c.A / 255.0
      if ($sa -gt 0.003) {
        $na = $sa + $a * (1 - $sa)
        $k = if ($na -gt 0) { (1 - $sa) * $a / $na } else { 0 }
        $r = $c.R * $sa + $r * $k; $g = $c.G * $sa + $g * $k; $b = $c.B * $sa + $b * $k
        $a = $na
      }
      $im.Dispose()
    }
    # master keyed
    $mx = [int]($x / 1200 * 4624); $my = [int]($y / 900 * 3468)
    $mc = $master.GetPixel($mx, $my)
    $lum = 0.299 * $mc.R + 0.587 * $mc.G + 0.114 * $mc.B
    if ($lum -lt 239) {
      $sa = 1.0
      $na = $sa + $a * (1 - $sa)
      $k = if ($na -gt 0) { (1 - $sa) * $a / $na } else { 0 }
      $r = $mc.R * $sa + $r * $k; $g = $mc.G * $sa + $g * $k; $b = $mc.B * $sa + $b * $k
      $a = $na
    }
    # marquee band y>=858
    if ($y -ge 858) {
      $sa = 1.0
      $na = $sa + $a * (1 - $sa)
      $k = if ($na -gt 0) { (1 - $sa) * $a / $na } else { 0 }
      $r = 255 * $sa + $r * $k; $g = 230 * $sa + $g * $k; $b = 0 * $sa + $b * $k
      $a = $na
    }
    $d = ([Math]::Abs($sc.R - $r) + [Math]::Abs($sc.G - $g) + [Math]::Abs($sc.B - $b)) / 3.0
    $ri = [int]($y / $Step)
    $rowDiff[$ri] += $d; $rowN[$ri]++
    if ($d -gt $worst.d) { $worst.d = $d; $worst.x = $x; $worst.y = $y; $worst.sc = "$($sc.R),$($sc.G),$($sc.B)"; $worst.rc = "$([int]$r),$([int]$g),$([int]$b)" }
  }
}
Write-Output ("worst sample: hero($($worst.x),$($worst.y)) shot=$($worst.sc) recon=$($worst.rc)  diff=$([int]$worst.d)")
for ($i = 0; $i -lt $rows; $i++) {
  if ($rowN[$i] -eq 0) { continue }
  $m = $rowDiff[$i] / $rowN[$i]
  $spark = ""
  $v = [int]($m / 12)
  for ($j = 0; $j -lt 30; $j++) { if ($j -lt $v) { $spark += "#" } else { $spark += " " } }
  Write-Output ("{0,3} y{1,4}-{2,4} diff={3,5:N1} |{4}|" -f $i, ($i * $Step), (($i + 1) * $Step), $m, $spark)
}
$shot.Dispose(); $master.Dispose()
