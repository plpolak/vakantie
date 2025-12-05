// Handmatige lijst van bestandsnamen uit de map 'pictures'.
const imageFiles = [
    "219999015.jpg",
    "219999023.jpg",
    "219999031.jpg",
    "219999041.jpg",
    "219998985.jpg",
    "219998991.jpg",
    "219998999.jpg",
    "219998995.jpg",
    "219999093.jpg",
    "219999057.jpg",
    "219999061.jpg",
    "219999067.jpg",
    "219999071.jpg",
    "219999081.jpg",
    "219999085.jpg",
    "219998979.jpg",
    "219999109.jpg",
    "219999099.jpg",
    "219999103.jpg",
    "219999005.jpg"
].map((file) => `pictures/${file}`);

const carouselEl = document.querySelector(".carousel");
const slidesRoot = document.querySelector("[data-slides]");
const dotsRoot = document.querySelector("[data-dots]");
const prevBtn = document.querySelector("[data-prev]");
const nextBtn = document.querySelector("[data-next]");
const fullscreenBtn = document.querySelector("[data-fullscreen]");
const emptyMessage = document.querySelector("[data-empty]");

let currentIndex = 0;
let slides = [];
let dots = [];
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
const swipeThreshold = 40;
const verticalLimit = 80;

function buildSlides() {
    if (!imageFiles.length) {
        emptyMessage.hidden = false;
        document.querySelector(".carousel").hidden = true;
        return;
    }

    imageFiles.forEach((src, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.dataset.index = index;

        const img = document.createElement("img");
        img.alt = `Vakantiefoto ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        img.dataset.src = src;

        slide.append(img);
        slidesRoot.append(slide);
        slides.push(slide);

        const dot = document.createElement("span");
        dot.className = "dot";
        dot.setAttribute("role", "button");
        dot.tabIndex = 0;
        dot.dataset.index = index;
        dotsRoot.append(dot);
        dots.push(dot);
    });
}

function loadImage(index) {
    const slide = slides[index];
    if (!slide) return;
    const img = slide.querySelector("img");
    if (!img.src) {
        img.src = img.dataset.src;
    }
}

function setActive(index) {
    const total = slides.length;
    currentIndex = (index + total) % total;

    slides.forEach((slide) => slide.classList.remove("is-active"));
    dots.forEach((dot) => dot.classList.remove("is-active"));

    loadImage(currentIndex);
    slides[currentIndex].classList.add("is-active");
    dots[currentIndex].classList.add("is-active");
}

function next() { setActive(currentIndex + 1); }
function prev() { setActive(currentIndex - 1); }

function toggleFullscreen() {
    document.body.classList.toggle("fullscreen-mode");
}

function wireEvents() {
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    fullscreenBtn.addEventListener("click", toggleFullscreen);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
        if (event.key === "Escape" && document.body.classList.contains("fullscreen-mode")) {
            toggleFullscreen();
        }
    });

    // Basis swipe-ondersteuning voor touchscreens.
    const onTouchStart = (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
    };

    const onTouchEnd = (event) => {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = Math.abs(touch.clientY - touchStartY);
        const duration = Date.now() - touchStartTime;

        if (dy > verticalLimit) return;
        if (Math.abs(dx) < swipeThreshold) return;
        if (duration > 800) return;

        if (dx < 0) next();
        else prev();
    };

    if (carouselEl) {
        carouselEl.addEventListener("touchstart", onTouchStart, { passive: true });
        carouselEl.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    dots.forEach((dot) => {
        const goTo = () => setActive(Number(dot.dataset.index));
        dot.addEventListener("click", goTo);
        dot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goTo();
            }
        });
    });
}

buildSlides();

if (imageFiles.length) {
    setActive(0);
    wireEvents();
}
