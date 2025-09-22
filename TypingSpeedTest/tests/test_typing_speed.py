import unittest
from src.typing_logic import calculate_wpm, get_random_sentence


class TestTypingLogic(unittest.TestCase):
    def test_calculate_wpm(self):
        typed_text = "The quick brown fox jumps over the lazy dog."
        time_taken = 10
        expected_wpm = round((9/10) * 60)
        self.assertEqual(calculate_wpm(typed_text, time_taken), expected_wpm)

    def test_get_random_sentence(self):
        sentence = get_random_sentence()
        self.assertIsInstance(sentence, str)
        self.assertGreater(len(sentence), 0)


if __name__ == "__main__":
    unittest.main()
