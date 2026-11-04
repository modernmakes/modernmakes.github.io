"""Download the site's Google Fonts (latin subset) into public/fonts and
print @font-face CSS, including metric-matched fallback faces.
Usage: python scripts/build-fonts.py <saved Google Fonts css2 response> public/fonts > src/styles/fonts.css
Fetch the css2 URL with a Chrome user-agent so it returns woff2. Windows only (reads C:/Windows/Fonts)."""
import re, sys, urllib.request, os
from fontTools.ttLib import TTFont

css_path, out_dir = sys.argv[1], sys.argv[2]
css = open(css_path, encoding='utf8').read()
os.makedirs(out_dir, exist_ok=True)

blocks = re.findall(r'/\* (latin) \*/\s*@font-face \{(.*?)\}', css, re.S)
faces = {}  # (family, style, url) -> {subset, weights, range}
for subset, body in blocks:
    fam = re.search(r"font-family: '([^']+)'", body).group(1)
    style = re.search(r'font-style: (\w+)', body).group(1)
    weight = int(re.search(r'font-weight: (\d+)', body).group(1))
    url = re.search(r'url\((.*?)\)', body).group(1)
    rng = re.search(r'unicode-range: ([^;]+);', body).group(1)
    f = faces.setdefault((fam, style, url), {'subset': subset, 'weights': [], 'range': rng})
    f['weights'].append(weight)

out_css = []
latin_files = {}
for (fam, style, url), f in faces.items():
    w = f['weights']
    wtxt = str(w[0]) if len(w) == 1 else f'{min(w)} {max(w)}'
    slug = fam.lower().replace(' ', '-')
    name = f"{slug}{'-italic' if style == 'italic' else ''}{'' if len(w) > 1 else '-' + str(w[0])}-{f['subset']}.woff2"
    dest = os.path.join(out_dir, name)
    if not os.path.exists(dest):
        urllib.request.urlretrieve(url, dest)
    if f['subset'] == 'latin':
        latin_files[(fam, style, max(w))] = dest
    out_css.append(
        f"@font-face {{ font-family: '{fam}'; font-style: {style}; font-weight: {wtxt}; "
        f"font-display: swap; src: url('/fonts/{name}') format('woff2'); unicode-range: {f['range']}; }}")

# Metric-matched fallbacks: size-adjust from the average advance of an English
# sample, vertical overrides from hhea, the approach next/font and capsize use.
SAMPLE = 'The quick brown fox jumps over the lazy dog 0123456789 Voron hotend flow rate'
WIN = 'C:/Windows/Fonts/'
def avg_width(font):
    cmap, hmtx = font.getBestCmap(), font['hmtx']
    adv = [hmtx[cmap[ord(c)]][0] for c in SAMPLE if ord(c) in cmap]
    return sum(adv) / len(adv) / font['head'].unitsPerEm

def fallback(fam, primary, sys_file, local_names, weight_desc):
    p, s = TTFont(primary), TTFont(WIN + sys_file)
    adj = avg_width(p) / avg_width(s)
    upm, hh = p['head'].unitsPerEm, p['hhea']
    pct = lambda v: f'{abs(v) / upm / adj * 100:.2f}%'
    src = ', '.join(f"local('{n}')" for n in local_names)
    return (f"@font-face {{ font-family: '{fam} Fallback'; src: {src};{weight_desc} "
            f"size-adjust: {adj * 100:.2f}%; ascent-override: {pct(hh.ascent)}; "
            f"descent-override: {pct(hh.descent)}; line-gap-override: {pct(hh.lineGap)}; }}")

out_css.append(fallback('Barlow Condensed', latin_files[('Barlow Condensed', 'normal', 800)],
                        'arialbd.ttf', ['Arial Bold', 'Arial-BoldMT'], ' font-weight: 700 800;'))
out_css.append(fallback('Barlow', latin_files[('Barlow', 'normal', 400)], 'arial.ttf', ['Arial', 'ArialMT'], ''))
out_css.append(fallback('Lora', latin_files[('Lora', 'normal', 500)], 'times.ttf',
                        ['Times New Roman', 'TimesNewRomanPSMT'], ''))
out_css.append(fallback('JetBrains Mono', latin_files[('JetBrains Mono', 'normal', 500)], 'cour.ttf',
                        ['Courier New', 'CourierNewPSMT'], ''))
print('\n'.join(out_css))
print('PRELOAD', [os.path.basename(v) for k, v in latin_files.items()], file=sys.stderr)
