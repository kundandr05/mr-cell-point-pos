from PIL import Image

def remove_white_background(input_path, output_path, tolerance=240):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is close to white
        # White is (255, 255, 255, 255)
        # Using a tolerance to handle slight compression artifacts
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            # Change all white-ish pixels to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

print("Processing logo.jpg...")
remove_white_background("public/logo.jpg", "public/logo.png", 230)
print("Saved to logo.png")
