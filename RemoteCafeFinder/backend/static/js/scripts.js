const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current == "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Load saved theme
const saved = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", saved);
