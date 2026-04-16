// ========== ЭФФЕКТ ГЛИТЧА ==========
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

// ========== МАТРИЧНЫЙ ФОН ==========
function createMatrixRain() {
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
                for (let k = 0; k < 8; k++) code += Math.random() > 0.3 ? '1' : '0';
            } else if (j % 3 === 1) {
                for (let k = 0; k < 8; k++) code += Math.random() > 0.7 ? '1' : '0';
            } else {
                for (let k = 0; k < 8; k++) code += (k % 2 === 0) ? '1' : '0';
            }
            if (j % 4 === 0) code = code.replace(/(.{2})/g, '$1 ');
            code += '\n';
        }

        if (i % 3 === 0) {
            code = code.replace(/0/g, '0').replace(/1/g, '1');
        } else if (i % 3 === 1) {
            code = code.replace(/0/g, '0').replace(/1/g, '1');
        } else {
            code = code.replace(/0/g, Math.random() > 0.7 ? 'Ø' : '0')
                .replace(/1/g, Math.random() > 0.7 ? 'ï' : '1');
        }

        column.textContent = code;
        matrixContainer.appendChild(column);
    }
    document.body.appendChild(matrixContainer);
    console.log('Матричный фон создан');
}

// ========== ТЕЛЕПОРТАЦИЯ БЛОКА ==========
function setupHeroImageTeleport() {
    const heroImage = document.querySelector('.hero .hero-image');
    const heroSection = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    if (!heroImage || !heroSection || !heroText) return;

    let isTeleporting = false;

    function getSafePosition(left, top, imageRect, sectionRect) {
        const padding = 20;
        const minLeft = padding;
        const maxLeft = sectionRect.width - imageRect.width - padding;
        const minTop = padding;
        const maxTop = sectionRect.height - imageRect.height - padding;
        if (maxLeft < minLeft || maxTop < minTop) {
            return { left: padding, top: padding, valid: false };
        }
        return {
            left: Math.min(Math.max(left, minLeft), maxLeft),
            top: Math.min(Math.max(top, minTop), maxTop),
            valid: true
        };
    }

    function getRandomPosition() {
        const sectionRect = heroSection.getBoundingClientRect();
        const imageRect = heroImage.getBoundingClientRect();
        const textRect = heroText.getBoundingClientRect();
        const padding = 20;
        const maxLeft = Math.max(padding, sectionRect.width - imageRect.width - padding);
        const maxTop = Math.max(padding, sectionRect.height - imageRect.height - padding);
        if (maxLeft <= padding || maxTop <= padding) {
            return { left: padding, top: padding, valid: true };
        }
        let attempts = 0;
        const maxAttempts = 20;
        while (attempts < maxAttempts) {
            let left = padding + Math.random() * maxLeft;
            let top = padding + Math.random() * maxTop;
            const textCenterX = textRect.left + textRect.width / 2;
            const textCenterY = textRect.top + textRect.height / 2;
            const imageCenterX = left + imageRect.width / 2;
            const imageCenterY = top + imageRect.height / 2;
            const distance = Math.hypot(imageCenterX - textCenterX, imageCenterY - textCenterY);
            if (distance > 250 || attempts > maxAttempts / 2) {
                return { left, top, valid: true };
            }
            attempts++;
        }
        return { left: padding + Math.random() * maxLeft, top: padding + Math.random() * maxTop, valid: true };
    }

    function resetPosition() {
        heroImage.style.position = 'relative';
        heroImage.style.left = 'auto';
        heroImage.style.top = 'auto';
        heroImage.style.right = 'auto';
        heroImage.style.bottom = 'auto';
        heroImage.style.margin = '0';
        heroImage.classList.remove('teleport-active');
        heroImage.classList.remove('teleporting');
    }

    function teleportBlock() {
        if (isTeleporting) return;
        isTeleporting = true;
        heroImage.classList.add('teleporting');
        if (!heroImage.classList.contains('teleport-active')) {
            heroImage.classList.add('teleport-active');
        }

        const sectionRect = heroSection.getBoundingClientRect();
        const imageRect = heroImage.getBoundingClientRect();

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (i === 2) {
                    const newPos = getRandomPosition();
                    const safePos = getSafePosition(newPos.left, newPos.top, imageRect, sectionRect);
                    heroImage.style.position = 'absolute';
                    heroImage.style.left = safePos.left + 'px';
                    heroImage.style.top = safePos.top + 'px';
                    heroImage.style.right = 'auto';
                    heroImage.style.bottom = 'auto';
                    heroImage.style.margin = '0';
                    setTimeout(() => {
                        heroImage.classList.remove('teleporting');
                        isTeleporting = false;
                    }, 600);
                } else {
                    const ghost = heroImage.cloneNode(true);
                    const ghostLeft = heroImage.offsetLeft + (i === 0 ? 20 : -20);
                    const ghostTop = heroImage.offsetTop + (i === 0 ? 10 : -10);
                    const ghostSafe = getSafePosition(ghostLeft, ghostTop, imageRect, sectionRect);
                    ghost.style.position = 'absolute';
                    ghost.style.left = ghostSafe.left + 'px';
                    ghost.style.top = ghostSafe.top + 'px';
                    ghost.style.opacity = '0.3';
                    ghost.style.filter = `hue-rotate(${i * 120}deg)`;
                    ghost.style.pointerEvents = 'none';
                    ghost.style.zIndex = '50';
                    ghost.classList.add('teleport-ghost');
                    heroSection.appendChild(ghost);
                    setTimeout(() => ghost.remove(), 300);
                }
            }, i * 100);
        }
    }

    heroImage.addEventListener('mouseenter', teleportBlock);
    heroImage.addEventListener('dblclick', resetPosition);
    window.addEventListener('resize', () => {
        if (heroImage.classList.contains('teleport-active')) resetPosition();
    });
    window.addEventListener('scroll', () => {
        if (heroImage.classList.contains('teleport-active')) {
            const sectionRect = heroSection.getBoundingClientRect();
            const imageRect = heroImage.getBoundingClientRect();
            if (imageRect.top < sectionRect.top || imageRect.bottom > sectionRect.bottom ||
                imageRect.left < sectionRect.left || imageRect.right > sectionRect.right) {
                resetPosition();
            }
        }
    });
    console.log('Телепортация настроена');
}

