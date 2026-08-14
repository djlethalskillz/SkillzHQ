# Reconstruct expected browser render from layers at WxH grid, diff vs screenshot.
param(
  [string]$ShotPath = "C:\Users\djlet\AppData\Local\Temp\hero2-1440.png",
  [int]$W = 120, [int]$H = 90
)
Add-Type -AssemblyName System.Drawing
$DIR = "C:\Users\djlet\Skillz-V1-Website\public\assets"

function Downscale($img, $w, $h) {
  $b = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose()
  return $b
}

$accR = New-Object float[] ($W * $H)
$accG = New-Object float[] ($W * $H)
$accB = New-Object float[] ($W * $H)
$accA = New-Object float[] ($W * $H)

function BlendOver($src) {
  # src over acc (premultiplied color stored in accR/G/B along with accA)
  for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
      $i = $y * $src.Width + $x
      $c = $src.GetPixel($x, $y)
      $sa = $c.A / 255.0
      if ($sa -lt 0.004) { continue }
      $da = $accA[$i]
      $na = $sa + $da * (1 - $sa)
      $k = if ($na -gt 0) { (1 - $sa) * $da / $na } else { 0 }
      $accR[$i] = $c.R * $sa + $accR[$i] * $k
      $accG[$i] = $c.G * $sa + $accG[$i] * $k
      $accB[$i] = $c.B * $sa + $accB[$i] * $k
      $accA[$i] = $na
    }
  }
}

function BlendKeyedMaster($src) {
  # white-key: alpha_out = 0 when lum >= 239 (bin 15 of 16), else 1
  for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
      $i = $y * $src.Width + $x
      $c = $src.GetPixel($x, $y)
      $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
      $sa = if ($lum -ge 239) { 0.0 } else { 1.0 }
      if ($sa -lt 0.004) { continue }
      $da = $accA[$i]
      $na = $sa + $da * (1 - $sa)
      $k = if ($na -gt 0) { (1 - $sa) * $da / $na } else { 0 }
      $accR[$i] = $c.R * $sa + $accR[$i] * $k
      $accG[$i] = $c.G * $sa + $accG[$i] * $k
      $accB[$i] = $c.B * $sa + $accB[$i] * $k
      $accA[$i] = $na
    }
  }
}

# 1) layers in z order: archival(z0), skillz(z10), master(z20 keyed), dj-lethal(z30), eoto(z30), supporting-copy(z40), cta(z40)
$arch = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-archival-layer.png")
$skillz = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-skillz-layer.png")
$master = [System.Drawing.Bitmap]::FromFile("$DIR\skillz-hero2-master.png")
$dj = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-dj-lethal-layer.png")
$eoto = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-eoto-layer.png")
$copy = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-supporting-copy-layer.png")
$cta = [System.Drawing.Bitmap]::FromFile("$DIR\hero2-cta-layer.png")

$sArch = Downscale $arch $W $H
$sSkillz = Downscale $skillz $W $H
$sMaster = Downscale $master $W $H
$sDj = Downscale $dj $W $H
$sEoto = Downscale $eoto $W $H
$sCopy = Downscale $copy $W $H
$sCta = Downscale $cta $W $H

BlendOver $sArch
BlendOver $sSkillz
BlendKeyedMaster $sMaster
BlendOver $sDj
BlendOver $sEoto
BlendOver $sCopy
BlendOver $sCta

# 2) live marquee: yellow band over bottom (shot: y 855-900 of 900 → grid rows 85.5-90)
$marqTop = [int]($H * 0.95)
for ($y = $marqTop; $y -lt $H; $y++) {
  for ($x = 0; $x -lt $W; $x++) {
    $i = $y * $W + $x
    $sa = 1.0
    $da = $accA[$i]
    $na = $sa + $da * (1 - $sa)
    $k = if ($na -gt 0) { (1 - $sa) * $da / $na } else { 0 }
    # accent yellow from tailwind default palette (~#facc15) — check actual accent color
    $accR[$i] = 255 * $sa + $accR[$i] * $k
    $accG[$i] = 230 * $sa + $accG[$i] * $k
    $accB[$i] = 0 * $sa + $accB[$i] * $k
    $accA[$i] = $na
  }
}

# 3) load screenshot, downscale, diff
$shot = [System.Drawing.Bitmap]::FromFile($ShotPath)
$sShot = Downscale $shot $W $H
# hero occupies x 120..1320 of 1440 → grid cols 10..120
$rowDiffs = New-Object float[] $H
$totalDiff = 0.0; $n = 0
for ($y = 0; $y -lt $H; $y++) {
  for ($x = 10; $x -lt $W; $x++) {
    $i = $y * $W + $x
    $c = $sShot.GetPixel($x, $y)
    $dr = [Math]::Abs($c.R - $accR[$i]); $dg = [Math]::Abs($c.G - $accG[$i]); $db = [Math]::Abs($c.B - $accB[$i])
    $d = ($dr + $dg + $db) / 3.0
    $rowDiffs[$y] += $d; $totalDiff += $d; $n++
  }
  $rowDiffs[$y] = $rowDiffs[$y] / ($W - 10)
}
$totalDiff = $totalDiff / $n
Write-Output ("mean diff (RGB): {0:N1}" -f $totalDiff)
for ($y = 0; $y -lt $H; $y++) {
  $spark = ""
  $v = [int]($rowDiffs[$y] / 12)
  for ($i = 0; $i -lt 30; $i++) { if ($i -lt $v) { $spark += "#" } else { $spark += " " } }
  Write-Output ("{0,3} y{1,4}-{2,4} diff={3,5:N1} |{4}|" -f $y, [int]($y * 900.0 / $H), [int](($y + 1) * 900.0 / $H), $rowDiffs[$y], $spark)
}
foreach ($b in @($arch,$skillz,$master,$dj,$eoto,$copy,$cta,$shot)) { $b.Dispose() }
foreach ($b in @($sArch,$sSkillz,$sMaster,$sDj,$sEoto,$sCopy,$sCta,$sShot)) { $b.Dispose() }
