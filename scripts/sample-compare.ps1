Add-Type -AssemblyName System.Drawing
$shotPath = "C:\Users\djlet\AppData\Local\Temp\hero2-1440.png"
$shot = [System.Drawing.Bitmap]::FromFile($shotPath)
$master = [System.Drawing.Bitmap]::FromFile("C:\Users\djlet\Skillz-V1-Website\public\assets\skillz-hero2-master.png")
$skillz = [System.Drawing.Bitmap]::FromFile("C:\Users\djlet\Skillz-V1-Website\public\assets\hero2-skillz-layer.png")
# master mapped: 4624x3468 -> hero 1200x900 (0.2595 scale)
$pts = @(@(150,150), @(300,250), @(500,300), @(700,400), @(900,500), @(600,700), @(1000,800), @(200,100), @(400,650), @(800,250), @(1100,150), @(300,550))
foreach ($p in $pts) {
  $sx = 120 + $p[0]; $sy = $p[1]
  $sc = $shot.GetPixel($sx, $sy)
  $mx = [int]($p[0] / 1200 * 4624); $my = [int]($p[1] / 900 * 3468)
  $mc = $master.GetPixel($mx, $my)
  $lum = 0.299 * $mc.R + 0.587 * $mc.G + 0.114 * $mc.B
  $keyA = if ($lum -ge 239) { "X" } else { "o" }
  # skillz layer at same point
  $kx = [int]($p[0] / 1200 * 1448); $ky = [int]($p[1] / 900 * 1086)
  $kc = $skillz.GetPixel($kx, $ky)
  Write-Output ("hero($($p[0]),$($p[1])) shot=$($sc.R),$($sc.G),$($sc.B)  master(lum=$([int]$lum),key=$keyA)=$($mc.R),$($mc.G),$($mc.B)  skillz(alpha=$($kc.A))=$($kc.R),$($kc.G),$($kc.B)")
}
$shot.Dispose(); $master.Dispose(); $skillz.Dispose()
