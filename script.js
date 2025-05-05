/* ==========================================================================
   PARTICLE CANVAS SETUP
   ========================================================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: -100, y: -100 };

// Suivi de la souris
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Configuration des points
const spacing = 50;
const pointSize = 2;
const influenceDistance = 120;
const maxDisplacement = 25;

const points = [];

// Création de la grille de points
for (let x = spacing / 2; x < canvas.width; x += spacing) {
    for (let y = spacing / 2; y < canvas.height; y += spacing) {
        points.push({ x, y, baseX: x, baseY: y });
    }
}

// Fonction de dessin des points
function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < influenceDistance) {
            const force = (1 - distance / influenceDistance) * maxDisplacement;
            const angle = Math.atan2(dy, dx);
            point.x = point.baseX - Math.cos(angle) * force;
            point.y = point.baseY - Math.sin(angle) * force;
        } else {
            point.x += (point.baseX - point.x) * 0.1;
            point.y += (point.baseY - point.y) * 0.1;
        }

        const proximity = Math.max(0, 1 - distance / influenceDistance);
        const brightness = 100 + proximity * 155;
        const size = pointSize + proximity * 4;

        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawPoints);
}

// Recalcule la grille lors du redimensionnement
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    points.length = 0;

    for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
            points.push({ x, y, baseX: x, baseY: y });
        }
    }
});

drawPoints();

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Mise à jour de la position du curseur
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Détection hover sur les éléments cliquables
const clickableElements = document.querySelectorAll('a, button, .clickable, .menu-toggle');
const formInputs = document.querySelectorAll('input, textarea');

clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursor.classList.remove('input-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Ajouter les événements pour les champs du formulaire
formInputs.forEach(input => {
    input.addEventListener('mouseenter', () => {
        cursor.classList.add('input-hover');
        cursor.classList.remove('hover');
    });
    input.addEventListener('mouseleave', () => {
        cursor.classList.remove('input-hover');
    });
});

/* ==========================================================================
   NAVIGATION LINKS ANIMATION
   ========================================================================== */
const links = document.querySelectorAll('.nav-links a');

// Fonction pour démarrer l'animation arc-en-ciel
function startRainbowAnimation(link) {
    let hue1 = Math.floor(Math.random() * 360);
    let hue2 = (hue1 + 60) % 360;

    link.hoverInterval = setInterval(() => {
        hue1 = (hue1 + 1) % 360;
        hue2 = (hue1 + 60) % 360;

        const color1 = `hsl(${hue1}, 100%, 70%)`;
        const color2 = `hsl(${hue2}, 100%, 70%)`;

        link.style.backgroundImage = `linear-gradient(90deg, ${color1}, ${color2})`;
        link.style.color = 'transparent';
        link.style.backgroundClip = 'text';
        link.style.webkitBackgroundClip = 'text';
    }, 20);
}

// Vérifier quel lien est actif en fonction de l'URL actuelle
function setActiveLink() {
    const currentPath = window.location.pathname;
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
            startRainbowAnimation(link);
        }
    });
}

// Appliquer les événements à chaque lien
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('active')) {
            startRainbowAnimation(link);
        }
    });

    link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
            clearInterval(link.hoverInterval);
            link.style.color = '';
            link.style.backgroundImage = '';
            link.style.backgroundClip = 'unset';
            link.style.webkitBackgroundClip = 'unset';
        }
    });
});

// Initialiser les liens actifs au chargement de la page
setActiveLink();

/* ==========================================================================
   GLOBAL RAINBOW ANIMATION
   ========================================================================== */
let globalHue = Math.floor(Math.random() * 360);

