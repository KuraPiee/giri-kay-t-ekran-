// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.themes = ['red', 'blue', 'dark', 'light'];
        this.storageKey = 'kuraPiee_theme';
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.storageKey) || 'red';
        this.setTheme(savedTheme);
        this.setupThemeButtons();
    }

    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
            });
        });
    }

    setTheme(theme) {
        if (!this.themes.includes(theme)) return;

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);

        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });

        // Update background
        this.updateBackgroundTheme(theme);
    }

    updateBackgroundTheme(theme) {
        const body = document.body;
        body.style.background = this.getBackgroundGradient(theme);
    }

    getBackgroundGradient(theme) {
        const gradients = {
            red: 'linear-gradient(135deg, #FFFFFF 0%, #FFB3B3 100%)',
            blue: 'linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 100%)',
            dark: 'linear-gradient(135deg, #0F0F0F 0%, #1C1C1C 100%)',
            light: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)'
        };
        return gradients[theme] || gradients.red;
    }
}

// ===== FORM MANAGER =====
class FormManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }

    init() {
        this.setupFormSwitchers();
        this.setupFormValidation();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
        this.setupFormSubmit();
    }

    setupFormSwitchers() {
        const switchLinks = document.querySelectorAll('.switch-form');
        switchLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = link.dataset.form;
                this.switchForm(formType);
            });
        });
    }

    switchForm(formType) {
        // Hide all forms
        document.querySelectorAll('.form').forEach(form => {
            form.classList.remove('active');
        });

        // Show selected form
        if (formType === 'login') {
            this.loginForm.classList.add('active');
        } else if (formType === 'register') {
            this.registerForm.classList.add('active');
        }

        // Hide success message
        this.successMessage.classList.remove('show');
    }

    setupPasswordToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-password');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const inputId = btn.dataset.target;
                const input = document.getElementById(inputId);
                const icon = btn.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('register-password');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthUI(strength);
        });
    }

    calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;

        // Complexity check
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

        return Math.min(strength, 4);
    }

    updatePasswordStrengthUI(strength) {
        const bar = document.querySelector('.strength-bar::after');
        const text = document.querySelector('.strength-text');
        const percentages = ['0%', '25%', '50%', '75%', '100%'];
        const labels = ['Çok Zayıf', 'Zayıf', 'Orta', 'İyi', 'Çok Güçlü'];
        const colors = ['#E74C3C', '#F39C12', '#F39C12', '#27AE60', '#27AE60'];

        // Update strength bar
        const strengthBar = document.querySelector('.strength-bar');
        strengthBar.style.background = colors[strength];
        strengthBar.style.width = percentages[strength];

        // Update text
        text.textContent = `Güç: ${labels[strength]}`;
        text.style.color = colors[strength];
    }

    setupFormValidation() {
        // Real-time validation for all inputs
        const inputs = document.querySelectorAll('.form-group input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const errorElement = field.parentElement.nextElementSibling || field.parentElement.parentElement.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'Bu alanı doldurunuz';
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Geçerli bir e-posta adresi giriniz';
            }
        } else if (field.id === 'register-confirm') {
            const passwordField = document.getElementById('register-password');
            if (field.value !== passwordField.value) {
                isValid = false;
                errorMessage = 'Şifreler eşleşmedi';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            if (errorElement && errorElement.classList.contains('form-error')) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        } else {
            field.classList.remove('error');
            if (errorElement && errorElement.classList.contains('form-error')) {
                errorElement.classList.remove('show');
            }
        }

        return isValid;
    }

    setupFormSubmit() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });

        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit();
        });

        // Social buttons
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(btn);
            });
        });
    }

    handleLoginSubmit() {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        const emailValid = this.validateField(emailInput);
        const passwordValid = this.validateField(passwordInput);

        if (emailValid && passwordValid) {
            this.showSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
            setTimeout(() => {
                console.log('Login Data:', {
                    email: emailInput.value,
                    remember: document.getElementById('remember').checked
                });
                // Simulating API call
            }, 1500);
        }
    }

    handleRegisterSubmit() {
        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm');
        const termsInput = document.getElementById('terms');

        const nameValid = this.validateField(nameInput);
        const emailValid = this.validateField(emailInput);
        const passwordValid = this.validateField(passwordInput);
        const confirmValid = this.validateField(confirmInput);

        if (!termsInput.checked) {
            alert('Lütfen Kullanım Şartlarını kabul ediniz');
            return;
        }

        if (nameValid && emailValid && passwordValid && confirmValid) {
            this.showSuccessMessage('Kayıt başarılı! E-mail adresinize doğrulama bağlantısı gönderildi.');
            setTimeout(() => {
                console.log('Register Data:', {
                    name: nameInput.value,
                    email: emailInput.value
                });
                // Reset form
                this.registerForm.reset();
                this.switchForm('login');
            }, 2000);
        }
    }

    handleSocialLogin(btn) {
        const provider = btn.classList.contains('google') ? 'Google' : 'GitHub';
        this.showSuccessMessage(`${provider} ile giriş yapılıyor...`);
        setTimeout(() => {
            console.log(`Login with ${provider}`);
        }, 1500);
    }

    showSuccessMessage(message) {
        document.getElementById('successText').textContent = message;
        this.successMessage.classList.add('show');

        // Hide forms
        document.querySelectorAll('.form').forEach(form => {
            form.style.display = 'none';
        });

        // Show again after delay
        setTimeout(() => {
            document.querySelectorAll('.form').forEach(form => {
                if (form.classList.contains('active')) {
                    form.style.display = 'block';
                }
            });
            this.successMessage.classList.remove('show');
        }, 3000);
    }
}

