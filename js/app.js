document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions, .section-title, .section-desc, .card');

    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
        });
    }

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Hero Interactive Effect
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        function updateHeroEffect(clientX, clientY) {
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1

            heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            heroSection.style.setProperty('--mouse-x', `${clientX}px`);
            heroSection.style.setProperty('--mouse-y', `${clientY}px`);
        }

        heroSection.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => updateHeroEffect(e.clientX, e.clientY));
        });

        heroSection.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            window.requestAnimationFrame(() => updateHeroEffect(touch.clientX, touch.clientY));
        });

        const resetEffect = () => {
            heroContent.style.transform = 'translate(0, 0)';
        };

        heroSection.addEventListener('mouseleave', resetEffect);
        heroSection.addEventListener('touchend', resetEffect);
    }

    // Contact Form Handler
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `New Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

            window.location.href = `mailto:hello@nisaytech.pp.ua?subject=${subject}&body=${body}`;
        });
    }

    // Redirect Welcome Message
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const originalUrlParam = params.get('original_url');
    const referrer = document.referrer;

    let source = null;

    if (refParam) {
        source = refParam; // e.g. ?ref=i9t5.com
    } else if (originalUrlParam) {
        // e.g. ?original_url=i9t5.com/foo/bar
        try {
            let urlStr = decodeURIComponent(originalUrlParam);
            if (!/^https?:\/\//i.test(urlStr)) {
                urlStr = 'https://' + urlStr;
            }
            const url = new URL(urlStr);
            source = url.hostname; // Extracts just 'i9t5.com'
        } catch (e) {
            source = originalUrlParam;
        }
    } else if (referrer) {
        // Auto-detect ANY external referrer
        try {
            const refUrl = new URL(referrer);
            if (refUrl.hostname !== window.location.hostname) {
                source = refUrl.hostname;
            }
        } catch (e) {
            console.log('Invalid referrer:', referrer);
        }
    }

    if (source) {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.innerHTML = `
            <span class="toast-icon">👋</span>
            <div class="toast-content">
                <p>Welcome visitor from <strong>${escapeHtml(source)}</strong>!</p>
                <span class="toast-sub">If they don't want you. I'm right here 4U.</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('visible'), 500);

        // Close handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        });

        // Auto dismiss
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 300);
            }
        }, 8000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Dynamic Sponsors
    const sponsorsGrid = document.getElementById('sponsors-grid');
    const showMoreBtn = document.getElementById('show-more-sponsors');

    if (sponsorsGrid && showMoreBtn) {
        const brands = [
            "NebulaSoft", "QuantCore", "PixelForge", "DataDynamo", "CloudScale", "DevSphere",
            "LogicGate", "Synthetix", "Velocify", "CyberNodal", "InfiniTech", "MechMind",
            "AeroSys", "BioLogic", "Cryptex", "DeepMindset", "EchoLabs", "FluxDrive",
            "GeoLink", "HyperGrid", "IonWorks", "JuniperQA", "Kinetix", "LuminaAI",
            "MetaFlow", "NeuroNet", "OptiCode", "PulseWave", "QubitSoft", "RapidScale",
            "Solaris", "TerraByte", "UltraV", "VortexIO", "WarpSpeed", "XenonLab",
            "YottaByte", "ZeroPoint", "AlphaWave", "BetaTest", "GammaRay", "DeltaForce",
            "EpsilonDev", "ZetaCore", "EtaSystems", "ThetaCloud", "IotaLink", "KappaCode",
            "LambdaSoft", "MuNet"
        ];

        let showingAll = false;

        function renderSponsors(limit) {
            sponsorsGrid.innerHTML = '';
            const count = limit === -1 ? brands.length : limit;

            brands.slice(0, count).forEach(brand => {
                const el = document.createElement('div');
                el.className = 'sponsor';
                el.textContent = brand;
                sponsorsGrid.appendChild(el);
            });
        }

        renderSponsors(20);

        showMoreBtn.addEventListener('click', () => {
            if (!showingAll) {
                renderSponsors(-1);
                showMoreBtn.textContent = 'Show Less';
                showingAll = true;
            } else {
                renderSponsors(20);
                showMoreBtn.textContent = 'Show More';
                showingAll = false;
                // Scroll back to sponsors start
                document.getElementById('sponsors').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Dynamic Team
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid) {
        const roles = ["Frontend Dev", "Backend Dev", "Fullstack", "DevOps", "UI/UX Designer", "Product Owner", "QA Engineer", "AI Researcher"];
        const avatars = ["👺", "🤠", "👩‍💻", "👨‍💻", "🤖", "👽", "🦄", "🐉", "🧙‍♂️", "🧛‍♀️", "🧟", "🧞", "🧝", "🧚", "🧜‍♂️"];
        const firstNames = ["Sambath", "Bopha", "Vireak", "Sokha", "Dara", "Chea", "Nary", "Piseth", "Rithy", "Sophal", "Bona", "Chanthou", "Malis", "Vanna", "Srey"];

        // Generate 15 random members
        for (let i = 0; i < 15; i++) {
            const member = {
                name: firstNames[i], // Direct mapping for simplicity, or shuffle
                role: roles[Math.floor(Math.random() * roles.length)],
                avatar: avatars[i % avatars.length]
            };

            const card = document.createElement('div');
            card.className = 'card team-card';
            card.innerHTML = `
                <div class="team-avatar">${member.avatar}</div>
                <h3>${member.name}</h3>
                <p class="role">${member.role}</p>
            `;
            teamGrid.appendChild(card);
        }
    }

    // Cookie Helpers
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Cookie Banner
    if (!localStorage.getItem('cookieConsent') && !getCookie('cookieConsent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience. By using our site, you agree to our <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.</p>
            </div>
            <div class="cookie-actions">
                <button class="btn btn-secondary btn-sm" id="cookie-decline">Decline</button>
                <button class="btn btn-primary btn-sm" id="cookie-accept">Accept</button>
            </div>
        `;
        document.body.appendChild(banner);

        setTimeout(() => banner.classList.add('visible'), 1000);

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            setCookie('cookieConsent', 'accepted', 365); // Save to real cookie for 1 year
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        });

        document.getElementById('cookie-decline').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        });
    }
    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Live Chat Simulation
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatBox) {
        // Prepare bot
        let hasWelcomed = false;

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-msg ${sender}`;
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function toggleChat() {
            chatBox.classList.toggle('open');
            if (chatBox.classList.contains('open') && !hasWelcomed) {
                hasWelcomed = true;
                setTimeout(() => {
                    addMessage("Suasdey! 👋 How can I help you today?", 'bot');
                }, 500);
            }
        }

        chatToggle.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', toggleChat);

        function handleSend() {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            // Simulate typing and reply
            setTimeout(() => {
                let reply = "Thanks for reaching out! Our team will get back to you shortly.";
                if (/price|cost|quote/i.test(text)) {
                    reply = "Our projects start from $500. Would you like to book a call?";
                } else if (/hello|hi|hey/i.test(text)) {
                    reply = "Hello there! ready to build something amazing?";
                }
                addMessage(reply, 'bot');
            }, 1000);
        }

        chatSend.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Booking Modal
    const modal = document.getElementById('booking-modal');
    const startProjectBtns = document.querySelectorAll('a[href="#contact"]'); // Hook into existing buttons
    const closeModal = document.querySelector('.close-modal');
    const timeSlots = document.querySelectorAll('.time-slots button');

    if (modal) {
        startProjectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // If it's the specific "Start Project" button, prevent default and open modal
                // Or we can just make a dedicated button. Let's hijack the hero one specifically if we want.
                // For now, let's just create a new trigger or check class.
                // Assuming user wants "Booking" functionality to be prominent.
                if (btn.classList.contains('btn-lg') || btn.textContent.includes('Contact')) {
                    // Optional: Only hijack specific buttons.
                    // Let's just create a new function called openBooking() and attach it to relevant buttons logic?
                    // Simpler: Just bind to the Hero Primary Button for now.
                }
            });
        });

        // Better approach: Let's assume we WANT to hijack "Start Project"
        const heroBtn = document.querySelector('.hero-actions .btn-primary');
        if (heroBtn) {
            heroBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
            });
        }

        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Loop time slots
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                timeSlots.forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
            });
        });

        // Handle form
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Booking Confirmed! Check your email.');
                modal.classList.remove('show');
            });
        }
    }

    // i18n Support
    const translations = {
        en: {
            "hero.title": "Future-Proof Software.",
            "hero.subtitle": "Feature-rich, AI-native applications built for the Edge.",
            "hero.cta": "Start Project 🚀",
            "hero.explore": "Explore tech",
            "section.sponsors": "Trusted by innovative companies",
            "section.services": "Engineering Excellence",
            "section.works": "Selected Works",
            "section.works.desc": "Delivering impact across industries.",
            "section.team": "Built by Locals",
            "section.team.desc": "Proudly engineered in Cambodia 🇰🇭",
            "contact.title": "Let's Talk",
            "nav.partners": "Partners",
            "nav.work": "Work",
            "nav.tech": "Tech",
            "nav.team": "Team",
            "nav.contact": "Contact Us"
        },
        kh: {
            "hero.title": "កម្មវិធីកុំព្យូទ័រ សម័យថ្មី។",
            "hero.subtitle": "បង្កើតកម្មវិធី AI ដែលមានសមត្ថភាពខ្ពស់ និងល្បឿនលឿន។",
            "hero.cta": "ចាប់ផ្តើមគម្រោង 🚀",
            "hero.explore": "សិក្សាបច្ចេកវិទ្យា",
            "section.sponsors": "ទុកចិត្តដោយក្រុមហ៊ុនច្នៃប្រឌិដ្ឋ",
            "section.services": "ឧត្តមភាពវិស្វកម្ម",
            "section.works": "ស្នាដៃសំខាន់ៗ",
            "section.works.desc": "បង្កើតផលប៉ះពាល់វិជ្ជមានលើគ្រប់វិស័យ",
            "section.team": "បង្កើតដោយស្នាដៃកូនខ្មែរ",
            "section.team.desc": "មោទកភាពវិស្វកម្មក្នុងប្រទេសកម្ពុជា 🇰🇭",
            "contact.title": "ទាក់ទងមកយើង",
            "nav.partners": "ដៃគូ",
            "nav.work": "ស្នាដៃ",
            "nav.tech": "បច្ចេកវិទ្យា",
            "nav.team": "ក្រុមការងារ",
            "nav.contact": "ទាក់ទង"
        }
    };

    const langToggle = document.getElementById('lang-toggle');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    let currentLang = localStorage.getItem('lang') || 'en';

    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        if (langToggle) langToggle.textContent = lang === 'en' ? 'KH' : 'EN';
        if (langToggleMobile) langToggleMobile.textContent = lang === 'en' ? 'KH' : 'EN';

        // Change Font for Khmer
        if (lang === 'kh') {
            document.body.style.fontFamily = "'Kantumruy Pro', sans-serif";
            document.documentElement.lang = 'km';
        } else {
            document.body.style.fontFamily = "'Inter', sans-serif";
            document.documentElement.lang = 'en';
        }

        localStorage.setItem('lang', lang);
    }

    const switchLang = () => {
        currentLang = currentLang === 'en' ? 'kh' : 'en';
        updateLanguage(currentLang);
    };

    if (langToggle) langToggle.addEventListener('click', switchLang);
    if (langToggleMobile) langToggleMobile.addEventListener('click', switchLang);

    // Init
    if (currentLang === 'kh') updateLanguage('kh');

    // Mobile Theme Toggle logic was missing/incomplete previously
    // We need to hook into the existing theme logic or add a new listener
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    if (themeToggleMobile) {
        // Sync initial state
        const savedTheme = localStorage.getItem('theme') || 'dark';
        themeToggleMobile.textContent = savedTheme === 'light' ? '☀️' : '🌙';

        themeToggleMobile.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update BOTH buttons
            if (themeToggle) themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
            themeToggleMobile.textContent = newTheme === 'light' ? '☀️' : '🌙';
        });
    }
});