function updateRainbowColors() {
    globalHue = (globalHue + 1) % 360;
    const hue2 = (globalHue + 60) % 360;
    const color1 = `hsl(${globalHue}, 100%, 70%)`;
    const color2 = `hsl(${hue2}, 100%, 70%)`;
    const gradient = `linear-gradient(90deg, ${color1}, ${color2})`;

    // Ajout de l'animation RGB pour le lien portfolio
    const portfolioLink = document.querySelector('.portfolio-link a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const excludedPages = ['index.html', 'contact.html', 'mentions-legales.html'];
    
    if (portfolioLink && !excludedPages.includes(currentPage)) {
        portfolioLink.style.backgroundImage = gradient;
        portfolioLink.style.color = 'transparent';
        portfolioLink.style.backgroundClip = 'text';
        portfolioLink.style.webkitBackgroundClip = 'text';
        portfolioLink.style.transition = 'none'; // Désactive la transition pour éviter les conflits
    }

    // Cibler tous les éléments avec la classe 'rainbow-btn' pour appliquer l'effet de couleur global
    const rainbowButtons = document.querySelectorAll('.rainbow-btn');
    rainbowButtons.forEach(button => {
        button.style.backgroundImage = gradient;
        button.style.color = 'black';
        button.style.transition = 'none'; // Désactive la transition pour éviter les conflits
    });

    // Appliquer l'effet RVB à tous les éléments avec la classe text-tag
    const textTags = document.querySelectorAll('.text-tag');
    textTags.forEach(tag => {
        tag.style.backgroundImage = gradient;
        tag.style.color = 'transparent';
        tag.style.backgroundClip = 'text';
        tag.style.webkitBackgroundClip = 'text';
    });

    // Appliquer l'effet RVB à tous les éléments avec la classe text-rgb
    const textRgbElements = document.querySelectorAll('.text-rgb');
    textRgbElements.forEach(element => {
        element.style.backgroundImage = gradient;
        element.style.color = 'transparent';
        element.style.backgroundClip = 'text';
        element.style.webkitBackgroundClip = 'text';
    });

    // Appliquer l'effet RGB à la barre de progression
    const loadingBars = document.querySelectorAll('.loading-bar');
    loadingBars.forEach(bar => {
        bar.style.backgroundImage = gradient;
        bar.style.backgroundColor = '#9147ff'; // Couleur violette de base
    });

    // Footer Bottom
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        footerBottom.style.backgroundImage = gradient;
    }

    // Footer Titles
    const footerTitles = document.querySelectorAll('.footer-sitemap h3, .footer-contact h3');
    footerTitles.forEach(title => {
        title.style.backgroundImage = gradient;
        title.style.color = 'transparent';
        title.style.backgroundClip = 'text';
        title.style.webkitBackgroundClip = 'text';
    });

    // Credit Text
    const creditText = document.querySelector('.credit-text');
    if (creditText) {
        creditText.style.color = 'black';
    }

    // Big Text
    const bigText = document.querySelector('.big-text');
    if (bigText) {
        bigText.style.backgroundImage = gradient;
        bigText.style.color = 'transparent';
        bigText.style.backgroundClip = 'text';
        bigText.style.webkitBackgroundClip = 'text';
    }

    // Contact Title
    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) {
        contactTitle.style.backgroundImage = gradient;
        contactTitle.style.color = 'transparent';
        contactTitle.style.backgroundClip = 'text';
        contactTitle.style.webkitBackgroundClip = 'text';
    }

    // Numbers in mentions légales
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        number.style.backgroundImage = gradient;
        number.style.color = 'transparent';
        number.style.backgroundClip = 'text';
        number.style.webkitBackgroundClip = 'text';
    });

    // Stars
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.backgroundImage = gradient;
        star.style.color = 'transparent';
        star.style.backgroundClip = 'text';
        star.style.webkitBackgroundClip = 'text';
    });

    // Carousel Background Text
    const carouselBackgrounds = document.querySelectorAll('.carousel-background');
    carouselBackgrounds.forEach(text => {
        text.style.color = 'transparent';
        text.style.webkitTextStroke = '2px';
        text.style.webkitTextStrokeColor = color1;
    });
}

// Démarrer l'animation synchronisée
setInterval(updateRainbowColors, 20);

/* ==========================================================================
   3D PARALLAX EFFECT
   ========================================================================== */
const element3D = document.getElementById('nom');

