from PIL import Image
import numpy as np
from sklearn.cluster import KMeans


def rgb_to_hex(rgb):
    """Convert RGB to hexadecimal color code"""
    return '#{:02x}{:02}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))


def extract_colors(image_path, num_colors=5, max_dimension=200):
    """Extract dominant colors from an image using K-means clustering"""
    # Open and process image
    image = Image.open(image_path)

    # Resize image to speed up processing
    image.thumbnail((max_dimension, max_dimension))

    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Convert to numpy array
    img_array = np.array(image)
    pixels = img_array.reshape(-1, 3)

    # Use K-means to find dominant colors
    kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init=10)
    kmeans.fit(pixels)

    # Get the dominant colors
    colors = kmeans.cluster_centers_

    # Calculate the proportion of each color
    labels = kmeans.labels_
    color_counts = np.bincount(labels)
    color_percentages = color_counts / len(labels)

    # Create palette with colors and percentages
    palette = []
    for i, color in enumerate(colors):
        palette.append({'rgb': [int(c) for c in color], 'hex': rgb_to_hex(
            color), 'percentage': round(color_percentages[i] * 100, 2)})

    # Sort by percentage (most dominate first)
    palette.sort(key=lambda x: x['percentage'], reverse=True)

    return palette


def get_color_brightness(rgb):
    """Calculate perceived brightness of a color"""
    r, g, b = rgb
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
