import pyttsx3
from pypdf import PdfReader

engine = pyttsx3.init()

engine.say("I will speak")
engine.runAndWait()
