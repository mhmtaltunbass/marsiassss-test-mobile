/**
 * Marsias UI - Optimized JavaScript Code
 *
 * This file is optimized for performance, accessibility, and modern JavaScript practices.
 * Improvements include better error handling, consistent code structure, and enhanced modularity.
 */

/** @type {HTMLElement} Menu overlay element */
const menuOverlay = document.querySelector('.menu-overlay');

/** Music symbols for scroll button animation */
const musicSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];

/**
 * Initialize all modules when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Performans optimizasyonları için eklenenler:
  initEkollerimizLazy();
  initHierarchySection();
  initRoadmapSection();
  // UI Components
  const UI = {
    header: document.querySelector('header'),
    menuToggle: document.querySelector('.menu-toggle'),
    mainNav: document.querySelector('.main-nav'),
    ekipResmi: document.getElementById('ekipResmi'),
    sayaclar: document.querySelectorAll('.sayi'),
    bizKimizBolumu: document.getElementById('bizKimiz'),
    ozellikler: document.querySelectorAll('.ozellik'),
    ctaButtons: document.querySelectorAll('.cta-button'),
    dropdownItems: document.querySelectorAll('nav ul li.has-dropdown'),
    projectsSection: document.getElementById('projects-section'),
    scrollBtn: document.getElementById('scrollBtn'),
    infoPanels: document.querySelectorAll('.info-panel'),
  };

  // Initialize all modules
  initModules(UI);

  // Add close buttons to info panels
  addInfoPanelCloseButtons(UI.infoPanels);

  // Initialize lazy loading for images
  initLazyImages();

  // Ekollerimiz kartları için lazy animasyon
  function initEkollerimizLazy() {
    const cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(card => {
      observer.observe(card);
    });
  }

  // Hiyerarşi bölümü için lazy animasyon ve panel yükleme
  function initHierarchySection() {
    const hierarchySection = document.getElementById('hiyerarsi');
    if (!hierarchySection) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animatePyramid();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(hierarchySection);
  }

  function animatePyramid() {
    const levels = document.querySelectorAll('.level');
    levels.forEach((level, index) => {
      setTimeout(() => {
        level.style.opacity = '1';
        level.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Yol Haritası adımları için optimize animasyon
  function initRoadmapSection() {
    const roadmap = document.querySelector('.roadmap');
    if (!roadmap) return;
    const steps = document.querySelectorAll('.step');
    let delay = 0;
    steps.forEach(step => {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateX(0)';
      }, delay);
      delay += 150;
    });
  }

  // Scroll button visibility
  if (UI.scrollBtn) {
    UI.scrollBtn.style.display = 'none';
    window.addEventListener('scroll', () => {
      UI.scrollBtn.style.display =
        (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
          ? 'flex'
          : 'none';
    });

    UI.scrollBtn.addEventListener('click', (e) => {
      playMusicAnimation(e, UI.scrollBtn);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Optional: playSimpleTones();
    });
  }

  // Add animation styles
  addAnimationStyles();

  // Blog Modal Fonksiyonları
  initBlogModal();

  // Blog detay açma/kapama fonksiyonları
  document.querySelectorAll('.read-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Önce tüm açık detayları kapat
      document.querySelectorAll('.post-full-content').forEach(function (content) {
        content.style.display = 'none';
      });
      // İlgili detay panelini aç
      var fullContent = this.parentElement.querySelector('.post-full-content');
      if (fullContent) {
        fullContent.style.display = 'block';
      }
    });
  });

  // Kapatma butonları
  document.querySelectorAll('.close-post-btn').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
      this.parentElement.style.display = 'none';
    });
  });

  // ESC tuşu ile kapama
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.post-full-content').forEach(function (content) {
        content.style.display = 'none';
      });
    }
  });
});

/**
 * Blog modalı işlevselliği - Her 'Tümünü Görüntüle' butonuna tıklanınca ilgili yazının başlığı ve tam metni modalda gösterilir
 */
