import unittest
from PIL import Image, ImageDraw, ImageFont
from watermark_core import calculate_position, apply_watermark_text


class TestWatermarkLogic(unittest.TestCase):
    def setUp(self):
        self.img_size = (800, 600)
        self.text = "Test"
        self.font = ImageFont.load_default()
        self.opacity = 0.5

    def test_position_bottom_right(self):
        pos = calculate_position(
            "Bottom-right", self.img_size, self.text, self.font)
        self.assertTrue(pos[0] > 0 and pos[1] > 0)

    def test_position_center(self):
        pos = calculate_position("Center", self.img_size, self.text, self.font)
        expected_x = (self.img_size[0] - self.font.getlength(self.text)) // 2
        self.assertAlmostEqual(pos[0], expected_x, delta=10)

    def text_watermark_opacity(self):
        base = Image.new("RGBA", self.img_size, (255, 255, 255, 255))
        result = apply_watermark_text(
            base, self.text, self.font, "Center", self.opacity)
        self.assertEqual(result.mode, "RGBA")

    def test_font_fallback(self):
        try:
            ImageFont.truetype("NonExistentFont.ttf", 40)
        except IOError:
            fallback = ImageFont.load_default()
            self.assertIsNotNone(fallback)


if __name__ == "__main__":
    unittest.main()
