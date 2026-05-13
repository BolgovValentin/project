// ========== ЗАГРУЗКА СЕКЦИЙ ==========
document.addEventListener('DOMContentLoaded', function() {
    const includes = document.querySelectorAll('[data-include]');
    let loadedCount = 0;
    const totalIncludes = includes.length;

    if (totalIncludes === 0) {
        initAll();
        return;
    }

    includes.forEach(element => {
        const file = element.getAttribute('data-include');
        if (file) {
            fetch(file)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    element.removeAttribute('data-include');
                    loadedCount++;
                    if (loadedCount === totalIncludes) {
                        setTimeout(() => {
                            console.log('Все секции загружены, запускаем инициализацию');
                            initAll();
                        }, 50);
                    }
                })
                .catch(error => {
                    console.error('Ошибка загрузки:', file, error);
                    loadedCount++;
                    if (loadedCount === totalIncludes) {
                        setTimeout(() => initAll(), 50);
                    }
                });
        }
    });
});

// ==========================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ==========================================
function initAll() {
    console.log('Инициализация всех эффектов...');

    addGlitchEffect();
    createMatrixRain();
    setupHeroImageTeleport();
    setupSmoothScroll();
    setupMotivationSlang();
    setupSkillsViewToggle();
    setupThemeToggle();
    setupVisualModeToggle();
    setupSmartHeader();
    setupScrollTop();

    // Динамический навбар при скролле
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navBar.style.background = 'rgba(10, 15, 26, 0.95)';
                navBar.style.backdropFilter = 'blur(12px)';
            } else {
                navBar.style.background = 'rgba(10, 15, 26, 0.9)';
                navBar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    console.log('Все эффекты успешно загружены!');
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (СВЕТЛАЯ/ТЁМНАЯ)
// ==========================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Загрузка сохранённой темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '☀️';
        }
    });
}

// ==========================================
// РЕЖИМ ДЛЯ СЛАБОВИДЯЩИХ
// ==========================================
function setupVisualModeToggle() {
    const visualToggle = document.getElementById('visualToggle');
    if (!visualToggle) return;

    // Функция обновления цвета кнопки в зависимости от темы
    function updateButtonColor() {
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        if (document.body.classList.contains('visual-mode-active')) {
            if (isLightTheme) {
                visualToggle.style.background = '#0066cc';
                visualToggle.style.border = '1px solid #0066cc';
                visualToggle.style.color = '#ffffff';
            } else {
                visualToggle.style.background = '#00ff9d';
                visualToggle.style.border = '1px solid #00ff9d';
                visualToggle.style.color = '#0a0f1a';
            }
        } else {
            // Возвращаем стандартный стиль
            if (isLightTheme) {
                visualToggle.style.background = 'rgba(0, 102, 204, 0.15)';
                visualToggle.style.border = '1px solid rgba(0, 102, 204, 0.4)';
                visualToggle.style.color = '#0066cc';
            } else {
                visualToggle.style.background = 'rgba(0, 255, 0, 0.2)';
                visualToggle.style.border = '1px solid rgba(0, 255, 0, 0.3)';
                visualToggle.style.color = '#00ff9d';
            }
        }
    }

    // Загрузка сохранённого режима
    const savedVisual = localStorage.getItem('visualMode');
    if (savedVisual === 'on') {
        document.body.classList.add('visual-mode-active');
    }

    // Обновляем цвет кнопки при загрузке
    updateButtonColor();

    // Слушаем смену темы, чтобы обновить цвет кнопки
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(updateButtonColor, 50);
        });
    }

    visualToggle.addEventListener('click', () => {
        if (document.body.classList.contains('visual-mode-active')) {
            document.body.classList.remove('visual-mode-active');
            localStorage.setItem('visualMode', 'off');
        } else {
            document.body.classList.add('visual-mode-active');
            localStorage.setItem('visualMode', 'on');
        }
        updateButtonColor();
    });
}
// ==========================================
// ЭФФЕКТ ГЛИТЧА ДЛЯ ЗАГОЛОВКА
// ==========================================
function addGlitchEffect() {
    const h1 = document.querySelector('h1');
    if (h1 && !h1.querySelector('.glitch-word')) {
        const html = h1.innerHTML;
        h1.innerHTML = html.replace(
            'Разрабатывай',
            '<span class="glitch-word" data-text="Разрабатывай">Разрабатывай</span>'
        ).replace(
            'зарабатывай',
            '<span class="glitch-word" data-text="зарабатывай">зарабатывай</span>'
        );
    }
}

