(function () {
  "use strict";

  const config = window.PORTAL_CONFIG;

  if (!config) {
    // Fail fast if the config file is missing or malformed.
    throw new Error("No se encontro PORTAL_CONFIG. Revisa config/portal.config.js");
  }

  const ui = {
    year: document.querySelector("[data-year]"),
    brandName: document.querySelectorAll("[data-brand-name]"),
    brandLogo: document.querySelector(".brand-lockup img"),
    heroTitle: document.querySelector("[data-hero-title]"),
    heroSubtitle: document.querySelector("[data-hero-subtitle]"),
    badgesContainer: document.querySelector("[data-badges]"),
    heroPrimaryCta: document.querySelector("[data-hero-primary-cta]"),
    heroSecondaryCta: document.querySelector("[data-hero-secondary-cta]"),
    heroBackdrop: document.querySelector("[data-hero-backdrop]"),
    heroSlider: document.querySelector("[data-hero-slider]"),
    heroSliderTrack: document.querySelector("[data-hero-slider-track]"),
    heroSliderDots: document.querySelector("[data-hero-dots]"),
    heroPrev: document.querySelector("[data-hero-prev]"),
    heroNext: document.querySelector("[data-hero-next]"),
    featuresContainer: document.querySelector("[data-features]"),
    servicesContainer: document.querySelector("[data-services]"),
    specializationsContainer: document.querySelector("[data-specializations]"),
    processContainer: document.querySelector("[data-process]"),
    pricingContainer: document.querySelector("[data-pricing]"),
    faqContainer: document.querySelector("[data-faq]"),
    phone: document.querySelectorAll("[data-contact-phone]"),
    email: document.querySelectorAll("[data-contact-email]"),
    address: document.querySelector("[data-contact-address]"),
    whatsapp: document.querySelector("[data-whatsapp-link]"),
    whatsappFloat: document.querySelector("[data-whatsapp-float]"),
    whatsappPhone: document.querySelector("[data-whatsapp-phone]"),
    socialContainer: document.querySelector("[data-social]")
  };

  const state = {
    activeHeroSlide: 0,
    heroSliderTimer: null,
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
  };

  function fillTextElements(elements, value) {
    elements.forEach((item) => {
      item.textContent = value;
    });
  }

  function renderBadges(badges) {
    ui.badgesContainer.innerHTML = badges
      .map(
        (badge) => `
          <span class="chip-pill">
            <i class="bi bi-check2-circle" aria-hidden="true"></i>
            ${badge}
          </span>
        `
      )
      .join("");
  }

  function setHeroSlide(index) {
    const slides = ui.heroSliderTrack?.querySelectorAll(".hero-slide") || [];
    const dots = ui.heroSliderDots?.querySelectorAll(".hero-slider-dot") || [];

    if (!slides.length) {
      return;
    }

    const nextIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === nextIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === nextIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    state.activeHeroSlide = nextIndex;
  }

  function stopHeroSlider() {
    if (state.heroSliderTimer) {
      window.clearInterval(state.heroSliderTimer);
      state.heroSliderTimer = null;
    }
  }

  function startHeroSlider(interval) {
    stopHeroSlider();

    if (state.reduceMotion.matches) {
      return;
    }

    state.heroSliderTimer = window.setInterval(() => {
      setHeroSlide(state.activeHeroSlide + 1);
    }, interval);
  }

  function bindHeroSliderEvents(interval) {
    if (!ui.heroSlider) {
      return;
    }

    ui.heroPrev?.addEventListener("click", () => {
      setHeroSlide(state.activeHeroSlide - 1);
      startHeroSlider(interval);
    });

    ui.heroNext?.addEventListener("click", () => {
      setHeroSlide(state.activeHeroSlide + 1);
      startHeroSlider(interval);
    });

    ui.heroSliderDots?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-slide-index]");

      if (!target) {
        return;
      }

      setHeroSlide(Number(target.getAttribute("data-slide-index")) || 0);
      startHeroSlider(interval);
    });

    ui.heroSlider.addEventListener("mouseenter", stopHeroSlider);
    ui.heroSlider.addEventListener("mouseleave", () => startHeroSlider(interval));
    ui.heroSlider.addEventListener("focusin", stopHeroSlider);
    ui.heroSlider.addEventListener("focusout", () => startHeroSlider(interval));
  }

  function renderHeroSlider(heroConfig) {
    const images = heroConfig?.sliderImages;

    if (!ui.heroSliderTrack || !ui.heroSliderDots || !images?.length) {
      return;
    }

    const frames = images.map((src, i) => ({
      src,
      alt: `Vista destacada ${i + 1} de BAMOR`
    }));
    const sliderInterval = Number(heroConfig.sliderInterval) || 4200;

    ui.heroSliderTrack.innerHTML = frames
      .map(
        (frame, index) => `
          <figure class="hero-slide${index === 0 ? " is-active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
            <img src="${frame.src}" alt="${frame.alt}" loading="${index === 0 ? "eager" : "lazy"}" />
          </figure>
        `
      )
      .join("");

    ui.heroSliderDots.innerHTML = frames
      .map(
        (frame, index) => `
          <button
            class="hero-slider-dot${index === 0 ? " is-active" : ""}"
            type="button"
            data-slide-index="${index}"
            aria-label="Mostrar imagen ${index + 1}"
            aria-current="${index === 0 ? "true" : "false"}"
          ></button>
        `
      )
      .join("");

    bindHeroSliderEvents(sliderInterval);
    startHeroSlider(sliderInterval);
  }

  function renderFeatures(features) {
    ui.featuresContainer.innerHTML = features
      .map(
        (feature) => `
          <article class="feature-card reveal-item">
            ${feature.icon ? `<div class="icon-shell"><i class="bi ${feature.icon}" aria-hidden="true"></i></div>` : ""}
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
          </article>
        `
      )
      .join("");
  }

  function renderServices(services) {
    ui.servicesContainer.innerHTML = services
      .map(
        (service) => `
          <article class="service-card reveal-item">
            ${service.image ? `<img src="${service.image}" alt="Servicio de ${service.title}" loading="lazy" />` : ""}
            <div class="service-content">
              <h3>${service.title}</h3>
              <p>${service.description}</p>
              <div class="service-tags">
                ${(service.tags || []).map((tag) => `<span class="service-tag">${tag}</span>`).join("")}
              </div>
              ${service.link ? `<a class="service-link" href="${service.link}" target="_blank" rel="noreferrer noopener">Ver referencia <i class="bi bi-arrow-up-right"></i></a>` : ""}
              ${(service.details && service.details.length) ? `
              <details class="service-details">
                <summary class="service-details-toggle">Ver actividades <i class="bi bi-chevron-down" aria-hidden="true"></i></summary>
                <ul class="service-details-list">
                  ${service.details.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </details>` : ""}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderSpecializations(items) {
    ui.specializationsContainer.innerHTML = items
      .map(
        (item) => `
          <article class="specialty-card reveal-item">
            <div class="icon-shell icon-shell-soft">
              <i class="bi ${item.icon}" aria-hidden="true"></i>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </article>
        `
      )
      .join("");
  }

  function renderProcess(items) {
    ui.processContainer.innerHTML = items
      .map(
        (item) => `
          <article class="process-card reveal-item">
            <span class="process-step">${item.step}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </article>
        `
      )
      .join("");
  }

  function renderPricing(pricing) {
    if (!ui.pricingContainer || !pricing) {
      return;
    }

    ui.pricingContainer.innerHTML = `
      <div class="pricing-banner">
        <div class="pricing-rate">
          <span class="pricing-amount">${pricing.rate}</span>
          <span class="pricing-unit">${pricing.unit}</span>
        </div>
        <p class="pricing-note"><i class="bi bi-info-circle" aria-hidden="true"></i> ${pricing.note}</p>
      </div>
    `;
  }

  function renderFaq(faqs) {
    ui.faqContainer.innerHTML = faqs
      .map(
        (faq, index) => `
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button ${index === 0 ? "" : "collapsed"}"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq-item-${index}"
                aria-expanded="${index === 0 ? "true" : "false"}"
                aria-controls="faq-item-${index}"
              >
                ${faq.question}
              </button>
            </h2>
            <div
              id="faq-item-${index}"
              class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
              data-bs-parent="#faqAccordion"
            >
              <div class="accordion-body">${faq.answer}</div>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderSocial(items) {
    ui.socialContainer.innerHTML = items
      .map(
        (item) => `
          <a href="${item.href}" aria-label="${item.name}" class="social-link" target="_blank" rel="noreferrer noopener">
            <i class="bi ${item.icon}" aria-hidden="true"></i>
          </a>
        `
      )
      .join("");
  }

  function initRevealAnimation() {
    const elements = document.querySelectorAll(".reveal-item");

    if (!elements.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  function init() {
    fillTextElements(ui.brandName, config.brand.shortName);

    if (ui.brandLogo && config.brand.logo) {
      ui.brandLogo.src = config.brand.logo;
    }

    ui.heroTitle.textContent = config.hero.title;
    ui.heroSubtitle.textContent = config.hero.subtitle;

    ui.heroPrimaryCta.textContent = config.hero.ctaPrimary.label;
    ui.heroPrimaryCta.setAttribute("href", config.hero.ctaPrimary.href);

    ui.heroSecondaryCta.textContent = config.hero.ctaSecondary.label;
    ui.heroSecondaryCta.setAttribute("href", config.hero.ctaSecondary.href);

    ui.heroBackdrop.style.backgroundImage = `url('${config.hero.backgroundImage}')`;

    renderHeroSlider(config.hero);

    renderBadges(config.badges || []);
    renderFeatures(config.features);
    renderServices(config.services);
    renderSpecializations(config.specializations || []);
    renderProcess(config.process || []);
    renderPricing(config.pricing);
    renderFaq(config.faqs);
    renderSocial(config.social);

    fillTextElements(ui.phone, config.contact.phone);
    fillTextElements(ui.email, config.contact.email);

    if (ui.address) {
      ui.address.textContent = config.contact.address;
    }

    if (ui.whatsapp) {
      ui.whatsapp.href = config.contact.whatsapp;
    }

    if (ui.whatsappFloat) {
      ui.whatsappFloat.href = config.contact.whatsapp;
    }

    if (ui.whatsappPhone) {
      ui.whatsappPhone.textContent = config.contact.phone;
    }

    if (ui.year) {
      ui.year.textContent = new Date().getFullYear();
    }

    initRevealAnimation();
  }

  init().catch((error) => {
    console.error(error);
  });
})();
