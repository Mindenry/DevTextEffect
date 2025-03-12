// DOM Elements
const textEffect = document.getElementById('text-effect');
const customText = document.getElementById('custom-text');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const delaySlider = document.getElementById('delay-slider');
const delayValue = document.getElementById('delay-value');
const intensitySlider = document.getElementById('intensity-slider');
const intensityValue = document.getElementById('intensity-value');
const textColor = document.getElementById('text-color');
const cursorColor = document.getElementById('cursor-color');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');
const themeToggle = document.getElementById('theme-toggle');
const statusIndicator = document.getElementById('status-indicator');
const currentEffect = document.getElementById('current-effect');
const effectList = document.getElementById('effect-list');
const developerPreset = document.getElementById('developer-preset');
const creativePreset = document.getElementById('creative-preset');
const minimalPreset = document.getElementById('minimal-preset');
const cursor = document.querySelector('.cursor');
const animationContainer = document.getElementById('animation-container');
const particlesContainer = document.getElementById('particles');

// Global variables
let interval;
let isRunning = true;
let currentText = customText.value;
let currentSpeed = parseInt(speedSlider.value);
let currentDelay = parseInt(delaySlider.value);
let currentIntensity = parseInt(intensitySlider.value);
let activeEffect = 'typewriter';

// Text effects library
const textEffects = {
    typewriter: (text, element, speed, intensity) => {
        let i = 0;
        element.textContent = '';
        element.style.opacity = 1;
        
        return setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed);
    },
    
    fade: (text, element, speed, intensity) => {
        element.textContent = text;
        element.style.opacity = 0;
        let opacity = 0;
        const step = 0.02 * (intensity / 5);
        
        return setInterval(() => {
            if (opacity < 1) {
                opacity += step;
                element.style.opacity = opacity;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed);
    },
    
    scramble: (text, element, speed, intensity) => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let iteration = 0;
        let finalText = text;
        const randomPercent = intensity * 10;
        
        element.style.opacity = 1;
        
        return setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return finalText[index];
                    }
                    
                    if (letter === ' ') {
                        return ' ';
                    }
                    
                    const random = Math.floor(Math.random() * chars.length);
                    return chars[random];
                })
                .join('');
            
            if (iteration >= finalText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
            
            iteration += 1 / (10 - Math.min(intensity, 9));
        }, speed / 3);
    },
    
    slide: (text, element, speed, intensity) => {
        element.textContent = text;
        element.style.opacity = 1;
        element.style.transform = `translateX(${-100 * intensity}px)`;
        let position = -100 * intensity;
        const step = intensity;
        
        return setInterval(() => {
            if (position < 0) {
                position += step;
                element.style.transform = `translateX(${position}px)`;
            } else {
                element.style.transform = 'translateX(0)';
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed / 10);
    },
    
    glitch: (text, element, speed, intensity) => {
        element.textContent = text;
        element.style.opacity = 1;
        let count = 0;
        const maxCount = 10 * intensity;
        
        return setInterval(() => {
            if (count < maxCount) {
                if (count % 2 === 0) {
                    element.style.transform = `translate(${Math.random() * intensity - intensity/2}px, ${Math.random() * intensity - intensity/2}px)`;
                    element.style.textShadow = `${Math.random() * intensity - intensity/2}px ${Math.random() * intensity - intensity/2}px ${intensity}px rgba(0, 217, 255, 0.8), 
                                              ${Math.random() * intensity - intensity/2}px ${Math.random() * intensity - intensity/2}px ${intensity}px rgba(255, 41, 112, 0.8)`;
                } else {
                    element.style.transform = 'translate(0, 0)';
                    element.style.textShadow = 'none';
                }
                count++;
            } else {
                element.style.transform = 'translate(0, 0)';
                element.style.textShadow = `0 0 ${intensity}px var(--primary)`;
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed);
    },
    
    wave: (text, element, speed, intensity) => {
        element.innerHTML = '';
        element.style.opacity = 1;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.transform = 'translateY(100%)';
            span.style.opacity = '0';
            element.appendChild(span);
        }
        
        const letters = element.querySelectorAll('span');
        let count = 0;
        
        return setInterval(() => {
            if (count < letters.length) {
                letters[count].style.transition = `transform ${speed * 2}ms ease, opacity ${speed}ms ease`;
                letters[count].style.transform = 'translateY(0)';
                letters[count].style.opacity = '1';
                count++;
            } else if (count >= letters.length && count < letters.length * 2) {
                const idx = count - letters.length;
                letters[idx].style.transform = 'translateY(-20px)';
                letters[idx].style.opacity = '0';
                count++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed / 2);
    },
    
    // New advanced effects
    matrix: (text, element, speed, intensity) => {
        const matrixChars = '01'.split('');
        element.textContent = '';
        element.style.opacity = 1;
        
        const columns = text.length;
        const rows = intensity;
        const finalResult = Array(columns).fill('');
        
        // Create matrix elements
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const span = document.createElement('span');
                span.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                span.style.color = 'var(--primary)';
                span.style.opacity = '0.5';
                span.dataset.row = i;
                span.dataset.col = j;
                element.appendChild(span);
            }
            const br = document.createElement('br');
            element.appendChild(br);
        }
        
        let currentRow = 0;
        
        return setInterval(() => {
            if (currentRow < rows) {
                const rowElements = Array.from(element.querySelectorAll(`span[data-row="${currentRow}"]`));
                
                rowElements.forEach((span, colIndex) => {
                    if (colIndex < text.length) {
                        setTimeout(() => {
                            span.textContent = text[colIndex];
                            span.style.color = 'var(--secondary)';
                            span.style.opacity = '1';
                            span.style.fontWeight = 'bold';
                            
                            // Update final result
                            finalResult[colIndex] = text[colIndex];
                        }, colIndex * (speed / 5));
                    }
                });
                
                currentRow++;
            } else {
                // Final reveal
                element.innerHTML = finalResult.join('');
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed * 2);
    },
    
    code: (text, element, speed, intensity) => {
        // Simulate code typing with syntax highlighting
        element.innerHTML = '';
        element.style.opacity = 1;
        
        // Basic syntax highlighting
        const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'import', 'export', 'class', 'new'];
        const methods = ['log', 'error', 'warn', 'info', 'debug', 'table', 'time', 'timeEnd', 'map', 'filter', 'reduce', 'forEach', 'find'];
        const specialChars = ['{', '}', '(', ')', '[', ']', ';', ':', '.', ',', '=', '+', '-', '*', '/', '!', '?', '&', '|', '<', '>', '`'];
        
        let i = 0;
        let buffer = '';
        let inString = false;
        let stringChar = '';
        
        return setInterval(() => {
            if (i < text.length) {
                const char = text[i];
                
                // Check for strings
                if ((char === '"' || char === "'" || char === '`') && (i === 0 || text[i-1] !== '\\')) {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                        buffer += char;
                    } else if (char === stringChar) {
                        inString = false;
                        buffer += char;
                    } else {
                        buffer += char;
                    }
                } else {
                    buffer += char;
                }
                
                // Render with syntax highlighting
                let html = '';
                let tempBuffer = buffer;
                
                // Replace strings
                tempBuffer = tempBuffer.replace(/(['"`])(?:\\.|[^\\])*?\1/g, match => {
                    return `<span style="color: var(--success);">${match}</span>`;
                });
                
                // Replace keywords
                keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                    tempBuffer = tempBuffer.replace(regex, match => {
                        return `<span style="color: var(--secondary); font-weight: bold;">${match}</span>`;
                    });
                });
                
                // Replace methods
                methods.forEach(method => {
                    const regex = new RegExp(`\\.${method}\\b`, 'g');
                    tempBuffer = tempBuffer.replace(regex, match => {
                        return `<span style="color: var(--warning);">${match}</span>`;
                    });
                });
                
                // Replace console
                tempBuffer = tempBuffer.replace(/\bconsole\b/g, match => {
                    return `<span style="color: var(--primary);">${match}</span>`;
                });
                
                // Replace numbers
                tempBuffer = tempBuffer.replace(/\b\d+\b/g, match => {
                    return `<span style="color: #a077ff;">${match}</span>`;
                });
                
                // Replace comments
                tempBuffer = tempBuffer.replace(/\/\/.*/g, match => {
                    return `<span style="color: #6c7a89; font-style: italic;">${match}</span>`;
                });
                
                element.innerHTML = tempBuffer + `<span class="cursor" style="background-color:${cursorColor.value};"></span>`;
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed);
    },
    
    terminal: (text, element, speed, intensity) => {
        element.innerHTML = '';
        element.style.opacity = 1;
        
        const prompt = '<span style="color: var(--success);">$ </span>';
        element.innerHTML = prompt;
        
        let i = 0;
        
        return setInterval(() => {
            if (i < text.length) {
                if (i === 0) {
                    element.innerHTML = prompt;
                }
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                // Show 'command executed' effect
                setTimeout(() => {
                    const output = document.createElement('div');
                    output.style.color = 'var(--light)';
                    output.style.fontSize = '0.9em';
                    output.style.marginTop = '5px';
                    
                    // Simulate terminal output
                    if (text.includes('npm') || text.includes('yarn')) {
                        output.innerHTML = `<span style="color: var(--success);">✓</span> Packages installed successfully!<br>
                                           <span style="color: var(--light); opacity: 0.7;">Added 1342 packages in 12.5s</span>`;
                    } else if (text.includes('git')) {
                        output.innerHTML = `<span style="color: var(--success);">✓</span> Changes committed to repository<br>
                                           <span style="color: var(--primary);">[main 3e7c2a1]</span> Initial commit`;
                    } else if (text.includes('docker')) {
                        output.innerHTML = `<span style="color: var(--success);">✓</span> Container started<br>
                                           <span style="color: var(--light); opacity: 0.7;">Container ID: 8a7bc93e1d32</span>`;
                    } else {
                        output.innerHTML = `<span style="color: var(--success);">Command executed successfully</span>`;
                    }
                    
                    element.appendChild(output);
                    
                    setTimeout(() => {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (isRunning) resetEffect();
                        }, currentDelay);
                    }, 1500);
                }, speed * 3);
            }
        }, speed);
    },
    
    // Inspirational AI-focused effect
    ai: (text, element, speed, intensity) => {
        element.innerHTML = '';
        element.style.opacity = 1;
        
        // Create tokens from text
        const tokens = text.split(/(\s+)/).filter(Boolean);
        const maxTokens = tokens.length;
        let currentToken = 0;
        
        // Create AI thinking visualization
        const thinkingEl = document.createElement('div');
        thinkingEl.style.color = 'var(--primary)';
        thinkingEl.style.fontSize = '0.8em';
        thinkingEl.style.marginBottom = '10px';
        thinkingEl.style.fontFamily = 'monospace';
        thinkingEl.textContent = 'AI thinking...';
        element.appendChild(thinkingEl);
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.height = '4px';
        progressContainer.style.background = 'rgba(255, 255, 255, 0.1)';
        progressContainer.style.borderRadius = '2px';
        progressContainer.style.marginBottom = '15px';
        
        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.background = 'var(--primary)';
        progressBar.style.borderRadius = '2px';
        progressBar.style.transition = 'width 0.3s ease';
        
        progressContainer.appendChild(progressBar);
        element.appendChild(progressContainer);
        
        // Create output container
        const outputEl = document.createElement('div');
        outputEl.style.color = 'var(--light)';
        element.appendChild(outputEl);
        
        return setInterval(() => {
            if (currentToken < maxTokens) {
                // Update thinking visualization
                const progress = (currentToken / maxTokens) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Generate some random "AI thinking" text
                const randomChars = Array.from({length: intensity * 3}, () => 
                    Math.random().toString(36).charAt(2)).join('');
                thinkingEl.textContent = `AI thinking: ${randomChars}`;
                
                // Add token to output
                const token = tokens[currentToken];
                const span = document.createElement('span');
                span.textContent = token;
                span.style.opacity = '0';
                span.style.transition = 'opacity 0.3s ease';
                outputEl.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                }, 50);
                
                currentToken++;
            } else {
                // Completion animation
                progressBar.style.width = '100%';
                progressBar.style.background = 'var(--success)';
                thinkingEl.textContent = 'AI processing complete';
                thinkingEl.style.color = 'var(--success)';
                
                clearInterval(interval);
                setTimeout(() => {
                    if (isRunning) resetEffect();
                }, currentDelay);
            }
        }, speed * 2);
    }
};