// =============
// МАТРИЧНЫЙ ФОН
// =============
function createMatrixRain() {
    // Проверяем, не создан ли уже фон
    if (document.querySelector('.matrix-js-bg')) return;

    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-js-bg';
    const columns = 15;

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';

        const left = (i * 6.6) + (Math.random() * 3);
        const delay = Math.random() * 10;
        const duration = 12 + Math.random() * 15;
        const opacity = 0.2 + Math.random() * 0.3;

        column.style.left = left + '%';
        column.style.animationDelay = delay + 's';
        column.style.animationDuration = duration + 's';
        column.style.opacity = opacity;

        let code = '';
        const lines = 15;

        for (let j = 0; j < lines; j++) {
            if (j % 3 === 0) {
                for (let k = 0; k < 8; k++) {
                    code += Math.random() > 0.3 ? '1' : '0';
                }
            } else if (j % 3 === 1) {
                for (let k = 0; k < 8; k++) {
                    code += Math.random() > 0.7 ? '1' : '0';
                }
            } else {
                for (let k = 0; k < 8; k++) {
                    code += (k % 2 === 0) ? '1' : '0';
                }
            }

            if (j % 4 === 0) {
                code = code.replace(/(.{2})/g, '$1 ');
            }

            code += '\n';
        }

        column.textContent = code;
        matrixContainer.appendChild(column);
    }

    document.body.appendChild(matrixContainer);
    console.log('Матричный фон создан');
}