window.addEventListener('mousemove', (e) => {
    const xRel = e.clientX - window.innerWidth / 2;
    const yRel = e.clientY - window.innerHeight / 2;
    
    const rotateY = xRel / 50;
    const rotateX = -yRel / 50;

    element3D.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    });
});

// Fermer le menu si on redimensionne l'écran au-dessus de 768px
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

/* ==========================================================================
   PORTFOLIO CARDS ANIMATION
   ========================================================================== */
const portfolioCards = document.querySelectorAll('.portfolio-card');

portfolioCards.forEach(card => {
    let hueInterval;
    
    card.addEventListener('mouseenter', () => {
        /*
        let hue = Math.floor(Math.random() * 360);
        let hue2 = (hue + 60) % 360;
        
        hueInterval = setInterval(() => {
            hue = (hue + 1) % 360;
            hue2 = (hue + 120) % 360;
            const color1 = `hsl(${hue}, 100%, 70%)`;
            const color2 = `hsl(${hue2}, 100%, 70%)`;
            card.style.borderColor = color1;
            card.style.borderWidth = '4px';
        }, 15);
        */
    });
    
    card.addEventListener('mouseleave', () => {
        /*
        clearInterval(hueInterval);
        card.style.borderColor = 'white';
        card.style.borderWidth = '1px';
        */
    });
});

/* ==========================================================================
   3D CAROUSEL
   ========================================================================== */
const carousels = document.querySelectorAll('.carousel');
const carouselContainers = document.querySelectorAll('.carousel-container');

