import random

# Sentences to use for test
sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed is measured in words per minute",
    "Practice makes perfect when it comes to typing.",
    "Python is a versatile programming language.",
    "Accessibility and design go hand in hand."
]


def get_random_sentence():
    """Selects a random sentence to use for test."""
    return random.choice(sentences)


def calculate_wpm(typed_text, time_taken):
    """Calculate words per minute to determine speed"""
    word_count = len(typed_text.split())
    return round((word_count / time_taken) * 60)
