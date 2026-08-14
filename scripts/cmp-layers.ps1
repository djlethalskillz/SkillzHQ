$A = "C:\Users\djlet\Skillz-V1-Website\public\assets"
Add-Type -AssemblyName System.Drawing
$files = @("hero2-dj-lethal-layer.png", "hero2-eoto-layer.png", "hero2-supporting-copy-layer.png", "hero2-cta-layer.png", "hero2-archival-layer.png", "hero2-skillz-layer.png")
$imgs = @{}
foreach ($f in $files) { $imgs[$f] = [System.Drawing.Bitmap]::FromFile("$A\$f") }
$pts = @(@(50,50), @(200,200), @(400,300), @(700,600), @(1000,800), @(1200,300), @(800,100), @(1300,1000))
foreach ($f in $files) {
  $out = $f + ": "
  foreach ($p in $pts) {
    $c = $imgs[$f].GetPixel($p[0], $p[1])
    $out += "($($p[0]),$($p[1]))=$($c.R),$($c.G),$($c.B) "
  }
  Write-Output $out
}
foreach ($f in $files) { $imgs[$f].Dispose() }