function initBlogModal() {
  // Blog yazılarının başlık ve tam metinleri
  const blogPosts = {
    1: {
      title: 'Mobil Uygulama Geliştirmede Yeni Trendler',
      body: `2025 yılında mobil uygulama geliştirme dünyası hızla evrim geçiriyor. Artırılmış gerçeklik entegrasyonları ve yapay zeka destekli kişiselleştirme öne çıkıyor.<br><br><b>Detaylı İçerik:</b><br>- Mobil cihazlarda artırılmış gerçeklik (AR) uygulamaları yaygınlaşıyor.<br>- Kullanıcı deneyimini kişiselleştiren yapay zeka algoritmaları daha fazla uygulamada yer alıyor.<br>- 5G teknolojisiyle birlikte gerçek zamanlı veri aktarımı ve bulut tabanlı oyunlar popülerleşiyor.<br>- Güvenlik ve gizlilik, uygulama geliştirme süreçlerinin merkezinde yer alıyor.`
    },
    2: {
      title: 'Web 3.0 ve Geleceği',
      body: `Merkeziyetsiz internet konseptiyle birlikte web teknolojileri yeni bir evreye geçiyor. Blok zinciri tabanlı uygulamalar ve token ekonomisi ön plana çıkıyor.<br><br><b>Detaylı İçerik:</b><br>- Web 3.0 ile veri sahipliği kullanıcıya geçiyor.<br>- Blok zinciri tabanlı kimlik doğrulama ve güvenli veri paylaşımı yaygınlaşıyor.<br>- Akıllı kontratlar ve merkeziyetsiz uygulamalar (dApps) gelişiyor.<br>- Token ekonomisi ve NFT’ler yeni iş modelleri yaratıyor.`
    },
    3: {
      title: 'Siber Güvenlikte Yeni Tehditler',
      body: `Kuantum hesaplamanın yaygınlaşmasıyla birlikte geleneksel şifreleme yöntemleri risk altında. Post-kuantum kriptografi alanındaki gelişmeleri inceliyoruz.<br><br><b>Detaylı İçerik:</b><br>- Kuantum bilgisayarlar klasik şifreleme algoritmalarını kırabilecek potansiyele sahip.<br>- Post-kuantum kriptografi, yeni nesil güvenli algoritmalar geliştiriyor.<br>- Siber saldırıların çeşitliliği ve karmaşıklığı artıyor.<br>- Kurumlar, güvenlik altyapılarını güncellemek zorunda kalıyor.`
    },
  };

  // Modal ve ilgili elemanları seç
  const modal = document.getElementById('blog-modal');
  const modalTitle = document.getElementById('blog-modal-title');
  const modalBody = document.getElementById('blog-modal-body');
  const closeBtn = document.querySelector('.blog-modal-close');

  // Tüm 'Tümünü Görüntüle' butonlarını seç
  const viewButtons = document.querySelectorAll('.view-full-post');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = this.getAttribute('data-post');
      if (blogPosts[postId]) {
        modalTitle.innerHTML = blogPosts[postId].title;
        modalBody.innerHTML = blogPosts[postId].body;
        modal.classList.add('show');
        document.body.classList.add('modal-open'); // Arka plan kaydırmayı engelle
      }
    });
  });

  // Modalı kapatmak için fonksiyon
  function closeModal() {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }

  // Kapatma butonu ile kapat
  closeBtn.addEventListener('click', closeModal);
  // Modal arka planına tıklayınca kapat
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  // ESC tuşu ile kapat
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}

/**
 * Initialize all UI modules
 * @param {Object} UI - UI elements object
 */
function initModules(UI) {
  if (!menuOverlay) return;
  initImageSlider(UI.ekipResmi);
  initCounterAnimation(UI.sayaclar, UI.bizKimizBolumu);
  initFeatureHover(UI.ozellikler);
  initHeaderInteractions(UI.header, UI.menuToggle, UI.mainNav, UI.dropdownItems);
  if (UI.ctaButtons.length > 0) {
    initCTAButtons(UI.ctaButtons, UI.projectsSection);
  }
}

/**
 * Image slider with lazy loading
 * @param {HTMLElement} imageElement - Team image element
 */
function initImageSlider(imageElement) {
  if (!imageElement) return;

  const images = ['placeholder-resim.jpg', 'ekip-resim-2.jpg', 'ekip-resim-3.jpg'];
  let currentIndex = 0;
  const transitionDuration = 500;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !window.sliderInterval) {
        window.sliderInterval = setInterval(changeImage, 5000);
      } else if (!entries[0].isIntersecting && window.sliderInterval) {
        clearInterval(window.sliderInterval);
        window.sliderInterval = null;
      }
    },
    { threshold: 0.2 }
  );

  imageObserver.observe(imageElement);

  function changeImage() {
    imageElement.style.opacity = 0;
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imageElement.src = images[currentIndex];
      imageElement.style.opacity = 1;
    }, transitionDuration);
  }

  imageElement.style.transition = `opacity ${transitionDuration / 1000}s ease`;
}

