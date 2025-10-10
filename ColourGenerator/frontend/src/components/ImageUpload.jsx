import { useCallback, useState } from "react";

export default function ImageUpload({ onPaletteGenerated }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [numColors, setNumColors] = useState(5);

  const handleFile = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await uploadImage(file, numColors);
      if (result.success) {
        onPaletteGenerated(result.palette, file);
      } else {
        setError(result.error || "Failed to generate palette");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [numColors]
  );

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <>
      <div className="image-upload">
        <div
          className={`drop - zone ${isDragging ? "dragging" : ""} ${
            isLoading ? "loading" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="loading-message">Processing image...</div>
          ) : (
            <div>
              <div className="upload-icon">📁</div>
              <p>Drag & drop an image here, or click to select</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <div className="controls">
          <label htmlFor="numColors">Number of colors: {numColors}</label>
          <input
            id="numColors"
            type="range"
            min="3"
            max="10"
            value={numColors}
            onChange={(e) => setNumColors(parseInt(e.target.value))}
            disabled={isLoading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
}
