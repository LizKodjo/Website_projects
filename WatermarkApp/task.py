from tkinter import *
from PIL import Image, ImageDraw, ImageFont, ImageTk


window = Tk()
window.title('Watermark App')
window.config(padx=50, pady=50, bg='#896C6C')

canvas = Canvas(width=500, height=500, bg='#E5BEB5', highlightthickness=0)
# bg_image = ImageTk.PhotoImage(file='chocolate.jpg')
# canvas.create_image(250, 250, image=bg_image)
canvas.grid(column=1, row=1)

# Buttons
save_btn = Button(text='Save As')
save_btn.grid(column=0, row=0, padx=10, pady=10)

upload_btn = Button(text='Upload Image')
upload_btn.grid(column=2, row=0)

rotate_btn = Button(text='Rotation')
rotate_btn.grid(column=0, row=1, padx=10, pady=10)

opacity_btn = Button(text='Opacity')
opacity_btn.grid(column=2, row=1)

watermark_text = Entry(textvariable=StringVar, font=('calibre', 10, 'normal'))
watermark_text.insert(0, 'Enter text')
watermark_text.bind("<FocusIn>", lambda args: watermark_text.delete(0, "end"))
watermark_text.grid(column=0, row=2, padx=10, pady=10)

watermark_btn = Button(text='Add Text')
watermark_btn.grid(column=2, row=2, padx=10, pady=10)

window.mainloop()
