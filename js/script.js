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
                        // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: ждём, пока DOM обновится
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
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-js-bg';
    const columns = 15;

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';

        // Случайное позиционирование
        const left = (i * 6.6) + (Math.random() * 3);
        const delay = Math.random() * 10;
        const duration = 12 + Math.random() * 15;
        const opacity = 0.2 + Math.random() * 0.3;

        column.style.left = left + '%';
        column.style.animationDelay = delay + 's';
        column.style.animationDuration = duration + 's';
        column.style.opacity = opacity;

        // Генерируем более разнообразный и красивый код
        let code = '';
        const lines = 15;

        for (let j = 0; j < lines; j++) {
            // Разные комбинации для разных строк
            if (j % 3 === 0) {
                // Строка с преобладанием 1
                for (let k = 0; k < 8; k++) {
                    code += Math.random() > 0.3 ? '1' : '0';
                }
            } else if (j % 3 === 1) {
                // Строка с преобладанием 0
                for (let k = 0; k < 8; k++) {
                    code += Math.random() > 0.7 ? '1' : '0';
                }
            } else {
                // Строка с чередованием
                for (let k = 0; k < 8; k++) {
                    code += (k % 2 === 0) ? '1' : '0';
                }
            }

            // Добавляем пробелы для разнообразия
            if (j % 4 === 0) {
                code = code.replace(/(.{2})/g, '$1 ');
            }

            code += '\n';
        }

        // Добавляем специальные символы в некоторые колонки для эффекта "матрицы"
        if (i % 3 === 0) {
            code = code.replace(/0/g, '0').replace(/1/g, '1');
        } else if (i % 3 === 1) {
            code = code.replace(/0/g, '0').replace(/1/g, '1');
        } else {
            // В некоторых колонках добавляем символы из матрицы
            code = code.replace(/0/g, Math.random() > 0.7 ? 'Ø' : '0')
                .replace(/1/g, Math.random() > 0.7 ? 'ï' : '1');
        }

        column.textContent = code;
        matrixContainer.appendChild(column);
    }

    document.body.appendChild(matrixContainer);
    console.log('Матричный фон создан');
}

// ==========================================
// ТЕЛЕПОРТАЦИЯ БЛОКА С ЦИТАТОЙ
// ==========================================
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

// Настройка звука (поместите файл в папку sounds)
const USE_CUSTOM_SOUND = true;  // true - использовать свой звук, false - синтезированный
const CUSTOM_SOUND_URL = 'sounds/notification.mp3';

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

    const skillsData = [
        { emoji: '🤖', title: 'Искусственный интеллект', description: 'Нейросети, машинное обучение, компьютерное зрение' },
        { emoji: '☁️', title: 'Облачные технологии', description: 'AWS, Yandex Cloud, Docker, Kubernetes' },
        { emoji: '🔐', title: 'Информационная безопасность', description: 'Криптография, защита данных, кибербезопасность' },
        { emoji: '📱', title: 'Мобильная разработка', description: 'iOS, Android, Flutter, Kotlin, Swift' },
        { emoji: '🌐', title: 'Web-разработка', description: 'React, Vue, Node.js, современные веб-приложения' },
        { emoji: '🏢', title: 'Корпоративные системы', description: 'ERP/CRM, 1С, управление бизнес-процессами' }
    ];

    // Заполняем бегущую строку, если она пустая
    if (marqueeTrack && marqueeTrack.children.length === 0) {
        let itemsHTML = '';
        // Дублируем 3 раза для бесконечной прокрутки
        for (let i = 0; i < 3; i++) {
            skillsData.forEach(skill => {
                itemsHTML += `
                    <div class="marquee-item">
                        <div class="emoji">${skill.emoji}</div>
                        <h3>${skill.title}</h3>
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

    // Пауза при наведении на контейнер
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
