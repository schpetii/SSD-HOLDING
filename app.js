/**
 * SSD HOLDING - Premium Landing Page
 * File: app.js
 *
 * No external libraries.
 * Works locally (file://) and on any host.
 */

(function() {
    // Tell CSS that JS is enabled (so reveal animations can run)
    document.documentElement.classList.add("js");

    /**
     * setYear()
     * Sets footer year automatically.
     */
    function setYear() {
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }

    /**
     * smoothAnchors()
     * Smooth scroll for internal anchors.
     */
    function smoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                const id = a.getAttribute("href");
                const target = document.querySelector(id);
                if (!target) return;

                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top, behavior: "smooth" });
            });
        });
    }

    /**
     * mobileMenu()
     * Toggles mobile nav links.
     */
    function mobileMenu() {
        const btn = document.querySelector(".nav__menuBtn");
        const mobile = document.querySelector(".nav__mobile");
        if (!btn || !mobile) return;

        function closeMenu() {
            btn.setAttribute("aria-expanded", "false");
            mobile.hidden = true;
        }

        btn.addEventListener("click", () => {
            const open = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!open));
            mobile.hidden = open;
        });

        // Close menu when clicking a link
        mobile.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", closeMenu);
        });

        // Close on escape
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    }

    /**
     * revealOnScroll()
     * IntersectionObserver reveal animation.
     * Safe: if observer not supported, shows everything.
     */
    function revealOnScroll() {
        const items = Array.from(document.querySelectorAll(".reveal"));
        if (!items.length) return;

        // Respect reduced motion
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            items.forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });
            return;
        }

        if (!("IntersectionObserver" in window)) {
            items.forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-in");
                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.15 }
        );

        items.forEach((el) => obs.observe(el));
    }

    /**
     * applyRevealAnimationCSS()
     * Adds CSS for .is-in state (keeps CSS file cleaner).
     */
    function applyRevealAnimationCSS() {
        const style = document.createElement("style");
        style.textContent = `
      html.js .reveal { transition: opacity .6s ease, transform .6s ease; }
      html.js .reveal.is-in { opacity: 1 !important; transform: none !important; }
    `;
        document.head.appendChild(style);
    }

    /**
     * counters()
     * Animates numbers with data-count when visible.
     */
    function counters() {
        const nums = Array.from(document.querySelectorAll("[data-count]"));
        if (!nums.length) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            nums.forEach((el) => (el.textContent = el.getAttribute("data-count")));
            return;
        }

        function animateCount(el, target) {
            const start = 0;
            const duration = 900;
            const t0 = performance.now();

            function tick(t) {
                const p = Math.min(1, (t - t0) / duration);
                const val = Math.round(start + (target - start) * p);
                el.textContent = String(val);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        if (!("IntersectionObserver" in window)) {
            nums.forEach((el) => (el.textContent = el.getAttribute("data-count")));
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = Number(el.getAttribute("data-count") || "0");
                    animateCount(el, target);
                    obs.unobserve(el);
                });
            }, { threshold: 0.6 }
        );

        nums.forEach((el) => obs.observe(el));
    }

    /**
     * testimonialsSlider()
     * Simple 3-slide slider without libraries.
     */
    function testimonialsSlider() {
        const track = document.querySelector(".reviewTrack");
        if (!track) return;

        const dots = Array.from(document.querySelectorAll(".dotBtn"));
        const btnPrev = document.querySelector('[data-slide="prev"]');
        const btnNext = document.querySelector('[data-slide="next"]');

        let index = 0;
        const total = 3;

        function render() {
            track.style.transform = `translateX(-${index * (100 / total)}%)`;
            dots.forEach((d) => d.classList.remove("is-active"));
            if (dots[index]) dots[index].classList.add("is-active");
        }

        function prev() {
            index = (index - 1 + total) % total;
            render();
        }

        function next() {
            index = (index + 1) % total;
            render();
        }

        if (btnPrev) btnPrev.addEventListener("click", prev);
        if (btnNext) btnNext.addEventListener("click", next);

        dots.forEach((d) => {
            d.addEventListener("click", () => {
                index = Number(d.getAttribute("data-dot") || "0");
                render();
            });
        });

        // Auto-rotate
        let timer = setInterval(next, 4500);
        const slider = document.querySelector(".reviewSlider");
        if (slider) {
            slider.addEventListener("mouseenter", () => clearInterval(timer));
            slider.addEventListener("mouseleave", () => (timer = setInterval(next, 4500)));
        }

        render();
    }

    /**
     * formUX()
     * Basic validation + status.
     * If you host with PHP send.php, the form will submit to the server.
     */
    function formUX() {
        const form = document.getElementById("leadForm");
        const status = document.getElementById("formStatus");
        if (!form || !status) return;

        form.addEventListener("submit", (e) => {
            // Client-side checks
            const name = document.getElementById("name") ? .value.trim();
            const email = document.getElementById("email") ? .value.trim();
            const msg = document.getElementById("msg") ? .value.trim();

            if (!name || !email || !msg) {
                e.preventDefault();
                status.textContent = "Please fill in name, email, and message.";
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                e.preventDefault();
                status.textContent = "Please enter a valid email address.";
                return;
            }

            status.textContent = "Sending…";
            // If you don’t have PHP hosting yet and want “no reload”, tell me and I’ll switch to fetch().
        });
    }

    /**
     * init()
     * Boot sequence.
     */
    function init() {
        setYear();
        smoothAnchors();
        mobileMenu();
        applyRevealAnimationCSS();
        revealOnScroll();
        counters();
        testimonialsSlider();
        formUX();
    }

    window.addEventListener("load", init);
})();