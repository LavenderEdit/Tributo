// DOM Elements
const navbar = document.getElementById("navbar")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const carouselSlides = document.querySelectorAll(".carousel-slide")
const indicators = document.querySelectorAll(".indicator")
const revealMemoriasBtn = document.getElementById("reveal-memorias")
const revealPalabrasBtn = document.getElementById("reveal-palabras")
const memoriasContent = document.getElementById("memorias-content")
const palabrasContent = document.getElementById("palabras-content")

const musicFloatBtn = document.getElementById("music-float-btn");
const volumeSlider = document.getElementById("volume-slider");
const backgroundMusic = document.getElementById("background-music");

// State
let currentSlide = 0;
let isPlaying = false;
let memoriasRevealed = false;
let palabrasRevealed = false;
let touchStartX = 0;
let touchEndX = 0;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initializeCarousel()
    initializeNavbar()
    initializeLazyLoading()
    initializeMusic()
    initializeTouchGestures()
})

// Navbar functionality
function initializeNavbar() {
    // Toggle mobile menu
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        navToggle.classList.toggle("active")
    })

    // Close mobile menu when clicking on links
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active")
            navToggle.classList.remove("active")
        })
    })

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })

    // Smooth scrolling for navigation links
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            const targetId = link.getAttribute("href")
            const targetSection = document.querySelector(targetId)
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        })
    })
}

// Carousel functionality
function initializeCarousel() {
    // Auto-advance carousel
    setInterval(() => {
        nextSlide()
    }, 5000)

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            goToSlide(index)
        })
    })

    // Initialize first slide
    showSlide(0)
}

function showSlide(index) {
    // Hide all slides
    carouselSlides.forEach((slide) => {
        slide.classList.remove("active")
    })

    // Remove active from all indicators
    indicators.forEach((indicator) => {
        indicator.classList.remove("active")
    })

    // Show current slide
    carouselSlides[index].classList.add("active")
    indicators[index].classList.add("active")

    currentSlide = index
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % carouselSlides.length
    goToSlide(nextIndex)
}

function prevSlide() {
    const prevIndex = currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1
    goToSlide(prevIndex)
}

function goToSlide(index) {
    showSlide(index)
}

// Touch gestures for mobile carousel
function initializeTouchGestures() {
    const carouselContainer = document.querySelector(".carousel-container")

    carouselContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX
    })

    carouselContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
    })
}

function handleSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide()
        } else {
            prevSlide()
        }
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]')

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target
                    img.src = img.src
                    img.classList.remove("loading")
                    observer.unobserve(img)
                }
            })
        })

        images.forEach((img) => {
            img.classList.add("loading")
            imageObserver.observe(img)
        })
    }
}

// Reveal animations
revealMemoriasBtn.addEventListener("click", () => {
    if (!memoriasRevealed) {
        revealMemoriasBtn.style.display = "none"
        memoriasContent.classList.add("revealed")

        const memoriaItems = document.querySelectorAll(".memoria-item")
        memoriaItems.forEach((item, index) => {
            const delay = Number.parseInt(item.dataset.delay)
            setTimeout(() => {
                item.classList.add("animate")
            }, delay)
        })

        memoriasRevealed = true
    }
})

revealPalabrasBtn.addEventListener("click", () => {
    if (!palabrasRevealed) {
        revealPalabrasBtn.style.display = "none"
        palabrasContent.classList.add("revealed")

        const palabraItems = document.querySelectorAll(".palabra-item")
        palabraItems.forEach((item, index) => {
            const delay = Number.parseInt(item.dataset.delay)
            setTimeout(() => {
                item.classList.add("animate")
            }, delay)
        })

        palabrasRevealed = true
    }
})

// Inicializa el reproductor
function initializeMusic() {
    backgroundMusic.volume = 0.3;

    // Intento de autoplay
    backgroundMusic.play()
        .then(() => {
            isPlaying = true;
            updateFloatButton();
        })
        .catch(() => {
            // Queda en pausa hasta que el usuario haga click
            isPlaying = false;
            updateFloatButton();
        });

    // Toggle al click
    musicFloatBtn.addEventListener("click", () => {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
            updateFloatButton();
        } else {
            // LLama a play y actualiza el icono **sólo** cuando realmente comience
            backgroundMusic.play().then(() => {
                isPlaying = true;
                updateFloatButton();
            }).catch((err) => {
                console.warn("Play bloqueado:", err);
                isPlaying = false;
                updateFloatButton();
            });
        }
    });

    // Volumen
    volumeSlider.addEventListener("input", (e) => {
        backgroundMusic.volume = e.target.value / 100;
    });

    // Al terminar la pista
    backgroundMusic.addEventListener("ended", () => {
        isPlaying = false;
        updateFloatButton();
    });
}

// Actualiza el icono del botón flotante
function updateFloatButton() {
    const icon = musicFloatBtn.querySelector("#music-icon");
    icon.className = isPlaying ? "fas fa-volume-up" : "fas fa-volume-mute";
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        prevSlide()
    } else if (e.key === "ArrowRight") {
        nextSlide()
    } else if (e.key === " ") {
        e.preventDefault()
        toggleMusic()
    }
})

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
        }
    })
}, observerOptions)

// Observe elements for scroll animations
document.querySelectorAll(".section-title, .section-description").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease"
    observer.observe(el)
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Optimized scroll handler
const handleScroll = debounce(() => {
    const scrolled = window.scrollY > 50
    navbar.classList.toggle("scrolled", scrolled)
}, 10)

window.addEventListener("scroll", handleScroll)

// Preload next carousel image
function preloadNextImage() {
    const nextIndex = (currentSlide + 1) % carouselSlides.length
    const nextImage = carouselSlides[nextIndex].querySelector("img")
    if (nextImage && !nextImage.complete) {
        const img = new Image()
        img.src = nextImage.src
    }
}

// Call preload on slide change
setInterval(preloadNextImage, 4000)

// Error handling for audio
backgroundMusic.addEventListener("error", (e) => {
    console.log("Audio error:", e)
    musicToggle.style.display = "none"
})

// Accessibility improvements
document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
    }
})

document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation")
})

// Add focus styles for keyboard navigation
const style = document.createElement("style")
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-color) !important;
        outline-offset: 2px;
    }
`
document.head.appendChild(style)