// Add the new effects to the UI
const newEffects = ['matrix', 'code', 'terminal', 'ai'];
newEffects.forEach(effect => {
    const effectItem = document.createElement('div');
    effectItem.classList.add('effect-item');
    effectItem.setAttribute('data-effect', effect);
    effectItem.textContent = effect.charAt(0).toUpperCase() + effect.slice(1);
    effectList.appendChild(effectItem);
});

// Initialize background particles
function createParticles() {
    particlesContainer.innerHTML = '';
    const nParticles = 30;
    
    for (let i = 0; i < nParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        const animDuration = Math.random() * 20 + 10;
        const animDelay = Math.random() * 10;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${animDuration}s`;
        particle.style.animationDelay = `${animDelay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize code animation background
function createCodeAnimation() {
    animationContainer.innerHTML = '';
    const codeLines = [
        'function init() { return true; }',
        'const data = fetchAPI("/endpoint");',
        'if (loading) return <Spinner />;',
        'export default DevTextEffect;',
        '* { margin: 0; padding: 0; }',
        '@import url("fonts.css");',
        'npm install --save-dev',
        'git commit -m "feat: add effects"',
        'docker-compose up -d',
        'const [state, setState] = useState();'
    ];
    
    for (let i = 0; i < 15; i++) {
        const codeLine = document.createElement('div');
        codeLine.classList.add('code-line');
        
        // Random properties
        const text = codeLines[Math.floor(Math.random() * codeLines.length)];
        const posX = Math.random() * 100;
        const speed = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        const size = Math.random() * 0.4 + 0.6;
        
        // Apply styles
        codeLine.textContent = text;
        codeLine.style.left = `${posX}%`;
        codeLine.style.animationDuration = `${speed}s`;
        codeLine.style.animationDelay = `${delay}s`;
        codeLine.style.transform = `scale(${size})`;
        
        animationContainer.appendChild(codeLine);
    }
}

// Function to reset and restart the effect
function resetEffect() {
    clearInterval(interval);
    
    // Apply text color
    textEffect.style.color = textColor.value;
    cursor.style.backgroundColor = cursorColor.value;
    
    // Set current values
    currentText = customText.value || 'console.log("Hello, Developer!");';
    currentSpeed = parseInt(speedSlider.value);
    currentDelay = parseInt(delaySlider.value);
    currentIntensity = parseInt(intensitySlider.value);
    
    // Update current effect label
    currentEffect.textContent = `${activeEffect}.js`;
    
    // Start the effect
    interval = textEffects[activeEffect](
        currentText,
        textEffect,
        currentSpeed,
        currentIntensity
    );
}

// Event listeners
customText.addEventListener('change', () => {
    resetEffect();
});

speedSlider.addEventListener('input', () => {
    currentSpeed = parseInt(speedSlider.value);
    speedValue.textContent = `${currentSpeed}ms`;
});

delaySlider.addEventListener('input', () => {
    currentDelay = parseInt(delaySlider.value);
    delayValue.textContent = `${currentDelay}ms`;
});

intensitySlider.addEventListener('input', () => {
    currentIntensity = parseInt(intensitySlider.value);
    intensityValue.textContent = currentIntensity;
});

textColor.addEventListener('input', () => {
    textEffect.style.color = textColor.value;
    document.documentElement.style.setProperty('--primary', textColor.value);
});

cursorColor.addEventListener('input', () => {
    console.log('Cursor color changed to:', cursorColor.value); // ตรวจสอบค่า
    cursor.style.backgroundColor = cursorColor.value;
});

pauseBtn.addEventListener('click', () => {
    isRunning = false;
    clearInterval(interval);
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    statusIndicator.textContent = 'Paused';
    statusIndicator.classList.remove('running');
    statusIndicator.classList.add('paused');
});

resumeBtn.addEventListener('click', () => {
    isRunning = true;
    resetEffect();
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    statusIndicator.textContent = 'Running...';
    statusIndicator.classList.remove('paused');
    statusIndicator.classList.add('running');
});

resetBtn.addEventListener('click', () => {
    resetEffect();
});

saveBtn.addEventListener('click', () => {
    // Save settings to localStorage
    const settings = {
        text: customText.value,
        speed: speedSlider.value,
        delay: delaySlider.value,
        intensity: intensitySlider.value,
        textColor: textColor.value,
        cursorColor: cursorColor.value,
        effect: activeEffect
    };
    
    localStorage.setItem('devTextEffectSettings', JSON.stringify(settings));
    
    // Notify user
    const notification = document.createElement('div');
    notification.style.position = 'absolute';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'var(--success)';
    notification.style.color = 'var(--dark)';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '1000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.fontWeight = 'bold';
    notification.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 8px;"></i> Settings saved successfully!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

effectList.addEventListener('click', (e) => {
    if (e.target.classList.contains('effect-item')) {
        // Update UI
        const effectItems = document.querySelectorAll('.effect-item');
        effectItems.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        
        // Set new effect
        activeEffect = e.target.getAttribute('data-effect');
        resetEffect();
    }
});

// Preset buttons
developerPreset.addEventListener('click', () => {
    textColor.value = '#00d9ff';
    cursorColor.value = '#00d9ff';
    customText.value = 'console.log("Hello, Developer!");';
    speedSlider.value = '70';
    speedValue.textContent = '70ms';
    delaySlider.value = '1500';
    delayValue.textContent = '1500ms';
    intensitySlider.value = '5';
    intensityValue.textContent = '5';
    
    document.documentElement.style.setProperty('--primary', '#00d9ff');
    
    // Set effect
    activeEffect = 'code';
    const effectItems = document.querySelectorAll('.effect-item');
    effectItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-effect') === 'code') {
            item.classList.add('active');
        }
    });
    
    resetEffect();
});

creativePreset.addEventListener('click', () => {
    textColor.value = '#ff2970';
    cursorColor.value = '#ff2970';
    customText.value = 'Creating something amazing...';
    speedSlider.value = '100';
    speedValue.textContent = '100ms';
    delaySlider.value = '2000';
    delayValue.textContent = '2000ms';
    intensitySlider.value = '8';
    intensityValue.textContent = '8';
    
    document.documentElement.style.setProperty('--primary', '#ff2970');
    
    // Set effect
    activeEffect = 'glitch';
    const effectItems = document.querySelectorAll('.effect-item');
    effectItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-effect') === 'glitch') {
            item.classList.add('active');
        }
    });
    
    resetEffect();
});

