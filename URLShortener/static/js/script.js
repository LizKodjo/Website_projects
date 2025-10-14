function copyToClipboard() {
  const shortUrlInput = document.getElementById("short-url");
  shortUrlInput.select();
  shortUrlInput.setSelectionRange(0, 99999);
  document.execCommand("copy");

  // Show feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "Copied";
  button.classList.remove("btn-outline-secondary");
  button.classList.add("btn-success");

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("btn-success");
    button.classList.add("btn-outline-secondary");
  }, 2000);
}
