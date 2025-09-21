from tkinter import *
from tkinter import filedialog as fd
from tkinter.messagebox import showinfo
from PIL import Image, ImageTk


# Functions for buttons
def select_img():
    """Fetches and displays image"""
    sel_img = view_img()

    img = Image.open(sel_img)

    img = img.resize((250, 250))
    img = ImageTk.PhotoImage(img)

    panel = Label(window, image=img)

    panel.image = img
    panel.grid(column=1, row=1)


def view_img():
    '''Returns image path'''
    filename = fd.askopenfilename(title='Open')
    # print(filename)
    return filename


# Create the window to view image
window = Tk()
window.title('Watermark App')
window.config(padx=50, pady=50, bg='#CFAB8D')


# Create buttons and input
upload_imgBtn = Button(text='Upload Image', command=select_img)
upload_imgBtn.grid(column=0, row=2, padx=10, pady=10, columnspan=2)

watermark_text = Entry(textvariable=StringVar, font=('calibre', 10, 'normal'))
watermark_text.insert(0, 'Watermark Text')
watermark_text.bind("<FocusIn>", lambda args: watermark_text.delete(0, 'end'))
watermark_text.grid(column=2, row=0, padx=10, pady=10)

watermark_btn = Button(text="Add Watermark")
watermark_btn.grid(column=2, row=1, padx=10, pady=10)

window.mainloop()
