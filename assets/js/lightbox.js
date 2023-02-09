document.querySelectorAll("[data-lightbox]").forEach((lb) => {
  lb.addEventListener("keydown", ({ key }) => {
    if (key === "Escape") lb.removeAttribute("open");
  });
});