/**
 * Counter animation for statistics
 * @param {NodeList} counters - Counter elements
 * @param {HTMLElement} section - Section containing counters
 */
function initCounterAnimation(counters, section) {
  if (!section || counters.length === 0) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-hedef') || 0);
          animateCounter(counter, target);
        });
        counterObserver.unobserve(section);
      }
    },
    { threshold: 0.3 }
  );

  counterObserver.observe(section);

  function animateCounter(element, target) {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    const startValue = 0;
    const valueIncrement = (target - startValue) / totalFrames;

    const animate = () => {
      frame++;
      const currentValue = Math.ceil(startValue + valueIncrement * frame);
      element.textContent = currentValue;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(animate);
  }
}

/**
 * Feature card hover effects
 * @param {NodeList} features - Feature cards
 */
function initFeatureHover(features) {
  if (features.length === 0) return;

  const featureContainer = features[0].parentElement;
  if (!featureContainer) return;

  featureContainer.addEventListener('mouseover', handleHover);
  featureContainer.addEventListener('mouseout', handleHover);
  featureContainer.addEventListener('focusin', handleHover);
  featureContainer.addEventListener('focusout', handleHover);

  function handleHover(e) {
    const feature = e.target.closest('.ozellik');
    if (!feature) return;

    feature.classList.toggle('hover', e.type === 'mouseover' || e.type === 'focusin');
  }
}

/**
 * Header and menu interactions
 * @param {HTMLElement} header - Header element
 * @param {HTMLElement} menuToggle - Menu toggle button
 * @param {HTMLElement} mainNav - Main navigation
 * @param {NodeList} dropdownItems - Dropdown menu items
 */
