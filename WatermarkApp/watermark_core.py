from PIL import Image, ImageDraw, ImageFont


def load_font(font_name: str, size: int = 40):
    """Load a font by name, fallback to default if unavailable."""
    try:
        return ImageFont.truetype(f"{font_name}.ttf", size)
    except IOError:
        return ImageFont.load_default()


def calculate_text_size(text: str, font: ImageFont.ImageFont):
    """Return width and height of the text using textbbox."""
    dummy_img = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(dummy_img)
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def calculate_position(position: str, image_size: tuple, text: str, font: ImageFont.ImageFont, margin: int = 20):
    """Calculate watermark position based on user choice."""
    text_width, text_height = calculate_text_size(text, font)
    img_width, img_height = image_size

    positions = {
        "Top-left": (margin, margin),
        "Top-right": (img_width - text_width - margin, margin),
        "Center": ((img_width - text_width) // 2, (img_height - text_height) // 2),
        "Bottom-left": (margin, img_height - text_height - margin),
        "Bottom-right": (img_width - text_width - margin, img_height - text_height - margin),
    }

    return positions.get(position, positions["Bottom-right"])


def apply_watermark_text(base_image: Image.Image, text: str, font: ImageFont.ImageFont,
                         position: str, opacity: float):
    """Apply watermark text to an RGBA image and return the result."""
    watermark_layer = Image.new("RGBA", base_image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark_layer)

    pos = calculate_position(position, base_image.size, text, font)
    draw.text(pos, text, font=font, fill=(255, 255, 255, int(255 * opacity)))

    return Image.alpha_composite(base_image, watermark_layer)