// ==========================================
// ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
// ==========================================
function setupSmoothScroll() {
    const links = document.querySelectorAll('[data-target]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    console.log('Плавный скролл настроен');
}

// ==========================================
// МОТИВИРУЮЩИЕ СЛЕНГИ С ЗВУКОМ
// ==========================================
let soundEnabled = true;
let customAudio = null;

function setupMotivationSlang() {
    const slangs = [
        { text: "🚀 Ты справишься!", side: "left" },
        { text: "💪 У тебя получится!", side: "right" },
        { text: "⭐ Ты сможешь!", side: "left" },
        { text: "🔥 Вперёд к успеху!", side: "right" },
        { text: "🎯 Ты на правильном пути!", side: "left" },
        { text: "✨ Ты станешь профессионалом!", side: "right" },
        { text: "⚡ Не сдавайся!", side: "left" },
        { text: "🏆 Ты лучший!", side: "right" },
        { text: "💡 Пора получать знания!", side: "left" },
        { text: "🌟 Звёздный час близко!", side: "right" }
    ];

    let lastSide = null;
    let audioContext = null;
    let isAudioInitialized = false;

    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
            soundToggle.title = soundEnabled ? 'Выключить звук' : 'Включить звук';
        });
    }

    function initAudio() {
        if (!isAudioInitialized) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                isAudioInitialized = true;
            } catch(e) {
                console.log('Звук не поддерживается браузером');
            }
        }
    }

    function playSound() {
        if (!soundEnabled) return;
        initAudio();

        if (audioContext && isAudioInitialized) {
            try {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 880;
                gainNode.gain.value = 0.1;
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch(e) {
                console.log('Ошибка воспроизведения звука:', e);
            }
        }
    }

    function showSlang() {
        let availableSlangs = slangs;
        if (lastSide) {
            availableSlangs = slangs.filter(s => s.side !== lastSide);
        }

        const slang = availableSlangs[Math.floor(Math.random() * availableSlangs.length)];
        lastSide = slang.side;

        const toast = document.createElement('div');
        toast.className = `motivation-toast ${slang.side}`;
        toast.textContent = slang.text;
        document.body.appendChild(toast);

        if (soundEnabled) {
            playSound();
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    function scheduleNext() {
        const delay = 15000 + Math.random() * 10000;
        setTimeout(() => {
            showSlang();
            scheduleNext();
        }, delay);
    }

    scheduleNext();
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ МЕЖДУ СЕТКОЙ И БЕГУЩЕЙ СТРОКОЙ
// ==========================================
function setupSkillsViewToggle() {
    const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
    const marqueeBtn = document.querySelector('.toggle-btn[data-view="marquee"]');
    const skillsGrid = document.querySelector('.skills-grid');
    const marqueeContainer = document.querySelector('.skills-marquee');
    const marqueeTrack = document.querySelector('.skills-marquee .marquee-track');

    if (!gridBtn || !marqueeBtn || !skillsGrid || !marqueeContainer) {
        console.log('Элементы для переключения не найдены');
        return;
    }

    // Данные для бегущей строки (с иконками)
    const skillsData = [
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor"/>
                  </svg>`,
            title: 'Искусственный интеллект',
            description: 'Нейросети, машинное обучение, компьютерное зрение'
        },
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 16L12 20L18 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 12L12 16L18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 8L12 12L18 8L12 4L6 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`,
            title: 'Облачные технологии',
            description: 'AWS, Yandex Cloud, Docker, Kubernetes'
        },
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L4 7V13C4 17.5 7.5 21 12 22C16.5 21 20 17.5 20 13V7L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="15" r="0.5" fill="currentColor"/>
                  </svg>`,
            title: 'Информационная безопасность',
            description: 'Криптография, защита данных, кибербезопасность'
        },
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M9 5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M12 18C13.1046 18 14 17.1046 14 16C14 14.8954 13.1046 14 12 14C10.8954 14 10 14.8954 10 16C10 17.1046 10.8954 18 12 18Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 18V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>`,
            title: 'Мобильная разработка',
            description: 'iOS, Android, Flutter, Kotlin, Swift'
        },
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 13V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M12 9H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M2 5L6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22 5L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M2 19L6 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22 19L18 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>`,
            title: 'Web-разработка',
            description: 'React, Vue, Node.js, современные веб-приложения'
        },
        {
            icon: `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M8 12H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M16 16H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>`,
            title: 'Корпоративные системы',
            description: 'ERP/CRM, 1С, управление бизнес-процессами'
        }
    ];

    // Заполняем бегущую строку
    if (marqueeTrack && marqueeTrack.children.length === 0) {
        let itemsHTML = '';
        // Дублируем 3 раза для бесконечной прокрутки
        for (let i = 0; i < 3; i++) {
            skillsData.forEach(skill => {
                itemsHTML += `
                    <div class="marquee-item">
                        <div class="skill-icon-wrapper">
                            ${skill.icon}
                        </div>
                        <div class="skill-name">${skill.title}</div>
                        <p>${skill.description}</p>
                    </div>
                `;
            });
        }
        marqueeTrack.innerHTML = itemsHTML;
        console.log('Бегущая строка заполнена');
    }

    let animationId = null;
    let currentPosition = 0;
    let isPaused = false;

    function startMarquee() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        const track = document.querySelector('.skills-marquee.active .marquee-track');
        if (!track) return;

        const totalWidth = track.scrollWidth / 3;
        let lastTime = null;

        function animate(time) {
            if (isPaused) {
                lastTime = null;
                animationId = requestAnimationFrame(animate);
                return;
            }

            if (!lastTime) {
                lastTime = time;
                animationId = requestAnimationFrame(animate);
                return;
            }

            const delta = Math.min(0.05, (time - lastTime) / 1000);
            currentPosition = (currentPosition + 60 * delta) % totalWidth;
            track.style.transform = `translateX(-${currentPosition}px)`;
            lastTime = time;
            animationId = requestAnimationFrame(animate);
        }

        isPaused = false;
        animationId = requestAnimationFrame(animate);
        console.log('Бегущая строка запущена');
    }

    function stopMarquee() {
        isPaused = true;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        console.log('Бегущая строка остановлена');
    }

    function resetMarquee() {
        currentPosition = 0;
        if (marqueeTrack) {
            marqueeTrack.style.transform = 'translateX(0px)';
        }
    }

    // Переключение на сетку
    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        marqueeBtn.classList.remove('active');
        skillsGrid.classList.remove('hidden');
        marqueeContainer.classList.remove('active');
        stopMarquee();
        resetMarquee();
        console.log('Переключено на сетку');
    });

    // Переключение на бегущую строку
    marqueeBtn.addEventListener('click', () => {
        marqueeBtn.classList.add('active');
        gridBtn.classList.remove('active');
        skillsGrid.classList.add('hidden');
        marqueeContainer.classList.add('active');
        resetMarquee();
        startMarquee();
        console.log('Переключено на бегущую строку');
    });

    // Пауза при наведении
    marqueeContainer.addEventListener('mouseenter', () => {
        if (marqueeContainer.classList.contains('active')) {
            isPaused = true;
        }
    });

    marqueeContainer.addEventListener('mouseleave', () => {
        if (marqueeContainer.classList.contains('active')) {
            isPaused = false;
        }
    });

    console.log('Режимы отображения настроены!');
}

// =============================
// ТЕЛЕПОРТАЦИЯ БЛОКА С ЦИТАТОЙ
// =============================
function setupHeroImageTeleport() {
    const heroImage = document.querySelector('.hero .hero-image');
    const heroSection = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');

    if (!heroImage || !heroSection || !heroText) return;

    let isTeleporting = false;
    let originalTransform = '';

    // Сохраняем исходное положение
    function saveOriginalPosition() {
        originalTransform = heroImage.style.transform || '';
    }

    function resetPosition() {
        if (!heroImage.classList.contains('teleport-active')) return;

        heroImage.style.transform = originalTransform;
        heroImage.style.transition = '';
        heroImage.classList.remove('teleport-active');
        heroImage.classList.remove('teleporting');

        void heroImage.offsetHeight;
    }

    function teleportBlock() {
        // Отключаем на мобильных устройствах
        if (window.innerWidth <= 768) return;

        if (isTeleporting) return;
        isTeleporting = true;

        saveOriginalPosition();
        heroImage.classList.add('teleporting');
        heroImage.classList.add('teleport-active');

        // Получаем размеры
        const imageRect = heroImage.getBoundingClientRect();
        const textRect = heroText.getBoundingClientRect();

        // НАСТРОЙКИ СМЕЩЕНИЯ
        const maxOffsetX = 100;    // Максимум ВЛЕВО (отрицательное значение)
        const maxOffsetY = 70;     // Максимум ВВЕРХ и ВНИЗ

        // Выбираем направление:
        // - по X: только ВЛЕВО (от 0 до -maxOffsetX)
        // - по Y: ВВЕРХ или ВНИЗ (случайно)
        const offsetX = -Math.random() * maxOffsetX; // ТОЛЬКО ВЛЕВО!

        // Направление по Y: случайно вверх или вниз
        const directionY = Math.random() > 0.5 ? 1 : -1;
        const offsetY = directionY * Math.random() * maxOffsetY;

        // Проверка: не наезжает ли на текст
        const newLeft = imageRect.left + offsetX;
        const newTop = imageRect.top + offsetY;
        const textCenterX = textRect.left + textRect.width / 2;
        const textCenterY = textRect.top + textRect.height / 2;
        const imageCenterX = newLeft + imageRect.width / 2;
        const imageCenterY = newTop + imageRect.height / 2;
        const distance = Math.hypot(imageCenterX - textCenterX, imageCenterY - textCenterY);

        // Если слишком близко к тексту, корректируем по Y
        let finalOffsetX = offsetX;
        let finalOffsetY = offsetY;

        if (distance < 150) {
            // Отодвигаем в противоположную сторону по Y
            finalOffsetY = offsetY > 0 ? -maxOffsetY / 2 : maxOffsetY / 2;
        }

        // Применяем смещение через transform
        heroImage.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        heroImage.style.transform = `translate(${finalOffsetX}px, ${finalOffsetY}px)`;

        // Эффект "призрака"
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                const ghost = heroImage.cloneNode(true);
                ghost.style.position = 'fixed';
                ghost.style.left = imageRect.left + 'px';
                ghost.style.top = imageRect.top + 'px';
                ghost.style.width = imageRect.width + 'px';
                ghost.style.opacity = '0.25';
                ghost.style.pointerEvents = 'none';
                ghost.style.zIndex = '999';
                ghost.style.transform = `translate(${finalOffsetX + (i === 0 ? -10 : 10)}px, ${finalOffsetY + (i === 0 ? -8 : 8)}px)`;
                ghost.style.filter = `hue-rotate(${i * 180}deg)`;
                document.body.appendChild(ghost);
                setTimeout(() => ghost.remove(), 200);
            }, i * 80);
        }

        setTimeout(() => {
            heroImage.classList.remove('teleporting');
            isTeleporting = false;
        }, 400);
    }

    // Возврат на место при двойном клике
    heroImage.addEventListener('dblclick', () => {
        resetPosition();
    });

    // Телепортация при наведении
    heroImage.addEventListener('mouseenter', teleportBlock);

    // Возврат на место при уходе мыши
    heroImage.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!isTeleporting) {
                resetPosition();
            }
        }, 100);
    });

    // При изменении размера окна сбрасываем позицию
    window.addEventListener('resize', () => {
        resetPosition();
        heroImage.style.transform = '';
        heroImage.style.transition = '';
    });
}

// ==========================================
// УМНАЯ ШАПКА (СКРЫВАЕТСЯ ПРИ СКРОЛЛЕ ВНИЗ)
// ==========================================
function setupSmartHeader() {
    const header = document.querySelector('.nav-bar');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Определяем направление скролла
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Скроллим ВНИЗ — скрываем шапку
            header.classList.add('hidden');
        } else if (currentScrollY < lastScrollY) {
            // Скроллим ВВЕРХ — показываем шапку
            header.classList.remove('hidden');
        }

        // Если мы в самом верху страницы, всегда показываем шапку
        if (currentScrollY <= 10) {
            header.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    // Оптимизация с requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });

    console.log('Умная шапка активирована');
}

// ==========================================
// КНОПКА НАВЕРХ
// ==========================================
function setupScrollTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    // Плавный скролл наверх при клике
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