// ===== DEVELOPER INFO MANAGER =====
class DevInfoManager {
    constructor() {
        this.init();
    }

    init() {
        const devBtn = document.getElementById('devBtn');
        const devTooltip = document.getElementById('devTooltip');

        devBtn.addEventListener('click', () => {
            devTooltip.classList.toggle('show');
        });

        // Close tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dev-info')) {
                devTooltip.classList.remove('show');
            }
        });
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.info-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }

    setupHoverEffects() {
        const buttons = document.querySelectorAll('.submit-btn, .social-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createRipple(e, btn);
            });
        });
    }

    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// ===== UTILITY FUNCTIONS =====
function setupEventListeners() {
    // Forgot password link
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Şifre sıfırlama e-maili gönderildi!');
        });
    }

    // Terms links
    const termsLinks = document.querySelectorAll('.terms-link');
    termsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Sayfası hazırlanmaktadır...');
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const formManager = new FormManager();
    const devInfoManager = new DevInfoManager();
    const animationManager = new AnimationManager();

    // Setup additional event listeners
    setupEventListeners();

    // Console welcome message
    console.log('%c🎨 KuraPiee - Modern Login & Register', 'font-size: 20px; font-weight: bold; color: #FF6B6B;');
    console.log('%cNickname: KuraPiee\nName: Eren\nAge: 18\n🏢 Company: xren.com.tr', 'font-size: 12px; color: #4A90E2;');
    console.log('%cBuilt with ❤️ using HTML5, CSS3 & Vanilla JavaScript', 'font-size: 12px; color: #06FFA5;');
});

// ===== RIPPLE EFFECT STYLES =====
// Add this to your CSS or create dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Tab to switch between login and register
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const currentForm = document.querySelector('.form.active');
        const targetForm = currentForm.id === 'loginForm' ? 'register' : 'login';
        const formManager = window.formManager;
        if (formManager) formManager.switchForm(targetForm);
    }
});

// ===== OFFLINE DETECTION =====
window.addEventListener('offline', () => {
    console.warn('⚠️ İnternet bağlantısı kesildi!');
});

window.addEventListener('online', () => {
    console.log('✅ İnternet bağlantısı geri geldi!');
});

// ===== FORM MANAGER GLOBAL REFERENCE =====
window.formManager = null;
document.addEventListener('DOMContentLoaded', () => {
    window.formManager = new FormManager();
});