carouselContainers.forEach((container, index) => {
    const carousel = container.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    let currentAngle = 0;
    const rotationSpeed = 0.1;
    const hoverRotationSpeed = 2;
    const totalItems = items.length;
    const angleStep = 360 / totalItems;
    let isHovering = false;
    let mouseX = 0;
    let targetAngle = 0;
    let touchStartX = 0;
    let touchStartAngle = 0;

    // Positionne les éléments en cercle
    function positionItems() {
        items.forEach((item, index) => {
            const angle = index * angleStep;
            const radian = ((angle + currentAngle) * Math.PI) / 180;
            const x = Math.sin(radian) * radius;
            const z = Math.cos(radian) * radius;
            
            item.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-currentAngle}deg)`;
            
            const distance = Math.abs(((angle + currentAngle + 540) % 360) - 180);
            item.classList.toggle('far', distance > 90);
        });
    }

    // Animation de rotation
    function animate() {
        if (isHovering) {
            const relativeX = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
            targetAngle = currentAngle + (relativeX * hoverRotationSpeed);
        } else {
            targetAngle = currentAngle + rotationSpeed;
        }

        currentAngle += (targetAngle - currentAngle) * 0.3;
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
        positionItems();
        requestAnimationFrame(animate);
    }

    // Gestion des événements de la souris
    container.addEventListener('mousemove', (e) => {
        isHovering = true;
        mouseX = e.clientX;
    });

    container.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    // Gestion des événements tactiles
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartAngle = currentAngle;
        isHovering = true;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isHovering) return;
        
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        const sensitivity = 0.5;
        
        targetAngle = touchStartAngle - (deltaX * sensitivity);
    });

    container.addEventListener('touchend', () => {
        isHovering = false;
    });

    // Démarrer l'animation
    animate();

    // Désactivation de la sélection de texte
    container.addEventListener('selectstart', (e) => e.preventDefault());
});

/* ==========================================================================
   SCROLL STAR ANIMATION
   ========================================================================== */
const starsRotate = document.querySelectorAll('.star-rotate');
let rotation = 0;
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
    
    rotation += 5 * scrollDirection; // Vitesse de rotation avec direction
    
    // Appliquer la rotation à toutes les étoiles
    starsRotate.forEach(star => {
        star.style.transform = `rotate(${rotation}deg)`;
    });
    
    lastScrollTop = scrollTop;
});

/* ==========================================================================
   PORTFOLIO FILTERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter_buttons button');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const activeFilters = {
        type: 'all',
        year: 'all',
        school: 'all'
    };

    function filterCards() {
        portfolioCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const year = card.getAttribute('data-year');
            const school = card.getAttribute('data-school');

            const typeMatch = activeFilters.type === 'all' || 
                            category.split(' ').includes(activeFilters.type);
            const yearMatch = activeFilters.year === 'all' || 
                            year.split(' ').includes(activeFilters.year);
            const schoolMatch = activeFilters.school === 'all' || school === activeFilters.school;

            if (typeMatch && yearMatch && schoolMatch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.parentElement.classList.contains('filter-type') ? 'type' :
                             button.parentElement.classList.contains('filter-year') ? 'year' : 'school';
            
            // Retirer la classe active de tous les boutons du même groupe
            button.parentElement.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active', 'active-year', 'active-school');
            });
            
            // Ajouter la classe active appropriée au bouton cliqué
            if (filterType === 'type') {
                button.classList.add('active');
            } else if (filterType === 'year') {
                button.classList.add('active-year');
            } else if (filterType === 'school') {
                button.classList.add('active-school');
            }
            
            // Mettre à jour le filtre actif
            activeFilters[filterType] = button.getAttribute(`data-${filterType === 'type' ? 'category' : filterType}`);
            
            // Appliquer le filtrage
            filterCards();
        });
    });

    // Appliquer le filtrage initial
    filterCards();
});

/* ==========================================================================
   REALISATION CAROUSEL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.realisation-carousel');
    
    carousels.forEach(carousel => {
        const container = carousel.parentElement;
        const items = carousel.querySelectorAll('.realisation-carousel-item');
        const leftArrow = container.querySelector('.carousel-arrow-left');
        const rightArrow = container.querySelector('.carousel-arrow-right');
        
        let currentIndex = 0;
        const itemsPerView = 4;
        const totalItems = items.length;
        
        // Cloner les éléments pour l'effet infini
        const firstItems = Array.from(items).slice(0, itemsPerView);
        const lastItems = Array.from(items).slice(-itemsPerView);
        
        firstItems.forEach(item => {
            const clone = item.cloneNode(true);
            carousel.appendChild(clone);
        });
        
        lastItems.forEach(item => {
            const clone = item.cloneNode(true);
            carousel.insertBefore(clone, carousel.firstChild);
        });
        
        // Mettre à jour l'index après le clonage
        currentIndex = itemsPerView;
        
        function updateCarousel() {
            const offset = currentIndex * (100 / itemsPerView);
            carousel.style.transform = `translateX(-${offset}%)`;
        }
        
        function moveLeft() {
            currentIndex--;
            updateCarousel();
            
            // Si on atteint le début, on saute à la fin
            if (currentIndex < itemsPerView) {
                setTimeout(() => {
                    currentIndex = totalItems;
                    carousel.style.transition = 'none';
                    updateCarousel();
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }, 500);
            }
        }
        
        function moveRight() {
            currentIndex++;
            updateCarousel();
            
            // Si on atteint la fin, on saute au début
            if (currentIndex > totalItems + itemsPerView) {
                setTimeout(() => {
                    currentIndex = itemsPerView;
                    carousel.style.transition = 'none';
                    updateCarousel();
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }, 500);
            }
        }
        
        leftArrow.addEventListener('click', moveLeft);
        rightArrow.addEventListener('click', moveRight);
        
        // Initial setup
        updateCarousel();
        
        // Update arrows visibility
        function updateArrows() {
            leftArrow.style.opacity = '1';
            rightArrow.style.opacity = '1';
        }
        
        updateArrows();
        
        // Update arrows on window resize
        window.addEventListener('resize', () => {
            updateCarousel();
            updateArrows();
        });
    });
});

/* ==========================================================================
   ARTICLE DE PRESSE GALLERY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.article-gallery-item');
    const modal = document.querySelector('.article-modal');
    const closeModal = document.querySelector('.close-modal');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Fermer la modal avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

// Gestion de la galerie d'images
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close-modal');

    // Ouvrir la modal au clic sur une image
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            modalContent.src = imgSrc;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Fermer la modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Fermer la modal en cliquant en dehors de l'image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer la modal avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Gallery Navigation
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery-view');
    if (!gallery) return;

    const images = gallery.querySelectorAll('img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentCounter = document.querySelector('.current');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
        currentCounter.textContent = index + 1;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    // Event listeners for buttons
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch events for swipe
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
});

/* ==========================================================================
   GALLERY MODAL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const rulesItems = document.querySelectorAll('.rules-item');
    const modalGallery = document.querySelector('.modal-gallery');
    const modalImage = modalGallery.querySelector('img');
    const modalCounter = modalGallery.querySelector('.modal-gallery-counter');
    const prevButton = modalGallery.querySelector('.modal-gallery-prev');
    const nextButton = modalGallery.querySelector('.modal-gallery-next');
    const closeButton = modalGallery.querySelector('.modal-gallery-close');
    
    let currentIndex = 0;
    const totalImages = rulesItems.length;

    // Ouvrir la galerie modale
    rulesItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateModalImage();
            modalGallery.classList.add('active');
        });
    });

    // Fermer la galerie modale
    closeButton.addEventListener('click', () => {
        modalGallery.classList.remove('active');
    });

    // Navigation
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateModalImage();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateModalImage();
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!modalGallery.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateModalImage();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalImages;
            updateModalImage();
        } else if (e.key === 'Escape') {
            modalGallery.classList.remove('active');
        }
    });

    // Mettre à jour l'image modale
    function updateModalImage() {
        const currentItem = rulesItems[currentIndex];
        const imgSrc = currentItem.querySelector('img').src;
        const imgAlt = currentItem.querySelector('img').alt;
        
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt;
        modalCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
    }
});

/* ==========================================================================
   PASSION CIRCLES ANIMATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.passions-container');
    if (!container) return;

    const circles = document.querySelectorAll('.passion-circle');
    const circleData = [];

    // Configuration de la physique simplifiée
    const friction = 0.99; // Friction légèrement réduite pour plus de fluidité
    const bounce = 0.6; // Rebond légèrement augmenté
    const idleSpeed = 0.15; // Vitesse de base augmentée

    // Initialiser les cercles avec des positions et vitesses aléatoires
    circles.forEach(circle => {
        const size = parseInt(circle.dataset.size);
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.background = 'white'; // Ajout de la couleur blanche

        circleData.push({
            element: circle,
            size: size,
            x: Math.random() * (container.clientWidth - size),
            y: Math.random() * (container.clientHeight - size),
            vx: (Math.random() - 0.5) * idleSpeed,
            vy: (Math.random() - 0.5) * idleSpeed,
            angle: Math.random() * Math.PI * 2
        });
    });

    function update() {
        circleData.forEach(circle => {
            // Mouvement circulaire lent
            circle.angle += idleSpeed * 0.01;
            circle.vx = Math.cos(circle.angle) * idleSpeed;
            circle.vy = Math.sin(circle.angle) * idleSpeed;

            // Appliquer la friction
            circle.vx *= friction;
            circle.vy *= friction;

            // Mettre à jour la position
            circle.x += circle.vx;
            circle.y += circle.vy;

            // Collision avec les bords
            if (circle.x < 0) {
                circle.x = 0;
                circle.vx *= -bounce;
            } else if (circle.x > container.clientWidth - circle.size) {
                circle.x = container.clientWidth - circle.size;
                circle.vx *= -bounce;
            }

            if (circle.y < 0) {
                circle.y = 0;
                circle.vy *= -bounce;
            } else if (circle.y > container.clientHeight - circle.size) {
                circle.y = container.clientHeight - circle.size;
                circle.vy *= -bounce;
            }

            // Collision entre les cercles
            circleData.forEach(other => {
                if (circle === other) return;

                const dx = (other.x + other.size/2) - (circle.x + circle.size/2);
                const dy = (other.y + other.size/2) - (circle.y + circle.size/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (circle.size + other.size) / 2;

                if (distance < minDistance) {
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;
                    
                    // Déplacer les cercles pour éviter le chevauchement
                    const moveX = Math.cos(angle) * overlap / 2;
                    const moveY = Math.sin(angle) * overlap / 2;
                    
                    circle.x -= moveX;
                    circle.y -= moveY;
                    other.x += moveX;
                    other.y += moveY;

                    // Échanger les vitesses pour un effet de collision doux
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    const p = 2 * (circle.vx * normalX + circle.vy * normalY);
                    
                    circle.vx -= p * normalX;
                    circle.vy -= p * normalY;
                    other.vx += p * normalX;
                    other.vy += p * normalY;
                }
            });

            // Appliquer la transformation
            circle.element.style.transform = `translate3d(${circle.x}px, ${circle.y}px, 0)`;
        });

        requestAnimationFrame(update);
    }

    // Démarrer l'animation
    update();

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        circleData.forEach(circle => {
            circle.x = Math.min(circle.x, container.clientWidth - circle.size);
            circle.y = Math.min(circle.y, container.clientHeight - circle.size);
        });
    });
});

// Animation des bulles MMI LAN avec collisions
// (remplace l'ancienne version sans collisions)
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.mmi-bubbles-container');
    if (!container) return;

    const bubbles = container.querySelectorAll('.mmi-bubble');
    const bubbleData = [];

    const friction = 0.99;
    const bounce = 0.7;
    const idleSpeed = 0.18;

    // Initialisation des bulles
    bubbles.forEach(bubble => {
        const size = parseInt(bubble.style.width);
        bubbleData.push({
            element: bubble,
            size: size,
            x: Math.random() * (container.clientWidth - size),
            y: Math.random() * (container.clientHeight - size),
            vx: (Math.random() - 0.5) * idleSpeed,
            vy: (Math.random() - 0.5) * idleSpeed
        });
    });

    function animate() {
        bubbleData.forEach(bubble => {
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            // Rebond sur les bords
            if (bubble.x < 0) { bubble.x = 0; bubble.vx *= -bounce; }
            if (bubble.x + bubble.size > container.clientWidth) { bubble.x = container.clientWidth - bubble.size; bubble.vx *= -bounce; }
            if (bubble.y < 0) { bubble.y = 0; bubble.vy *= -bounce; }
            if (bubble.y + bubble.size > container.clientHeight) { bubble.y = container.clientHeight - bubble.size; bubble.vy *= -bounce; }

            // Friction
            bubble.vx *= friction;
            bubble.vy *= friction;
        });

        // Gestion des collisions entre bulles
        for (let i = 0; i < bubbleData.length; i++) {
            for (let j = i + 1; j < bubbleData.length; j++) {
                const a = bubbleData[i];
                const b = bubbleData[j];
                const dx = (b.x + b.size/2) - (a.x + a.size/2);
                const dy = (b.y + b.size/2) - (a.y + a.size/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = (a.size + b.size) / 2;

                if (dist < minDist) {
                    // Calcul du chevauchement
                    const overlap = minDist - dist;
                    const angle = Math.atan2(dy, dx);

                    // Repousser les bulles
                    const moveX = Math.cos(angle) * overlap / 2;
                    const moveY = Math.sin(angle) * overlap / 2;

                    a.x -= moveX;
                    a.y -= moveY;
                    b.x += moveX;
                    b.y += moveY;

                    // Échanger les vitesses pour un effet de rebond doux
                    const normalX = dx / dist;
                    const normalY = dy / dist;
                    const p = 2 * (a.vx * normalX + a.vy * normalY);

                    a.vx -= p * normalX;
                    a.vy -= p * normalY;
                    b.vx += p * normalX;
                    b.vy += p * normalY;
                }
            }
        }

        // Appliquer la transformation
        bubbleData.forEach(bubble => {
            bubble.element.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;
        });

        requestAnimationFrame(animate);
    }
    animate();

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        bubbleData.forEach(bubble => {
            bubble.x = Math.min(bubble.x, container.clientWidth - bubble.size);
            bubble.y = Math.min(bubble.y, container.clientHeight - bubble.size);
        });
    });
});
