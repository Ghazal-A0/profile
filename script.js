/* ============================================================
   سایت شخصی — اسکریپت اصلی
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initPortfolioFilter();
  initContactForm();
  initActiveNavLink();
  initYear();
});

/* ------------------------------------------------------------
   ۱. تم روشن / تیره
   ------------------------------------------------------------ */
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  // خواندن تم ذخیره‌شده یا ترجیح سیستم
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ------------------------------------------------------------
   ۲. نوار ناوبری چسبان (سایه هنگام اسکرول)
   ------------------------------------------------------------ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------
   ۳. منوی موبایل
   ------------------------------------------------------------ */
function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    links.classList.toggle("open");
  });

  // بستن منو با کلیک روی لینک
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("open");
      links.classList.remove("open");
    });
  });
}

/* ------------------------------------------------------------
   ۴. انیمیشن ظاهر شدن هنگام اسکرول (Reveal)
   ------------------------------------------------------------ */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   ۵. پر شدن نوار مهارت‌ها
   ------------------------------------------------------------ */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");
  if (!bars.length) return;

  const animate = (el) => {
    const width = el.dataset.width || "0";
    el.style.width = width + "%";
  };

  if (!("IntersectionObserver" in window)) {
    bars.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ------------------------------------------------------------
   ۶. فیلتر نمونه‌کارها
   ------------------------------------------------------------ */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");
  if (!buttons.length || !projects.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projects.forEach((project) => {
        const match =
          filter === "all" || project.dataset.category === filter;
        project.classList.toggle("hidden", !match);

        // انیمیشن ظاهر شدن مجدد
        if (match) {
          project.classList.remove("visible");
          void project.offsetWidth; // reflow
          project.classList.add("visible");
        }
      });
    });
  });
}

/* ------------------------------------------------------------
   ۷. فرم تماس (اعتبارسنجی ساده + پیام موفقیت)
   ------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // اعتبارسنجی
    if (!name || !email || !message) {
      msg.textContent = "لطفاً همه فیلدها را پر کنید.";
      msg.style.color = "#ef4444";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.textContent = "ایمیل معتبر نیست.";
      msg.style.color = "#ef4444";
      return;
    }

    // شبیه‌سازی ارسال موفق
    msg.textContent = "✅ پیام شما با موفقیت ارسال شد. به‌زودی پاسخ می‌دهم.";
    msg.style.color = "#10b981";
    form.reset();

    // در عمل: اینجا می‌توانی به سرویس‌هایی مثل Formspree یا EmailJS وصل شوی
  });
}

/* ------------------------------------------------------------
   ۸. هایلایت لینک فعال در ناوبری
   ------------------------------------------------------------ */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ------------------------------------------------------------
   ۹. سال جاری در فوتر
   ------------------------------------------------------------ */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}