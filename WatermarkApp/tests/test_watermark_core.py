import unittest
from PIL import Image, ImageFont
from watermark_core import (
    load_font,
    calculate_text_size,
    calculate_position,
    apply_watermark_text
)


class WatermarkCoreTests(unittest.TestCase):

    def setUp(self):
        self.image_size = (800, 600)
        self.text = "Sample Watermark"
        self.font = load_font("Arial", size=40)
        self.opacity = 0.5

    def test_font_fallback_for_missing_font(self):
        font = load_font("NonExistentFont", size=40)
        font_type = type(font).__name__
        self.assertIn(font_type, ["FreeTypeFont", "ImageFont"])

    def test_text_size_is_positive(self):
        width, height = calculate_text_size(self.text, self.font)
        self.assertGreater(width, 0)
        self.assertGreater(height, 0)

    def test_position_center_is_valid(self):
        pos = calculate_position(
            "Center", self.image_size, self.text, self.font)
        self.assertIsInstance(pos, tuple)
        self.assertEqual(len(pos), 2)

    def test_position_bottom_right_is_offset(self):
        pos = calculate_position(
            "Bottom-right", self.image_size, self.text, self.font)
        self.assertGreater(pos[0], 0)
        self.assertGreater(pos[1], 0)

    def test_watermark_application_returns_rgba_image(self):
        base = Image.new("RGBA", self.image_size, (255, 255, 255, 255))
        result = apply_watermark_text(
            base, self.text, self.font, "Bottom-right", self.opacity)
        self.assertEqual(result.size, self.image_size)
        self.assertEqual(result.mode, "RGBA")


if __name__ == "__main__":
    unittest.main()