function initHeaderInteractions(header, menuToggle, mainNav, dropdownItems) {
  if (!header || !menuToggle || !mainNav || !menuOverlay) return;

  let lastScrollTop = 0;
  const scrollThreshold = 10;

  menuToggle.addEventListener('click', () => {
    toggleMenu(!mainNav.classList.contains('active'));
  });

  menuOverlay.addEventListener('click', () => toggleMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  const navLinks = mainNav.querySelectorAll('nav ul li a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (window.innerWidth <= 768 && link.parentElement.classList.contains('has-dropdown')) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('active');
        link.setAttribute('aria-expanded', parent.classList.contains('active'));
      } else if (href.startsWith('#')) {
        e.preventDefault();
        if (mainNav.classList.contains('active')) {
          toggleMenu(false);
        }
        scrollToSection(href);
      }
    });
  });

  window.addEventListener('scroll', handleHeaderScroll);
  setTimeout(handleHeaderScroll, 100);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
      toggleMenu(false);
      dropdownItems.forEach((item) => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    }
  });

  function toggleMenu(isOpen) {
    menuToggle.classList.toggle('active', isOpen);
    mainNav.classList.toggle('active', isOpen);
    menuOverlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function handleHeaderScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop <= 10) {
      header.classList.remove('scrolled-down', 'scrolled-up');
      header.classList.add('at-top');
    } else {
      header.classList.remove('scrolled-down', 'at-top');
      header.classList.add('scrolled-up');
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  function scrollToSection(hash) {
    const targetId = hash.substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      targetSection.classList.add('highlight');
      setTimeout(() => targetSection.classList.remove('highlight'), 1500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.body.style.overflow = '';
  }
}

/**
 * CTA button functionalities
 * @param {NodeList} buttons - CTA buttons
 * @param {HTMLElement} projectsSection - Projects section
 */
function initCTAButtons(buttons, projectsSection) {
  const buttonActions = {
    'Üye bilgilendirme formunu indir': downloadMarsiasBildiri,
    'Profil paylaşım formunu doldur': () => redirectToSignalGroup('profile'),
    'Signal grubuna katıl': () => redirectToSignalGroup('main'),
    'Ekol başvuru formunu doldur': redirectToEkolForm,
    'Etkinlik takvimini görüntüle': showCalendar,
    'Proje havuzunu incele': () => scrollToProjects(projectsSection),
  };

  document.addEventListener('click', (e) => {
    const button = e.target.closest('.cta-button');
    if (!button) return;

    e.preventDefault();
    const buttonType = button.getAttribute('aria-label');

    if (buttonActions[buttonType]) {
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 300);
      buttonActions[buttonType]();
    }
  });

  function downloadMarsiasBildiri() {
    const pdfUrl = '/assets/documents/marsias.bildiri.pdf';
    if (window.gtag) {
      gtag('event', 'download', {
        event_category: 'documents',
        event_label: 'marsias.bildiri.pdf',
      });
    }

    fetch(pdfUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'marsias.bildiri.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(() => window.open(pdfUrl, '_blank'));
  }

  function redirectToSignalGroup(groupType) {
    const signalGroups = {
      profile: 'https://signal.group/#ProfileSharingGroupURL',
      main: 'https://signal.group/#MainCommunityGroupURL',
    };

    const signalUrl = signalGroups[groupType];
    if (!signalUrl) return;

    showLinkDialog({
      title: 'Signal Grubuna Katılım',
      message:
        'Signal uygulamasına yönlendiriliyorsunuz. Signal yüklü değilse, linki kopyalayıp Signal uygulamasını kurduktan sonra kullanabilirsiniz.',
      primaryLabel: "Signal'a Git",
      secondaryLabel: 'Linki Kopyala',
      onPrimary: () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          const deepLink = /iPhone|iPad|iPod/i.test(navigator.userAgent)
            ? `signal://signal.group/${signalUrl}`
            : `intent://${signalUrl}#Intent;package=org.thoughtcrime.securesms;scheme=signal;end`;
          window.location.href = deepLink;
          setTimeout(() => (window.location.href = signalUrl), 2000);
        } else {
          window.open(signalUrl, '_blank');
        }
      },
      onSecondary: () => {
        navigator.clipboard
          .writeText(signalUrl)
          .then(() => showToast('Link kopyalandı!'))
          .catch(() => showToast('Link kopyalanamadı.'));
      },
    });
  }

  function redirectToEkolForm() {
    const formUrl = 'https://forms.gle/qo3M9Cvm58ZFv3Y78';
    window.open(formUrl, '_blank');
    if (window.gtag) {
      gtag('event', 'form_open', {
        event_category: 'engagement',
        event_label: 'ekol_basvuru',
      });
    }
  }

  function scrollToProjects(section) {
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showCalendar() {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = `
      <div class="calendar-modal" role="dialog" aria-labelledby="calendar-title">
        <div class="calendar-modal-content">
          <div class="modal-header">
            <h2 id="calendar-title">Etkinlik Takvimi</h2>
            <button type="button" class="close-calendar" aria-label="Kapat">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div id="calendar-container">
            <div class="calendar-loading">
              <div class="spinner"></div>
              <p>Takvim yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);
    document.body.style.overflow = 'hidden';

    const calendarModal = modalContainer.querySelector('.calendar-modal');
    const closeButton = modalContainer.querySelector('.close-calendar');
    const previousFocus = document.activeElement;

    setTimeout(() => closeButton.focus(), 100);

    const closeModal = () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      calendarModal.removeEventListener('click', handleClickOutside);
      document.body.removeChild(modalContainer);
      if (previousFocus) previousFocus.focus();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    const handleClickOutside = (e) => {
      if (e.target === calendarModal) closeModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    calendarModal.addEventListener('click', handleClickOutside);
    closeButton.addEventListener('click', closeModal);

    setTimeout(() => calendarModal.classList.add('show'), 10);
    generateCalendar(modalContainer.querySelector('#calendar-container'));
  }

  function generateCalendar(container) {
    if (!container) return;

    setTimeout(() => {
      container.querySelector('.calendar-loading')?.remove();

      const now = new Date();
      let displayMonth = now.getMonth();
      let displayYear = now.getFullYear();

      const events = {};

      const calendarControls = document.createElement('div');
      calendarControls.className = 'calendar-controls';
      calendarControls.innerHTML = `
        <div class="calendar-nav">
          <button type="button" class="btn-prev-month" aria-label="Önceki ay">«</button>
          <h3 class="current-month">Nisan 2025</h3>
          <button type="button" class="btn-next-month" aria-label="Sonraki ay">»</button>
        </div>
        <div class="calendar-filters">
          <label class="filter">
            <input type="checkbox" value="meeting" checked> Toplantılar
          </label>
          <label class="filter">
            <input type="checkbox" value="workshop" checked> Çalıştaylar
          </label>
          <label class="filter">
            <input type="checkbox" value="event" checked> Etkinlikler
          </label>
        </div>
      `;

      const calendarGrid = document.createElement('div');
      calendarGrid.className = 'calendar-grid';
      container.appendChild(calendarControls);
      container.appendChild(calendarGrid);

      function renderCalendar() {
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const firstDay = new Date(displayYear, displayMonth, 1);
        const lastDay = new Date(displayYear, displayMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const monthTitle = container.querySelector('.current-month');
        if (monthTitle) {
          monthTitle.textContent = `${monthNames[displayMonth]} ${displayYear}`;
        }

        calendarGrid.innerHTML = '';
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        dayNames.forEach((day) => {
          const dayHeader = document.createElement('div');
          dayHeader.className = 'day-header';
          dayHeader.textContent = day;
          calendarGrid.appendChild(dayHeader);
        });

        for (let i = 0; i < firstDayOfWeek; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement('div');
          dayCell.className = 'calendar-day';

          if (displayMonth === now.getMonth() && displayYear === now.getFullYear() && day === now.getDate()) {
            dayCell.classList.add('today');
          }

          const dayNumber = document.createElement('div');
          dayNumber.className = 'day-number';
          dayNumber.textContent = day;
          dayCell.appendChild(dayNumber);

          const dateKey = `${displayYear}-${(displayMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dayEvents = events[dateKey] || [];

          if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            dayEvents.forEach((event) => {
              const eventElement = document.createElement('div');
              eventElement.className = `event ${event.type}`;
              eventElement.innerHTML = `
                <span class="event-time">${event.time}</span>
                <span class="event-title">${event.title}</span>
              `;
              eventsContainer.appendChild(eventElement);
            });
            dayCell.appendChild(eventsContainer);
            dayCell.classList.add('has-events');
          }

          calendarGrid.appendChild(dayCell);
        }
      }

      renderCalendar();

      const prevButton = container.querySelector('.btn-prev-month');
      const nextButton = container.querySelector('.btn-next-month');

      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
          displayMonth--;
          if (displayMonth < 0) {
            displayMonth = 11;
            displayYear--;
          }
          renderCalendar();
        });

        nextButton.addEventListener('click', () => {
          displayMonth++;
          if (displayMonth > 11) {
            displayMonth = 0;
            displayYear++;
          }
          renderCalendar();
        });
      }

      const filters = container.querySelectorAll('.calendar-filters input');
      filters.forEach((filter) => {
        filter.addEventListener('change', () => {
          const checkedTypes = Array.from(filters)
            .filter((f) => f.checked)
            .map((f) => f.value);

          const eventElements = container.querySelectorAll('.event');
          eventElements.forEach((eventEl) => {
            eventEl.style.display = checkedTypes.some((type) => eventEl.classList.contains(type))
              ? 'flex'
              : 'none';
          });
        });
      });
    }, 500);
  }
}

