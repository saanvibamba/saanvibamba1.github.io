document.querySelectorAll(".slider").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsWrap = slider.querySelector(".dots");

  if (!slider.hasAttribute("tabindex")) slider.setAttribute("tabindex", "0");

  if (slides.length === 0) return;

  if (slides.length === 1) {
    slides[0].classList.add("active");
    slides[0].setAttribute("aria-hidden", "false");
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (dotsWrap) dotsWrap.style.display = "none";
    return;
  }

  let index = slides.findIndex((s) => s.classList.contains("active"));
  if (index === -1) index = 0;

  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
    s.setAttribute("aria-hidden", i === index ? "false" : "true");
  });

  let dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = "";

    dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (i === index ? " active" : "");
      b.setAttribute("aria-label", `Go to image ${i + 1}`);
      b.setAttribute("aria-pressed", i === index ? "true" : "false");
      b.addEventListener("click", () => show(i));
      dotsWrap.appendChild(b);
      return b;
    });
  }

  function show(i) {
    slides[index].classList.remove("active");
    slides[index].setAttribute("aria-hidden", "true");
    if (dots[index]) {
      dots[index].classList.remove("active");
      dots[index].setAttribute("aria-pressed", "false");
    }

    index = (i + slides.length) % slides.length;

    slides[index].classList.add("active");
    slides[index].setAttribute("aria-hidden", "false");
    if (dots[index]) {
      dots[index].classList.add("active");
      dots[index].setAttribute("aria-pressed", "true");
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", () => show(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(index + 1));

  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      show(index + 1);
    }
  });

  let startX = null;
  let startY = null;
  const SWIPE_THRESHOLD = 40;

  slider.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    if (startX === null || startY === null) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dy) > Math.abs(dx)) {
      startX = null;
      startY = null;
      return;
    }

    if (dx > SWIPE_THRESHOLD) {
      show(index - 1);
    } else if (dx < -SWIPE_THRESHOLD) {
      show(index + 1);
    }

    startX = null;
    startY = null;
  }, { passive: true });

  
  let timer = setInterval(() => show(index + 1), 6000);

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", () => timer = setInterval(() => show(index + 1), 6000));
  slider.addEventListener("focusin", () => clearInterval(timer));
  slider.addEventListener("focusout", () => timer = setInterval(() => show(index + 1), 6000));
});
