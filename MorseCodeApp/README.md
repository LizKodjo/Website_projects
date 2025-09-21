# 🔠 Morse Code Converter (Python CLI)

A sleek, multilingual command-line tool that converts text strings into Morse code using the `MorseCodePy` library. Built with Python, this project demonstrates clean third-party integration, internationalization, and user-friendly CLI interaction.

## ✨ Features

- 🌍 Converts text to Morse code in multiple languages:
  - English, Russian, Ukrainian, Spanish, French
- 🔤 Supports letters, numbers, and punctuation
- 🛠️ Uses [`MorseCodePy`](https://pypi.org/project/MorseCodePy/) for encoding
- 🚫 Graceful fallback to English if an invalid language is selected
- 🖥️ Lightweight CLI interface for quick use and testing

## 📦 Installation

```bash
pip install MorseCodePy
```

## Usage

```
python main.py
```

## 🧠 How it Works

The program uses the `encode()` function from [`MorseCodePy`](https://pypi.org/project/MorseCodePy/), which supports multiple alphabets. Users select a language code and the input string is encoded accordingly. If an invalid code is entered, the program defaults to English.

## 🚀Future Enhancements

- 🔁 Add reverse coding (Morse -> Text)
- 🔊 Optional sound playback for Morse tones
- 🌐 Web interface using Flask or FastAPI
- ✅ Unit tests for reliability
- 🎨 ASCII banner or CLI branding to match luxury aesthetic

## 👩‍💻 Author

### Elizabeth Kodjo

Founder of [`Elizabeth Kodjo IT Ltd`]()
Full-Stack Developer & Software Test Engineer
Specialising in Python backend, React/Vite frontend, manual and automation testing.
Committed to accessibility, elegant design and technical excellence.
