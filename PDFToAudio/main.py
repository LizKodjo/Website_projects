import pyttsx3
from pypdf import PdfReader

engine = pyttsx3.init()

# Get the text

textToRead = input("Please select the text to read: ")
pgToRead = int(input("Please select the page to read: "))


with open(textToRead, "rb") as file:
    reader = PdfReader(file)
    number_of_pages = len(reader.pages)
    print(f"Number of pages: {number_of_pages}")
    page = reader.pages[pgToRead]
    text = page.extract_text()
    print(text)
    engine.say(text)
    engine.runAndWait()
