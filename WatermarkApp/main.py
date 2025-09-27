import tkinter as tk
from tkinter import filedialog, ttk
from PIL import Image, ImageTk
from watermark_core import load_font, apply_watermark_text


class WatermarkApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Watermark Application")
        self.image_path = None
        self.original_image = None
        self.preview_image = None
        self.watermarked_image = None

        self.setup_ui()

    def setup_ui(self):
        # Layout frames
        self.left_frame = tk.Frame(
            self.root, width=400, height=400, bg="#e6ecf0")
        self.left_frame.pack(side=tk.LEFT, padx=10, pady=10)
        self.left_frame.pack_propagate(False)

        self.right_frame = tk.Frame(self.root)
        self.right_frame.pack(side=tk.RIGHT, padx=10, pady=10)

        # Image preview
        self.image_label = tk.Label(
            self.left_frame, text="Select an image...", bg="#e6ecf0")
        self.image_label.pack(expand=True)

        # Upload button
        tk.Button(self.right_frame, text="Upload Image",
                  command=self.upload_image).pack(pady=5)

        # Watermark text
        tk.Label(self.right_frame, text="Watermark").pack()
        self.watermark_entry = tk.Entry(self.right_frame, width=30)
        self.watermark_entry.insert(0, "Watermark goes here")
        self.watermark_entry.pack(pady=5)

        # Font selection
        tk.Label(self.right_frame, text="Font").pack()
        self.font_var = tk.StringVar(value="Arial")
        ttk.Combobox(self.right_frame, textvariable=self.font_var,
                     values=["Arial", "Times New Roman", "Courier"]).pack(pady=5)

        # Position selection
        tk.Label(self.right_frame, text="Position").pack()
        self.position_var = tk.StringVar(value="Bottom-right")
        ttk.Combobox(self.right_frame, textvariable=self.position_var,
                     values=["Top-left", "Top-right", "Center", "Bottom-left", "Bottom-right"]).pack(pady=5)

        # Opacity slider
        tk.Label(self.right_frame, text="Opacity").pack()
        self.opacity = tk.DoubleVar(value=0.5)
        tk.Scale(self.right_frame, variable=self.opacity, from_=0.1, to=1.0,
                 resolution=0.1, orient=tk.HORIZONTAL).pack(pady=5)

        # Apply and Save buttons
        tk.Button(self.right_frame, text="Apply watermark",
                  command=self.apply_watermark).pack(pady=10)
        tk.Button(self.right_frame, text="Save image",
                  command=self.save_image).pack(pady=5)

    def upload_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.png *.jpg *.jpeg")])
        if file_path:
            self.image_path = file_path
            self.original_image = Image.open(file_path).convert("RGBA")
            self.display_image(self.original_image)

    def display_image(self, img):
        img_resized = img.resize((400, 400), Image.Resampling.LANCZOS)
        self.preview_image = ImageTk.PhotoImage(img_resized)
        self.image_label.config(image=self.preview_image, text="")

    def apply_watermark(self):
        if not self.original_image:
            return

        watermark_text = self.watermark_entry.get()
        font_name = self.font_var.get()
        opacity = self.opacity.get()
        position_choice = self.position_var.get()

        font = load_font(font_name, size=40)
        self.watermarked_image = apply_watermark_text(
            self.original_image, watermark_text, font, position_choice, opacity
        )
        self.display_image(self.watermarked_image)

    def save_image(self):
        if self.watermarked_image:
            file_path = filedialog.asksaveasfilename(defaultextension=".png",
                                                     filetypes=[("PNG files", "*.png"), ("JPEG files", "*.jpg")])
            if file_path:
                rgb_image = self.watermarked_image.convert("RGB")
                rgb_image.save(file_path)


if __name__ == "__main__":
    root = tk.Tk()
    app = WatermarkApp(root)
    root.mainloop()