// ========== ПЛАВНЫЙ СКРОЛЛ ==========
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

// ========== МОТИВИРУЮЩИЕ СЛЕНГИ С ВОЗМОЖНОСТЬЮ СВОЕГО ЗВУКА ==========
let soundEnabled = true;
let customAudio = null;

// Настройте свой звук здесь - поместите файл в папку sounds и укажите путь
const CUSTOM_SOUND_URL = 'sounds/notification.mp3'; // Замените на путь к вашему звуку
const USE_CUSTOM_SOUND = true; // Установите true, если хотите использовать свой звук

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
        { text: "💡 Гениальная идея!", side: "left" },
        { text: "🌟 Звёздный час близко!", side: "right" }
    ];

    let lastSide = null;
    let audioContext = null;
    let isAudioInitialized = false;

    // Создаём кнопку включения/выключения звука
    const soundToggle = document.createElement('div');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = '🔊';
    soundToggle.title = 'Включить/выключить звук';
    document.body.appendChild(soundToggle);

    // Загружаем пользовательский звук если нужно
    if (USE_CUSTOM_SOUND && CUSTOM_SOUND_URL) {
        customAudio = new Audio(CUSTOM_SOUND_URL);
        customAudio.volume = 0.3;
        console.log('Загружен пользовательский звук');
    }

    function initAudio() {
        if (!isAudioInitialized && !USE_CUSTOM_SOUND) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                isAudioInitialized = true;
                console.log('Аудио контекст инициализирован');
            } catch(e) {
                console.log('Звук не поддерживается браузером');
            }
        }
    }

    function playSound() {
        if (!soundEnabled) return;

        if (USE_CUSTOM_SOUND && customAudio) {
            customAudio.currentTime = 0;
            customAudio.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
        } else if (audioContext && isAudioInitialized) {
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

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.innerHTML = soundEnabled ? '🔊' : '🔇';
        soundToggle.title = soundEnabled ? 'Выключить звук' : 'Включить звук';

        if (!isAudioInitialized && soundEnabled && !USE_CUSTOM_SOUND) {
            initAudio();
        }
    });

    function showSlang() {
        if (!isAudioInitialized && soundEnabled && !USE_CUSTOM_SOUND) {
            initAudio();
        }

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

        console.log('Показан сленг:', slang.text);

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
    console.log('Мотивирующие сленги активированы! Появляются каждые 15-25 секунд');
}

