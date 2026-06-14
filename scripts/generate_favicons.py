import os
import subprocess
import struct

def write_svg():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7928ca" />
      <stop offset="100%" stop-color="#ff0080" />
    </linearGradient>
  </defs>
  <!-- Background Circle (Perfectly centered, zero white border gap issue) -->
  <circle cx="256" cy="256" r="256" fill="url(#brand-grad)" />
  
  <!-- Outer Rounded Photo Frame (Centered white stroke) -->
  <rect x="136" y="136" width="240" height="240" rx="44" fill="none" stroke="#ffffff" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Mountain Peaks (Centered white filled path) -->
  <path d="M156 366 L220 270 L268 318 L324 240 L356 366 Z" fill="#ffffff" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Sun/Circle (White filled circle in top-left) -->
  <circle cx="212" cy="212" r="24" fill="#ffffff" />
</svg>
"""
    svg_path = "public/favicon.svg"
    with open(svg_path, "w") as f:
        f.write(svg_content)
    print(f"Created clean vector SVG at {svg_path}")

def render_pngs():
    # Render 512x512 PNG first as base
    base_png = "public/web-app-manifest-512x512.png"
    subprocess.run(["sips", "-s", "format", "png", "public/favicon.svg", "--out", base_png], check=True)
    print(f"Rendered base 512x512 PNG at {base_png}")

    # Generate other sizes from the base PNG
    sizes = {
        "public/favicon-96x96.png": 96,
        "public/apple-touch-icon.png": 180,
        "public/web-app-manifest-192x192.png": 192,
        "temp-32.png": 32
    }

    for path, size in sizes.items():
        subprocess.run(["cp", base_png, path], check=True)
        subprocess.run(["sips", "-z", str(size), str(size), path], check=True)
        print(f"Generated {size}x{size} PNG at {path}")

def pack_ico():
    # Pack 32x32 PNG into favicon.ico
    temp_png = "temp-32.png"
    ico_path = "public/favicon.ico"
    
    with open(temp_png, "rb") as f:
        png_data = f.read()

    # ICO header (6 bytes)
    header = struct.pack("<HHH", 0, 1, 1)
    
    # Directory Entry (16 bytes)
    # width, height, colors (0), reserved (0), planes (1), bpp (32), size, offset (22)
    entry = struct.pack("<BBBBHHII", 32, 32, 0, 0, 1, 32, len(png_data), 22)
    
    with open(ico_path, "wb") as f:
        f.write(header)
        f.write(entry)
        f.write(png_data)
        
    print(f"Packed favicon.ico at {ico_path}")
    
    # Remove temp file
    if os.path.exists(temp_png):
        os.remove(temp_png)

if __name__ == "__main__":
    write_svg()
    render_pngs()
    pack_ico()
