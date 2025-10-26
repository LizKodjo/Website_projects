export default function ResumeDownload({
  variant = "primary",
  size = "medium",
}) {
  const handleDownload = () => {
    // Direct download link to the PDF in public folder

    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "EK.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getButtonClass = () => {
    const baseClass = "btn";
    const variantClass = `btn-${variant}`;
    const sizeClass = size === "small" ? "btn-small" : "";
    return `${baseClass} ${variantClass} ${sizeClass}`.trim();
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className={getButtonClass()}
        aria-label="Downlaod Resume"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          style={{ marginRight: "0.5rem" }}
        >
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
        </svg>{" "}
        Download Resume
      </button>
    </>
  );
}
