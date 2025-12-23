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

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

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
