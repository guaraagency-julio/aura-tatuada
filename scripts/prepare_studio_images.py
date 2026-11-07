from pathlib import Path
from PIL import Image, ImageOps
source = Path("media-source/studio")
dest = Path("site/assets/studio")
dest.mkdir(parents=True,exist_ok=True)
images=sorted(source.glob("studio-??.jpg"))
if len(images)!=11:
    raise RuntimeError(f"Esperadas 11 fotos do estúdio; encontradas {len(images)}")
for file in images:
    with Image.open(file) as photo:
        photo=ImageOps.exif_transpose(photo)
        photo.thumbnail((1280,1280),Image.Resampling.LANCZOS)
        photo.convert("RGB").save(dest/(file.stem+".webp"),"WEBP",quality=79,method=6)
        print("Convertida:",file.name,"->",dest/(file.stem+".webp"))
