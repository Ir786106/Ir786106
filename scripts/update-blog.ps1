$ErrorActionPreference = 'Stop'
$feed = 'https://veilguardsecjournal.blogspot.com/feeds/posts/default?alt=rss'
$response = Invoke-WebRequest -Uri $feed -TimeoutSec 25
$config = [System.Xml.XmlReaderSettings]::new()
$config.DtdProcessing = [System.Xml.DtdProcessing]::Prohibit
$reader = [System.Xml.XmlReader]::Create([IO.StringReader]::new($response.Content), $config)
$xml = [System.Xml.XmlDocument]::new()
try { $xml.Load($reader) } finally { $reader.Dispose() }

$posts = foreach ($item in ($xml.SelectNodes('/rss/channel/item') | Select-Object -First 3)) {
  $url = $null
  if (![Uri]::TryCreate($item.link, [UriKind]::Absolute, [ref]$url) -or
      $url.Scheme -ne 'https' -or $url.Host -ne 'veilguardsecjournal.blogspot.com') { continue }
  $title = [Net.WebUtility]::HtmlEncode(($item.title -replace '\s+', ' ').Trim())
  $href = [Net.WebUtility]::HtmlEncode($url.AbsoluteUri)
  "<li><a href=`"$href`">$title</a></li>"
}
if (!$posts) { throw 'RSS feed did not contain valid posts.' }

$readme = Get-Content -LiteralPath README.md -Raw
$pattern = '(?s)<!-- BLOG:START -->.*?<!-- BLOG:END -->'
if ([regex]::Matches($readme, $pattern).Count -ne 1) { throw 'Expected one blog markers block.' }
$block = "<!-- BLOG:START -->`n<ul>`n$($posts -join "`n")`n</ul>`n<!-- BLOG:END -->"
$readme = [regex]::Replace($readme, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $block })
[IO.File]::WriteAllText((Join-Path (Get-Location) 'README.md'), $readme)
