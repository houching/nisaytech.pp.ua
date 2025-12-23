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
});