// ========== БЕГУЩАЯ СТРОКА ==========
function setupSkillsViewToggle() {
    const skillsSection = document.querySelector('.skills-section');
    const skillsGrid = document.querySelector('.skills-grid');

    if (!skillsGrid) {
        console.log('skills-grid не найден');
        return;
    }

    // Проверяем, не добавлены ли уже кнопки
    if (document.querySelector('.view-toggle')) {
        console.log('Кнопки уже добавлены');
        return;
    }

    const skillsData = [
        { emoji: '🤖', title: 'Искусственный интеллект', description: 'Нейросети, машинное обучение, компьютерное зрение' },
        { emoji: '☁️', title: 'Облачные технологии', description: 'AWS, Yandex Cloud, Docker, Kubernetes' },
        { emoji: '🔐', title: 'Информационная безопасность', description: 'Криптография, защита данных, кибербезопасность' },
        { emoji: '📱', title: 'Мобильная разработка', description: 'iOS, Android, Flutter, Kotlin, Swift' },
        { emoji: '🌐', title: 'Web-разработка', description: 'React, Vue, Node.js, современные веб-приложения' },
        { emoji: '🏢', title: 'Корпоративные системы', description: 'ERP/CRM, 1С, управление бизнес-процессами' }
    ];

    // Создаём кнопки переключения
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'view-toggle';

    const gridBtn = document.createElement('div');
    gridBtn.className = 'toggle-btn active';
    gridBtn.innerHTML = '<span class="icon">▦</span> Сетка';

    const marqueeBtn = document.createElement('div');
    marqueeBtn.className = 'toggle-btn';
    marqueeBtn.innerHTML = '<span class="icon">◀ ▶</span> Бегущая строка';

    toggleContainer.appendChild(gridBtn);
    toggleContainer.appendChild(marqueeBtn);

    const container = skillsSection.querySelector('.container');
    container.insertBefore(toggleContainer, skillsGrid);

    // Создаём бегущую строку
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'skills-marquee';

    const createMarqueeItems = () => {
        let items = '';
        // Дублируем 3 раза для бесконечной прокрутки
        for (let i = 0; i < 3; i++) {
            skillsData.forEach((skill) => {
                items += `
                    <div class="marquee-item">
                        <div class="emoji">${skill.emoji}</div>
                        <h3>${skill.title}</h3>
                        <p>${skill.description}</p>
                    </div>
                `;
            });
        }
        return items;
    };

    marqueeContainer.innerHTML = `
        <div class="marquee-container">
            <div class="marquee-track">
                ${createMarqueeItems()}
            </div>
        </div>
        <div class="marquee-controls">
            <div class="marquee-btn pause-btn" title="Пауза/Старт">⏸</div>
            <div class="speed-control">
                <label>⚡ Скорость</label>
                <input type="range" min="1" max="100" value="30" step="1" class="speed-slider">
                <span class="speed-value">30</span>
            </div>
            <div class="reset-speed-btn" title="Сбросить скорость">⟳ Сброс</div>
        </div>
    `;

    container.appendChild(marqueeContainer);

    // Управление бегущей строкой
    let marqueeTrack = marqueeContainer.querySelector('.marquee-track');
    let isPaused = false;
    let currentSpeed = 30;
    let animationId = null;
    let currentPosition = 0;
    let lastTimestamp = null;

    function animate(timestamp) {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
            animationId = requestAnimationFrame(animate);
            return;
        }

        const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
        if (delta > 0 && !isPaused) {
            const totalWidth = marqueeTrack.scrollWidth / 3; // Делим на количество дублей
            // Скорость: от 20 до 300 пикселей в секунду
            const speedPxPerSecond = 20 + (currentSpeed / 100) * 280;

            currentPosition = (currentPosition + speedPxPerSecond * delta) % totalWidth;
            marqueeTrack.style.transform = `translateX(-${currentPosition}px)`;
        }

        lastTimestamp = timestamp;
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        isPaused = false;
        if (!animationId) {
            lastTimestamp = null;
            animationId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        isPaused = true;
    }

    // Получаем элементы управления
    const pauseBtn = marqueeContainer.querySelector('.pause-btn');
    const speedSlider = marqueeContainer.querySelector('.speed-slider');
    const speedValue = marqueeContainer.querySelector('.speed-value');
    const resetBtn = marqueeContainer.querySelector('.reset-speed-btn');

    // Обработчик паузы
    pauseBtn.addEventListener('click', () => {
        if (isPaused) {
            startAnimation();
            pauseBtn.innerHTML = '⏸';
            pauseBtn.title = 'Пауза';
        } else {
            stopAnimation();
            pauseBtn.innerHTML = '▶';
            pauseBtn.title = 'Запустить';
        }
    });

    // Обработчик скорости
    speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseInt(e.target.value);
        speedValue.textContent = currentSpeed;
    });

    // Обработчик сброса
    resetBtn.addEventListener('click', () => {
        currentSpeed = 30;
        speedSlider.value = '30';
        speedValue.textContent = '30';
        currentPosition = 0;
        marqueeTrack.style.transform = 'translateX(0px)';
    });

    // Переключение режимов
    function switchToGrid() {
        skillsGrid.classList.remove('hidden');
        marqueeContainer.classList.remove('active');
        gridBtn.classList.add('active');
        marqueeBtn.classList.remove('active');
        stopAnimation();
    }

    function switchToMarquee() {
        skillsGrid.classList.add('hidden');
        marqueeContainer.classList.add('active');
        gridBtn.classList.remove('active');
        marqueeBtn.classList.add('active');
        currentPosition = 0;
        marqueeTrack.style.transform = 'translateX(0px)';
        startAnimation();
    }

    gridBtn.addEventListener('click', switchToGrid);
    marqueeBtn.addEventListener('click', switchToMarquee);

    // Запускаем анимацию (но скрытую, пока не выбран режим)
    startAnimation();

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        if (marqueeContainer.classList.contains('active')) {
            currentPosition = 0;
            marqueeTrack.style.transform = 'translateX(0px)';
        }
    });

    console.log('Режимы отображения настроены! Бегущая строка работает');
}

// ========== ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, запускаем инициализацию...');

    // Создаём CSS фон
    const cssBg = document.createElement('div');
    cssBg.className = 'matrix-css-bg';
    document.body.appendChild(cssBg);

    // Запуск всех эффектов
    createMatrixRain();
    setupHeroImageTeleport();
    addGlitchEffect();
    setupSmoothScroll();
    setupSkillsViewToggle();
    setupMotivationSlang();

    // Динамический навбар
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
});