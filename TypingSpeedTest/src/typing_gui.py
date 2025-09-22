import tkinter as tk
import time
from typing_logic import calculate_wpm, get_random_sentence

FONT = ("Helvetica", 24, "bold")
FONT_SIZE = ("Helvetica", 16)
BG = "1E1E1E"


class TypingSpeedTest():
    def __init__(self, window):

        self.window = window
        self.window.title("Typing Speed Test")
        self.window.geometry("700X400")
        self.window.configure(bg=BG)

        self.start_time = None
        self.sentence = get_random_sentence()

        self.title = tk.Label(text="Typing Speed Test",
                              font=FONT, fg='#FFD700', bg=BG)
        self.title.pack(pady=20)

        self.sentence_label = tk.Label(
            window, text=self.sentence, font=FONT_SIZE, fg="#f5f5dc", bg=BG, wraplength=600)
        self.sentence_label.pack(pady=10)

        self.entry = tk.Entry(window, font=FONT_SIZE, width=60)
        self.entry.pack(pady=10)
        self.entry.bind("<KeyPress>", self.start_timer)

        self.result_label = tk.Label(
            window, text="", font=FONT_SIZE, fg="#90ee90", bg=BG)
        self.result_label.pack(pady=10)

    def start_timer(self, event):
        if self.start_time is None:
            self.start_time = time.time()
        if event.keysym == "Return":
            self.calculate_speed()

    def calculate_speed(self):
        end_time = time.time()
        typed_text = self.entry.get()
        time_taken = end_time - self.start_time
        wpm = calculate_wpm(typed_text, time_taken)
        self.result_label.config(text=f"Your typing speed is {wpm} WPM")

    def restart(self):
        self.start_time = None
        self.sentence = get_random_sentence()
        self.sentence_label.config(text=self.sentence)
        self.entry.delete(0, tk.END)
        self.result_label.config(text="")


if __name__ == "__main__":
    window = tk.Tk()
    app = TypingSpeedTest(window)
    window.mainloop()
