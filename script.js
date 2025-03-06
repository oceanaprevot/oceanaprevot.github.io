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
setInterval(updateRainbowColors, 30);

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
    });
    
    card.addEventListener('mouseleave', () => {
        clearInterval(hueInterval);
        card.style.borderColor = 'white';
        card.style.borderWidth = '1px';
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