/**
 * Show custom dialog
 * @param {Object} options - Dialog options
 */
function showLinkDialog({ title, message, primaryLabel, secondaryLabel, onPrimary, onSecondary }) {
  const dialog = document.createElement('div');
  dialog.className = 'custom-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'dialog-title');

  dialog.innerHTML = `
    <div class="dialog-content">
      <div class="dialog-header">
        <h3 id="dialog-title">${title}</h3>
        <button type="button" class="dialog-close" aria-label="Kapat">×</button>
      </div>
      <div class="dialog-body">
        <p>${message}</p>
      </div>
      <div class="dialog-footer">
        <button type="button" class="btn-secondary">${secondaryLabel}</button>
        <button type="button" class="btn-primary">${primaryLabel}</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  document.body.classList.add('dialog-open');

  setTimeout(() => dialog.classList.add('show'), 10);

  const closeBtn = dialog.querySelector('.dialog-close');
  const primaryBtn = dialog.querySelector('.btn-primary');
  const secondaryBtn = dialog.querySelector('.btn-secondary');

  const closeDialog = () => {
    dialog.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(dialog);
      document.body.classList.remove('dialog-open');
    }, 300);
  };

  closeBtn.addEventListener('click', closeDialog);
  primaryBtn.addEventListener('click', () => {
    if (onPrimary) onPrimary();
    closeDialog();
  });
  secondaryBtn.addEventListener('click', () => {
    if (onSecondary) onSecondary();
    closeDialog();
  });

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      closeDialog();
      document.removeEventListener('keydown', handler);
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });
}

/**
 * Show toast message
 * @param {string} message - Message to display
 * @param {number} duration - Display duration in ms
 */
function showToast(message, duration = 3000) {
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.setAttribute('role', 'alert');

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, duration);
}

/**
 * Lazy load images
 */
function initLazyImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
  } else {
    document.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
}

/**
 * Add close buttons to info panels
 * @param {NodeList} panels - Info panels
 */
function addInfoPanelCloseButtons(panels) {
  panels.forEach((panel) => {
    if (!panel.querySelector('.close-btn')) {
      const closeBtn = document.createElement('div');
      closeBtn.className = 'close-btn';
      closeBtn.setAttribute('aria-label', 'Kapat');
      closeBtn.innerHTML = '×';
      closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
      });
      panel.appendChild(closeBtn);
    }
  });
}

/**
 * Show info panel
 * @param {string} panelId - Panel ID
 */
function showInfo(panelId) {
  const allPanels = document.querySelectorAll('.info-panel');
  allPanels.forEach((panel) => (panel.style.display = 'none'));

  const selectedPanel = document.getElementById(`info-${panelId}`);
  if (selectedPanel) {
    selectedPanel.style.display = 'block';
    selectedPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const allLevels = document.querySelectorAll('.level');
  allLevels.forEach((level) => level.classList.remove('active'));

  const clickedLevel = document.querySelector(`[onclick="showInfo('${panelId}')"]`);
  if (clickedLevel) clickedLevel.classList.add('active');
}

/**
 * Show alert box
 */
function showAlert() {
  const alertBox = document.getElementById('customAlert');
  if (alertBox) {
    alertBox.style.display = 'block';
    setTimeout(() => (alertBox.style.display = 'none'), 4000);
  }
}

/**
 * Hide alert box
 */
function hideAlert() {
  const alertBox = document.getElementById('customAlert');
  if (alertBox) alertBox.style.display = 'none';
}

/**
 * Play music note animation
 * @param {Event} e - Click event
 * @param {HTMLElement} button - Scroll button
 */
function playMusicAnimation(e, button) {
  const rect = button.getBoundingClientRect();
  const buttonCenterX = rect.left + rect.width / 2;
  const buttonCenterY = rect.top + rect.height / 2;

  for (let i = 0; i < 5; i++) {
    const musicNote = document.createElement('div');
    musicNote.className = 'music-animation';
    musicNote.textContent = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    musicNote.style.position = 'fixed';
    musicNote.style.left = `${buttonCenterX + x}px`;
    musicNote.style.top = `${buttonCenterY + y}px`;
    musicNote.style.fontSize = '24px';
    musicNote.style.color = '#007bff';
    musicNote.style.zIndex = '9999';
    musicNote.style.pointerEvents = 'none';
    musicNote.style.animation = 'float-up 2s ease-out forwards';

    document.body.appendChild(musicNote);
    setTimeout(() => musicNote.remove(), 2000);
  }
}

/**
 * Play simple audio tones
 */
function playSimpleTones() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [
      { frequency: 440, duration: 0.1 },
      { frequency: 494, duration: 0.1 },
      { frequency: 523, duration: 0.1 },
      { frequency: 587, duration: 0.1 },
      { frequency: 659, duration: 0.1 },
    ];

    let time = audioContext.currentTime;
    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = note.frequency;

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.2, time + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, time + note.duration);

      oscillator.start(time);
      oscillator.stop(time + note.duration);

      time += note.duration;
    });
  } catch (e) {
    console.log('Audio playback failed:', e);
  }
}

/**
 * Add animation styles to document
 */
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(0, -100px) scale(0.5); opacity: 0; }
    }
    #scrollBtn {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: #007bff;
      color: white;
      border-radius: 50%;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      z-index: 1000;
    }
    #scrollBtn:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(style);
}
document.addEventListener('DOMContentLoaded', function() {
  // Gerekli DOM elemanlarını seç
  const slider = document.querySelector('.projects-slider');
  const track = document.querySelector('.projects-track');
  const slides = document.querySelectorAll('.project-card');
  const prevButton = document.querySelector('.slider-prev');
  const nextButton = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');
  
  // Slide genişliğini hesapla (kart genişliği + margin)
  const slideWidth = slides[0].offsetWidth + 40;
  
  // Her ekranda kaç slide gösterileceğini belirleme
  // Genişlik arttıkça daha fazla projeye yer açabilmek için kısıtlama
  const visibleSlides = Math.min(3, Math.floor(slider.offsetWidth / slideWidth));
  
  const totalSlides = slides.length;
  
  // Toplam nokta sayısını hesapla (kaç grup slide var)
  const totalDots = Math.ceil((totalSlides - visibleSlides + 1) / visibleSlides);
  let currentIndex = 0;
  
  // Dot'ları oluştur
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i * visibleSlides));
    dotsContainer.appendChild(dot);
  }
  
  // Dot'ları güncelle
  function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    const activeDotIndex = Math.floor(currentIndex / visibleSlides);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeDotIndex);
    });
  }
  
  // Belirli bir slide'a git
  function goToSlide(index) {
    currentIndex = index;
    
    // Sınırları kontrol et
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > totalSlides - visibleSlides) currentIndex = totalSlides - visibleSlides;
    
    // Pozisyonu hesapla ve uygula
    const position = -currentIndex * slideWidth;
    track.style.transform = `translateX(${position}px)`;
    
    // Aktif dot'u güncelle
    updateDots();
    
    // Ok butonlarının durumunu güncelle
    updateArrowsState();
  }
  
  // Ok butonlarının durumunu güncelle (ilk veya son slide'daysa devre dışı bırak)
  function updateArrowsState() {
    prevButton.classList.toggle('disabled', currentIndex === 0);
    nextButton.classList.toggle('disabled', currentIndex >= totalSlides - visibleSlides);
  }
  
  // Önceki slide'a git
  function goToPrev() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - visibleSlides);
    }
  }
  
  // Sonraki slide'a git
  function goToNext() {
    if (currentIndex < totalSlides - visibleSlides) {
      goToSlide(currentIndex + visibleSlides);
    }
  }
  
  // Event listeners
  prevButton.addEventListener('click', goToPrev);
  nextButton.addEventListener('click', goToNext);
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  });
  
  // Touch events for swipe
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    // Sağa kaydırılırsa (sonraki slide)
    if (touchEndX - touchStartX > 100) {
      goToPrev();
    }
    // Sola kaydırılırsa (önceki slide)
    else if (touchStartX - touchEndX > 100) {
      goToNext();
    }
  }
  
  // Otomatik kaydırma (isteğe bağlı)
  /*
  const autoSlideInterval = 5000; // 5 saniye
  let autoSlideTimer = setInterval(goToNext, autoSlideInterval);
  
  // Mouse slider üzerindeyken otomatik kaydırmayı durdur
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideTimer);
  });
  
  // Mouse slider üzerinden ayrıldığında otomatik kaydırmayı tekrar başlat
  slider.addEventListener('mouseleave', () => {
    autoSlideTimer = setInterval(goToNext, autoSlideInterval);
  });
  */
  
  // Responsive handling - ekran boyutu değiştiğinde slider'ı güncelle
  window.addEventListener('resize', () => {
    // Yeniden hesaplama için biraz bekleyelim
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
      // Slide genişliğini ve görünür slide sayısını yeniden hesapla
      const newSlideWidth = slides[0].offsetWidth + 40;
      const newVisibleSlides = Math.min(3, Math.floor(slider.offsetWidth / newSlideWidth));
      
      // Eğer değişiklik olduysa slider'ı sıfırla ve yeniden başlat
      if (newSlideWidth !== slideWidth || newVisibleSlides !== visibleSlides) {
        // Tüm dot'ları temizle ve yeniden oluştur
        while (dotsContainer.firstChild) {
          dotsContainer.removeChild(dotsContainer.firstChild);
        }
        
        // İlk slide'a dön
        goToSlide(0);
        
        // Sayfayı yenile (bu daha temiz bir çözüm olacaktır)
        // location.reload();
      }
    }, 300);
  });
  
  // İlk yükleme
  goToSlide(0);
  updateArrowsState();
  
  // Slider'ın görünür olduğundan emin olmak için
  track.style.opacity = 1;
});// Blog gönderilerinde "Tümünü Görüntüle" butonu işlevselliği
function initBlogModalView() {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  const closeButtons = document.querySelectorAll('.close-post-btn');
  const blogPosts = document.querySelectorAll('.blog-post');

  readMoreButtons.forEach(button => {
    button.addEventListener('click', function () {
      const post = this.closest('.blog-post');

      // HEADER'I GİZLE
      var headerEl = document.querySelector('header');
      if (headerEl) headerEl.style.display = 'none';

      // Tüm diğer blogları eski haline getir
      blogPosts.forEach(p => {
        p.classList.remove('fullscreen');
        p.querySelector('.post-full-content').style.display = 'none';
      });

      // Bu yazıyı tam ekran yap
      post.classList.add('fullscreen');
      post.querySelector('.post-full-content').style.display = 'block';
      document.body.classList.add('modal-open');

      // Focus trap: ilk close butonuna odaklan
      const closeBtn = post.querySelector('.close-post-btn');
      if (closeBtn) closeBtn.focus();

      // Focus trap: sadece modal içi odaklanabilir
      function trapFocus(e) {
        const focusableEls = post.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else { // Tab
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      }
      post.addEventListener('keydown', trapFocus);
      post._trapFocusHandler = trapFocus;
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const post = this.closest('.blog-post');
      post.classList.remove('fullscreen');
      post.querySelector('.post-full-content').style.display = 'none';
      document.body.classList.remove('modal-open');
      // HEADER'I GERİ GETİR
      var headerEl = document.querySelector('header');
      if (headerEl) headerEl.style.display = '';
      // Remove focus trap
      if (post._trapFocusHandler) {
        post.removeEventListener('keydown', post._trapFocusHandler);
        delete post._trapFocusHandler;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initBlogModalView);


// DOM yüklendiğinde çağır
document.addEventListener('DOMContentLoaded', initBlogReadMore);document.addEventListener('DOMContentLoaded', () => {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');
  document.body.appendChild(modalOverlay);

  readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Öncelikle bütün açık modal'ları kapat (varsa)
      document.querySelectorAll('.post-full-content').forEach(modal => {
        modal.style.display = 'none';
      });
      modalOverlay.style.display = 'block';

      const post = button.closest('.blog-post');
      const fullContent = post.querySelector('.post-full-content');

      fullContent.style.display = 'block';
      // Scroll'u modal içerisine odakla (isteğe bağlı)
      fullContent.scrollTop = 0;
    });
  });

  // Modal üzerindeki kapatma butonları
  document.querySelectorAll('.close-post-btn').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  });

  // Overlay'e tıklayınca da modal kapansın
  modalOverlay.addEventListener('click', () => {
    closeModal();
  });

  function closeModal() {
    document.querySelectorAll('.post-full-content').forEach(modal => {
      modal.style.display = 'none';
    });
    modalOverlay.style.display = 'none';
  }
});
// Add this code to adjust your layout for mobile

// First, ensure header and 3D container don't overlap
document.addEventListener('DOMContentLoaded', function() {
  // Get the header element
  const header = document.querySelector('header');
  
  // Get the 3D container
  const container3D = document.querySelector('#misyon-vizyon');
  
  // Make sure the container starts below header
  if (header && container3D) {
    // Get header height
    const headerHeight = header.offsetHeight;
    
    // Apply proper spacing
    container3D.style.marginTop = headerHeight + 'px';
    container3D.style.position = 'relative';
    container3D.style.zIndex = '1';
  }
  
  // Adjust for mobile screens
  function adjustForMobile() {
    if (window.innerWidth <= 768) {  // Mobile breakpoint
      // Adjust camera position for better mobile viewing
      if (window.camera) {
        camera.position.set(0, 30, 60);
        camera.updateProjectionMatrix();
      }
      
      // Make sure the 3D model is fully visible
      const modelContainer = document.querySelector('.container');
      if (modelContainer) {
        modelContainer.style.height = 'calc(100vh - ' + headerHeight + 'px)';
        modelContainer.style.overflow = 'hidden';
      }
    }
  }
  
  // Run adjustments once and on resize
  adjustForMobile();
  window.addEventListener('resize', adjustForMobile);
});