// ========== ЭФФЕКТ ГЛИТЧА ==========
function addGlitchEffect() {
    const h1 = document.querySelector('h1');
    if (h1 && !h1.querySelector('.glitch-word')) {
        const html = h1.innerHTML;
        h1.innerHTML = html.replace(
            'кодить',
            '<span class="glitch-word" data-text="кодить">кодить</span>'
        ).replace(
            'зарабатывать',
            '<span class="glitch-word" data-text="зарабатывать">зарабатывать</span>'
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
}



// ========== НАБЛЮДАТЕЛЬ ДЛЯ ПОЯВЛЕНИЯ БЛОКОВ ==========
function setupIntersectionObserver() {
    const elements = document.querySelectorAll(
        '.target-item, .state-card, .skill-item, .career-card, .stage-card, .competency-item, .faq-item, .exam-row'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ========== СЕКЦИЯ "ЧТО ИЗУЧАЕМ" - СЕТКА И БЕГУЩАЯ СТРОКА ==========
function setupSkillsViewToggle() {
    const skillsSection = document.querySelector('.skills-section');
    const skillsGrid = document.querySelector('.skills-grid');

    if (!skillsGrid) return;

    // Данные для бегущей строки (дублируем для бесконечной прокрутки)
    const skillsData = [
        {
            emoji: '🤖',
            title: 'Искусственный интеллект',
            description: 'Нейросети, машинное обучение, компьютерное зрение, обработка естественного языка'
        },
        {
            emoji: '☁️',
            title: 'Облачные технологии',
            description: 'AWS, Yandex Cloud, Docker, Kubernetes, развертывание в облаке'
        },
        {
            emoji: '🔐',
            title: 'Информационная безопасность',
            description: 'Криптография, защита данных, анализ уязвимостей, кибербезопасность'
        },
        {
            emoji: '📱',
            title: 'Мобильная разработка',
            description: 'iOS, Android, Flutter, Kotlin, Swift, кроссплатформенные приложения'
        },
        {
            emoji: '🌐',
            title: 'Web-разработка',
            description: 'React, Vue, Node.js, современные веб-приложения, API'
        },
        {
            emoji: '🏢',
            title: 'Корпоративные системы',
            description: 'ERP/CRM, 1С, управление бизнес-процессами, интеграция систем'
        }
    ];

    // Создаем контейнер для кнопок
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'view-toggle';

    // Создаем кнопку для сетки (активна по умолчанию)
    const gridBtn = document.createElement('div');
    gridBtn.className = 'toggle-btn active';
    gridBtn.innerHTML = '<span class="icon">▦</span> Сетка';
    gridBtn.setAttribute('data-view', 'grid');

    // Создаем кнопку для бегущей строки
    const marqueeBtn = document.createElement('div');
    marqueeBtn.className = 'toggle-btn';
    marqueeBtn.innerHTML = '<span class="icon">◀ ▶</span> Бегущая строка';
    marqueeBtn.setAttribute('data-view', 'marquee');

    toggleContainer.appendChild(gridBtn);
    toggleContainer.appendChild(marqueeBtn);

    // Вставляем кнопки перед skills-grid
    const container = skillsSection.querySelector('.container');
    container.insertBefore(toggleContainer, skillsGrid);

    // Создаем контейнер для бегущей строки
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'skills-marquee';

    // Создаем структуру бегущей строки (дублируем элементы для бесконечности)
    const createMarqueeItems = () => {
        let items = '';
        // Дублируем элементы 3 раза для плавной бесконечной прокрутки
        for (let i = 0; i < 3; i++) {
            skillsData.forEach((skill, index) => {
                items += `
                    <div class="marquee-item" data-skill="${skill.title}">
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
                <input type="range" min="10" max="60" value="30" step="1" class="speed-slider">
                <span class="speed-value">30</span>
            </div>
        </div>
    `;

    container.appendChild(marqueeContainer);

    // Переменные для управления бегущей строкой
    let marqueeTrack = marqueeContainer.querySelector('.marquee-track');
    let isPaused = false;
    let currentSpeed = 30;
    let animation = null;

    // Функция обновления анимации
    function updateMarqueeAnimation() {
        if (marqueeTrack) {
            // Останавливаем текущую анимацию
            marqueeTrack.style.animation = 'none';
            marqueeTrack.offsetHeight; // Принудительный рефлоу

            // Запускаем новую анимацию
            if (!isPaused) {
                marqueeTrack.style.animation = `marqueeScroll ${currentSpeed}s linear infinite`;
            } else {
                marqueeTrack.style.animation = 'none';
            }
        }
    }

    // Обработчик для кнопки паузы
    const pauseBtn = marqueeContainer.querySelector('.pause-btn');
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
            pauseBtn.innerHTML = '▶';
            pauseBtn.title = 'Запустить';
            marqueeTrack.style.animationPlayState = 'paused';
        } else {
            pauseBtn.innerHTML = '⏸';
            pauseBtn.title = 'Пауза';
            marqueeTrack.style.animationPlayState = 'running';
        }
    });

    // Обработчик для регулировки скорости
    const speedSlider = marqueeContainer.querySelector('.speed-slider');
    const speedValue = marqueeContainer.querySelector('.speed-value');

    speedSlider.addEventListener('input', (e) => {
        currentSpeed = e.target.value;
        speedValue.textContent = currentSpeed;
        if (!isPaused) {
            updateMarqueeAnimation();
        }
    });

    // Функция переключения на сетку
    function switchToGrid() {
        skillsGrid.classList.remove('hidden');
        marqueeContainer.classList.remove('active');
        gridBtn.classList.add('active');
        marqueeBtn.classList.remove('active');

        // Добавляем анимацию для карточек
        const items = document.querySelectorAll('.skill-item');
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
        });

        // Сбрасываем анимацию карточек через 0.5 секунды
        setTimeout(() => {
            items.forEach(item => {
                item.style.animation = '';
                item.style.opacity = '';
                item.style.transform = '';
            });
        }, 500);
    }

    // Функция переключения на бегущую строку
    function switchToMarquee() {
        skillsGrid.classList.add('hidden');
        marqueeContainer.classList.add('active');
        gridBtn.classList.remove('active');
        marqueeBtn.classList.add('active');

        // Обновляем анимацию
        setTimeout(() => {
            updateMarqueeAnimation();
        }, 100);
    }

    // Обработчики для кнопок переключения
    gridBtn.addEventListener('click', switchToGrid);
    marqueeBtn.addEventListener('click', switchToMarquee);

    // Добавляем эффект при наведении на карточки в сетке
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // Добавляем эффект при клике на элементы бегущей строки
    marqueeContainer.addEventListener('click', (e) => {
        const marqueeItem = e.target.closest('.marquee-item');
        if (marqueeItem) {
            const title = marqueeItem.querySelector('h3').textContent;
            console.log(`Выбрано направление: ${title}`);
            // Здесь можно добавить дополнительную логику, например, показать модальное окно с подробностями
            marqueeItem.style.transform = 'scale(1.05)';
            setTimeout(() => {
                marqueeItem.style.transform = '';
            }, 300);
        }
    });

    // Инициализация - показываем сетку по умолчанию
    skillsGrid.classList.remove('hidden');
    marqueeContainer.classList.remove('active');

    console.log('Режимы отображения настроены: сетка и бегущая строка!');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...

    // Добавляем переключение режимов для секции "Что изучаем"
    setupSkillsViewToggle();
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function () {
    // CSS‑фон
    const cssBg = document.createElement('div');
    cssBg.className = 'matrix-css-bg';
    document.body.appendChild(cssBg);

    // Запуск эффектов
    createMatrixRain();
    setupHeroImageTeleport();
    addGlitchEffect();
    setupSmoothScroll();
    setupIntersectionObserver();

    // Динамический навбар
    const navBar = document.querySelector('.nav-bar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navBar.style.background = 'rgba(10, 15, 26, 0.95)';
            navBar.style.backdropFilter = 'blur(12px)';
        } else {
            navBar.style.background = 'rgba(10, 15, 26, 0.9)';
            navBar.style.backdropFilter = 'blur(10px)';
        }
    });
});

// ========== ВОЛНООБРАЗНАЯ АНИМАЦИЯ ДЛЯ СЕКЦИИ "ДЛЯ КОГО" ==========
function setupWaveAnimation() {
    const targetItems = document.querySelectorAll('.target-item');
    const targetSection = document.querySelector('.target-section');

    if (!targetItems.length) return;

    // Устанавливаем индивидуальную задержку для каждого элемента
    targetItems.forEach((item, index) => {
        // Задержка для создания эффекта волны
        const delay = index * 0.4;
        item.style.animationDelay = `${delay}s`;

        // Добавляем data-атрибут
        item.setAttribute('data-wave-index', index);

        // Эффект при наведении
        item.addEventListener('mouseenter', () => {
            // Временно ускоряем анимацию
            item.style.animationDuration = '2s';
            item.style.transform = 'scale(1.05)';
            item.style.background = 'rgba(0, 255, 0, 0.2)';
        });

        item.addEventListener('mouseleave', () => {
            // Возвращаем нормальную скорость
            item.style.animationDuration = '';
            item.style.transform = '';
            item.style.background = '';
        });
    });

    // Добавляем эффект параллакса при скролле
    if (targetSection) {
        window.addEventListener('scroll', () => {
            const rect = targetSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = Math.min(1, Math.max(0,
                    (windowHeight - rect.top) / (windowHeight + rect.height)
                ));

                // Слегка смещаем элементы в зависимости от скролла
                targetItems.forEach((item, idx) => {
                    const moveX = (scrollProgress - 0.5) * 20 * (idx + 1);
                    if (item.style.animationPlayState !== 'paused') {
                        item.style.setProperty('--move-x', `${moveX}px`);
                    }
                });
            }
        });
    }

    // Добавляем ripple эффект при клике
    targetItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 157, 0.6), transparent);
                left: ${x - 50}px;
                top: ${y - 50}px;
                pointer-events: none;
                animation: rippleEffect 0.6s ease-out forwards;
                z-index: 10;
            `;

            item.style.position = 'relative';
            item.style.overflow = 'hidden';
            item.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    console.log('Волновая анимация для секции "Для кого" настроена!');
}

// Добавляем стили для ripple эффекта
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 0.8;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...

    // Добавляем волновую анимацию для секции "Для кого"
    setupWaveAnimation();
});