minimalPreset.addEventListener('click', () => {
    textColor.value = '#36e278';
    cursorColor.value = '#36e278';
    customText.value = 'Less is more.';
    speedSlider.value = '150';
    speedValue.textContent = '150ms';
    delaySlider.value = '3000';
    delayValue.textContent = '3000ms';
    intensitySlider.value = '3';
    intensityValue.textContent = '3';
    
    document.documentElement.style.setProperty('--primary', '#36e278');
    
    // Set effect
    activeEffect = 'typewriter';
    const effectItems = document.querySelectorAll('.effect-item');
    effectItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-effect') === 'typewriter') {
        item.classList.add('active');
        }
        });

        resetEffect();
    });
    
    // Load saved settings
    function loadSettings() {
        const savedSettings = localStorage.getItem('devTextEffectSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            customText.value = settings.text;
            speedSlider.value = settings.speed;
            speedValue.textContent = `${settings.speed}ms`;
            delaySlider.value = settings.delay;
            delayValue.textContent = `${settings.delay}ms`;
            intensitySlider.value = settings.intensity;
            intensityValue.textContent = settings.intensity;
            textColor.value = settings.textColor;
            cursorColor.value = settings.cursorColor;
            activeEffect = settings.effect;
            
            // Update UI for active effect
            const effectItems = document.querySelectorAll('.effect-item');
            effectItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-effect') === activeEffect) {
                    item.classList.add('active');
                }
            });
            
            // Apply colors
            textEffect.style.color = settings.textColor;
            cursor.style.backgroundColor = settings.cursorColor;
            document.documentElement.style.setProperty('--primary', settings.textColor);
            
            resetEffect();
        }
    }
    
    // Initialize
    function init() {
        createParticles();
        createCodeAnimation();
        loadSettings();
        resetEffect();
    }
    
    // Start everything
    init();