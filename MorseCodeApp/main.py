from MorseCodePy import encode

# List supported languages
AVAILABLE_LANGUAGES = {
    "english": "English",
    "russian": "Russian",
    "spanish": "Spanish",
    "french": "French",
    "ukrainian": "Ukrainian",
    "numbers": "Numbers",
    "special": "Special Characters"
}


def text_to_morse(user_text, lang="english"):
    try:
        morse_code = encode(user_text, language=lang)
        return morse_code
    except Exception as e:
        return f"Error: {e}"


def select_language():
    print("Select a language for Morse conversion: ")
    for code, name in AVAILABLE_LANGUAGES.items():
        print(f"{code} - {name}")
    lang = input(
        "Enter language code (default is 'english'): ").strip().lower()
    return lang if lang in AVAILABLE_LANGUAGES else "english"


if __name__ == "__main__":
    language = select_language()
    user_text = input("Enter a string to conver to Morse code: ")
    result = text_to_morse(user_text, lang=language)
    print(f"\nLanguage: {AVAILABLE_LANGUAGES[language]}")
    print(f"Morse Code: {result}")
