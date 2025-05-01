/**
 * Marsias UI - Geliştirilmiş JavaScript Kodu
 *
 * Bu dosya, performans, erişilebilirlik ve modern JavaScript özellikleri
 * göz önünde bulundurularak optimize edilmiştir.
 */

// Menü overlay elementini HTML'den al
const menuOverlay = document.querySelector('.menu-overlay');

// Sayfa yüklendiğinde tüm modülleri başlat
document.addEventListener('DOMContentLoaded', () => {
  // UI Bileşenleri
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
  };

  // Tüm modülleri başlat
  initModules(UI, menuOverlay);
});

/**
 * Tüm UI modüllerini başlatan ana fonksiyon
 * @param {Object} UI - UI elementlerini içeren nesne
 * @param {HTMLElement} menuOverlay - Menü arkaplan overlay elementi
 */
function initModules(UI, menuOverlay) {
  // Temel bileşenler
  initImageSlider(UI.ekipResmi);
  initCounterAnimation(UI.sayaclar, UI.bizKimizBolumu);
  initFeatureHover(UI.ozellikler);
  initHeaderInteractions(UI.header, UI.menuToggle, UI.mainNav, UI.dropdownItems, menuOverlay);

  // İnteraktif bileşenler
  if (UI.ctaButtons.length > 0) {
    initCTAButtons(UI.ctaButtons, UI.projectsSection);
  }
}

/**
 * Resim geçiş efekti ile ekip resmini değiştiren slider
 * @param {HTMLElement} imageElement - Ekip resmi elementi
 */
function initImageSlider(imageElement) {
  if (!imageElement) return;

  const images = ['placeholder-resim.jpg', 'ekip-resim-2.jpg', 'ekip-resim-3.jpg'];

  let currentIndex = 0;
  const transitionDuration = 500; // ms cinsinden

  // ImageObserver ile görünürlüğü kontrol et (lazy load için)
  const imageObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !window.sliderInterval) {
        // Element görünür olduğunda slider'ı başlat
        window.sliderInterval = setInterval(changeImage, 5000);
      } else if (!entries[0].isIntersecting && window.sliderInterval) {
        // Element görünmediğinde slider'ı durdur (performans için)
        clearInterval(window.sliderInterval);
        window.sliderInterval = null;
      }
    },
    { threshold: 0.2 }
  );

  imageObserver.observe(imageElement);

  // GSAP yerine daha hafif bir geçiş animasyonu
  function changeImage() {
    imageElement.style.opacity = 0;

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imageElement.src = images[currentIndex];
      imageElement.style.opacity = 1;
    }, transitionDuration);
  }

  // CSS geçiş efekti ekle
  imageElement.style.transition = `opacity ${transitionDuration / 1000}s ease`;
}

/**
 * İstatistik sayaçları için animasyon
 * @param {NodeList} counters - Sayaç elementleri
 * @param {HTMLElement} section - Sayaçların bulunduğu bölüm
 */
function initCounterAnimation(counters, section) {
  if (!section || counters.length === 0) return;

  // Sayaçların görünür olup olmadığını kontrol et
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        // Her sayacı animasyonla hedefine ulaştır
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

  // GSAP yerine RAF kullanarak daha performanslı sayaç animasyonu
  function animateCounter(element, target) {
    const duration = 2000; // Animasyon süresi (ms)
    const frameDuration = 1000 / 60; // 60fps
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
        element.textContent = target; // Tam sayıya ulaşmasını garanti et
      }
    };

    requestAnimationFrame(animate);
  }
}

/**
 * Özellik kartları için hover efektleri
 * @param {NodeList} features - Özellik kartları
 */
function initFeatureHover(features) {
  if (features.length === 0) return;

  // Performans için olay yetkilendirme (event delegation) kullan
  const featureContainer = features[0].parentElement;

  if (!featureContainer) return;

  featureContainer.addEventListener('mouseover', handleFeatureHover);
  featureContainer.addEventListener('mouseout', handleFeatureHover);
  featureContainer.addEventListener('focusin', handleFeatureHover);
  featureContainer.addEventListener('focusout', handleFeatureHover);

  function handleFeatureHover(e) {
    // En yakın özellik kartını bul
    const feature = e.target.closest('.ozellik');
    if (!feature) return;

    // Olay tipine göre işlem yap
    if (e.type === 'mouseover' || e.type === 'focusin') {
      feature.classList.add('hover');
      // Renk geçişi için CSS sınıfı kullan (GSAP yerine CSS transitions)
    } else {
      feature.classList.remove('hover');
    }
  }
}

/**
 * Header ve menü etkileşimleri
 * @param {HTMLElement} header - Header elementi
 * @param {HTMLElement} menuToggle - Menü toggle butonu
 * @param {HTMLElement} mainNav - Ana navigasyon
 * @param {NodeList} dropdownItems - Açılır menü öğeleri
 * @param {HTMLElement} menuOverlay - Menü arkaplan overlay'i
 */
function initHeaderInteractions(header, menuToggle, mainNav, dropdownItems, menuOverlay) {
  if (!header || !menuToggle || !mainNav || !menuOverlay) return;

  // Scroll durumu için değişkenler
  let lastScrollTop = 0;
  const scrollThreshold = 10;
  let scrollTimeout;

  // Menü toggle işlevi
  menuToggle.addEventListener('click', () => {
    toggleMenu(!mainNav.classList.contains('active'));
  });

  // Overlay'a tıklayınca menüyü kapat
  menuOverlay.addEventListener('click', () => {
    toggleMenu(false);
  });

  // ESC tuşuyla menüyü kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Tüm menü linkleri için tıklama olayı (single-page navigation)
  const navLinks = mainNav.querySelectorAll('nav ul li a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Mobil görünümde dropdown toggle için kontrol
      if (window.innerWidth <= 768 && link.parentElement.classList.contains('has-dropdown')) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('active');
        const isExpanded = parent.classList.contains('active');
        link.setAttribute('aria-expanded', isExpanded);
      } else if (href.startsWith('#')) {
        e.preventDefault();
        // Mobil menüyü kapat
        if (mainNav.classList.contains('active')) {
          toggleMenu(false);
        }
        scrollToSection(href);
        // Scroll'u yeniden etkinleştir (güvenlik önlemi)
        document.body.style.overflow = '';
      }
    });
  });

  // Scroll olayını dinle - Bu satırı ekleyin
  window.addEventListener('scroll', handleHeaderScroll);

  // Sayfa yüklendiğinde ilk scroll pozisyonunu kontrol et
  setTimeout(handleHeaderScroll, 100);

  // Ekran boyutu değiştiğinde kontrol
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
      toggleMenu(false);
      // Mobil görünümdeki açık dropdown'ları sıfırla
      if (dropdownItems) {
        dropdownItems.forEach((item) => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    }
  });

  // Menü durumunu değiştir
  function toggleMenu(isOpen) {
    menuToggle.classList.toggle('active', isOpen);
    mainNav.classList.toggle('active', isOpen);
    menuOverlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);

    // ARIA erişilebilirlik
    menuToggle.setAttribute('aria-expanded', isOpen);

    // Scroll kontrolü
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Header'ın scroll davranışını yönet (düzeltilmiş fonksiyon)
  function handleHeaderScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Sayfanın en üstündeyse
    if (currentScrollTop <= 10) {
      header.classList.remove('scrolled-down', 'scrolled-up');
      header.classList.add('at-top');
    }
    // Aşağı kaydırma - Header'ı gizle
    else if (currentScrollTop > lastScrollTop && currentScrollTop > 150) {
      header.classList.add('scrolled-down');
      header.classList.remove('scrolled-up', 'at-top');
    }
    // Yukarı kaydırma - Header'ı göster
    else if (currentScrollTop < lastScrollTop - scrollThreshold) {
      header.classList.remove('scrolled-down', 'at-top');
      header.classList.add('scrolled-up');
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  // Bölüme kaydırma fonksiyonu
  function scrollToSection(hash) {
    const targetId = hash.substring(1); // # işaretini kaldır
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Vurgulama efekti
      targetSection.classList.add('highlight');
      setTimeout(() => targetSection.classList.remove('highlight'), 1500);
    } else {
      // Hedef bölüm bulunamazsa, varsayılan olarak sayfanın üstüne kaydır
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Scroll'u yeniden etkinleştir (güvenlik önlemi)
    document.body.style.overflow = '';
  }
}

/**
 * CTA butonlarının işlevleri
 * @param {NodeList} buttons - CTA butonları
 * @param {HTMLElement} projectsSection - Projeler bölümü
 */
function initCTAButtons(buttons, projectsSection) {
  // Buton işlevleri
  const buttonActions = {
    'Üye bilgilendirme formunu indir': downloadMarsiasBildiri,
    'Profil paylaşım formunu doldur': () => redirectToSignalGroup('profile'),
    'Signal grubuna katıl': () => redirectToSignalGroup('main'),
    'Ekol başvuru formunu doldur': redirectToEkolForm,
    'Etkinlik takvimini görüntüle': showCalendar,
    'Proje havuzunu incele': () => scrollToProjects(projectsSection),
  };

  // Event delegation ile performanslı tıklama işlevi
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.cta-button');
    if (!button) return;

    e.preventDefault();
    const buttonType = button.getAttribute('aria-label');

    // Buton tipine göre ilgili işlevi çağır
    if (buttonActions[buttonType]) {
      // Buton tıklama efekti
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 300);

      buttonActions[buttonType]();
    }
  });

  /**
   * PDF indirme işlevi
   */
  function downloadMarsiasBildiri() {
    const pdfUrl = '/assets/documents/marsias.bildiri.pdf';

    // Analitik izlemesi (opsiyonel)
    if (window.gtag) {
      gtag('event', 'download', {
        event_category: 'documents',
        event_label: 'marsias.bildiri.pdf',
      });
    }

    try {
      // Modern browsers için Blob API kullan
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

          // Temizlik
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(() => {
          // Fallback
          window.open(pdfUrl, '_blank');
        });
    } catch (e) {
      // Eski tarayıcılar için yedek yöntem
      window.open(pdfUrl, '_blank');
    }
  }

  /**
   * Signal grubuna yönlendirme
   * @param {string} groupType - Grup tipi ('profile' veya 'main')
   */
  function redirectToSignalGroup(groupType) {
    const signalGroups = {
      profile: 'https://signal.group/#ProfileSharingGroupURL',
      main: 'https://signal.group/#MainCommunityGroupURL',
    };

    const signalUrl = signalGroups[groupType];
    if (!signalUrl) return;

    // Kullanıcı deneyimi iyileştirmesi: Daha güvenilir deep link stratejisi
    showLinkDialog({
      title: 'Signal Grubuna Katılım',
      message:
        'Signal uygulamasına yönlendiriliyorsunuz. Signal yüklü değilse, linki kopyalayıp Signal uygulamasını kurduktan sonra kullanabilirsiniz.',
      primaryLabel: "Signal'a Git",
      secondaryLabel: 'Linki Kopyala',
      onPrimary: () => {
        // Platformlara göre uygun deep link
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = `signal://signal.group/${signalUrl}`;
          } else if (/Android/i.test(navigator.userAgent)) {
            window.location.href = `intent://${signalUrl}#Intent;package=org.thoughtcrime.securesms;scheme=signal;end`;
          }
          // 2 saniye sonra açılmazsa doğrudan URL'e yönlendir
          setTimeout(() => {
            window.location.href = signalUrl;
          }, 2000);
        } else {
          window.open(signalUrl, '_blank');
        }
      },
      onSecondary: () => {
        // Link kopyalama
        navigator.clipboard
          .writeText(signalUrl)
          .then(() => showToast('Link kopyalandı!'))
          .catch(() => showToast('Link kopyalanamadı.'));
      },
    });
  }

  /**
   * Ekol başvuru formuna yönlendirme
   */
  function redirectToEkolForm() {
    const formUrl = 'https://forms.gle/qo3M9Cvm58ZFv3Y78';
    window.open(formUrl, '_blank');

    // Analitik izlemesi (opsiyonel)
    if (window.gtag) {
      gtag('event', 'form_open', {
        event_category: 'engagement',
        event_label: 'ekol_basvuru',
      });
    }
  }

  /**
   * Etkinlik takvimi gösterimi
   */
  function showCalendar() {
    // Modal için container oluştur
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    // Modal HTML'i
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

    // Modal'ı erişilebilir hale getir
    const calendarModal = modalContainer.querySelector('.calendar-modal');
    const closeButton = modalContainer.querySelector('.close-calendar');
    const previousFocus = document.activeElement;

    // Modal açıldığında scroll'u engelle
    document.body.style.overflow = 'hidden';

    // Modal içindeki kapatma düğmesine odaklan
    setTimeout(() => closeButton.focus(), 100);

    // Escape tuşuyla kapatma
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    // Modal dışına tıklayarak kapatma
    const handleClickOutside = (e) => {
      if (e.target === calendarModal) {
        closeModal();
      }
    };

    // Modal kapatma fonksiyonu
    function closeModal() {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      calendarModal.removeEventListener('click', handleClickOutside);
      document.body.removeChild(modalContainer);

      // Önceki odaklanılan elemente geri dön
      if (previousFocus) previousFocus.focus();
    }

    // Event listeners ekle
    document.addEventListener('keydown', handleKeyDown);
    calendarModal.addEventListener('click', handleClickOutside);
    closeButton.addEventListener('click', closeModal);

    // Modal fadeIn animasyonu
    setTimeout(() => {
      calendarModal.classList.add('show');
    }, 10);

    // Takvimi oluştur
    generateCalendar(modalContainer.querySelector('#calendar-container'));
  }

  /**
   * Takvim içeriğini oluşturma
   * @param {HTMLElement} container - Takvim container'ı
   */
  function generateCalendar(container) {
    if (!container) return;

    // Yükleme göstergesini kaldır
    setTimeout(() => {
      container.querySelector('.calendar-loading')?.remove();

      // Mevcut ay ve yıl
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Takvim verileri (gerçek verilerle değiştirilmeli)
      const events = {
        // Format: 'YYYY-MM-DD': [{ title: 'Event name', time: '14:00', type: 'workshop|meeting|event' }]
      };

      // Takvim kontrollerini oluştur
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

      // Takvim grid'ini oluştur
      const calendarGrid = document.createElement('div');
      calendarGrid.className = 'calendar-grid';

      container.appendChild(calendarControls);
      container.appendChild(calendarGrid);

      // Takvimi oluşturan iç fonksiyon
      let displayMonth = currentMonth;
      let displayYear = currentYear;

      function renderCalendar() {
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

        // Ayın ilk ve son günü
        const firstDay = new Date(displayYear, displayMonth, 1);
        const lastDay = new Date(displayYear, displayMonth + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Ayın ilk gününün haftanın hangi günü olduğu (0-6)
        let firstDayOfWeek = firstDay.getDay();
        // Pazar=0 yerine Pazartesi=0 sistemine çevir
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        // Başlığı güncelle
        const monthTitle = container.querySelector('.current-month');
        if (monthTitle) {
          monthTitle.textContent = `${monthNames[displayMonth]} ${displayYear}`;
        }

        // Grid içeriğini oluştur
        calendarGrid.innerHTML = '';

        // Gün isimleri
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        dayNames.forEach((day) => {
          const dayHeader = document.createElement('div');
          dayHeader.className = 'day-header';
          dayHeader.textContent = day;
          calendarGrid.appendChild(dayHeader);
        });

        // Boş günler (ayın başındaki)
        for (let i = 0; i < firstDayOfWeek; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          calendarGrid.appendChild(emptyDay);
        }

        // Ayın günleri
        for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement('div');
          dayCell.className = 'calendar-day';

          // Bugün mü?
          if (displayMonth === currentMonth && displayYear === currentYear && day === now.getDate()) {
            dayCell.classList.add('today');
          }

          // Gün numarası
          const dayNumber = document.createElement('div');
          dayNumber.className = 'day-number';
          dayNumber.textContent = day;
          dayCell.appendChild(dayNumber);

          // Bu güne ait etkinlikler var mı?
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

      // İlk render
      renderCalendar();

      // Önceki/sonraki ay butonları
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

      // Etkinlik filtreleri
      const filters = container.querySelectorAll('.calendar-filters input');
      filters.forEach((filter) => {
        filter.addEventListener('change', () => {
          const checkedTypes = Array.from(filters)
            .filter((f) => f.checked)
            .map((f) => f.value);

          const eventElements = container.querySelectorAll('.event');
          eventElements.forEach((eventEl) => {
            // Her bir etkinlik tipini kontrol et
            for (const type of checkedTypes) {
              if (eventEl.classList.contains(type)) {
                eventEl.style.display = 'flex';
                return;
              }
            }
            eventEl.style.display = 'none';
          });
        });
      });
    }, 500); // Yükleniyor efekti için kısa gecikme
  }
  /**
   * Dialog gösterme yardımcı fonksiyonu
   * @param {Object} options - Dialog seçenekleri
   */
  function showLinkDialog(options) {
    const { title, message, primaryLabel, secondaryLabel, onPrimary, onSecondary } = options;

    // Dialog HTML'i
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

    // Dialog gösterim animasyonu
    setTimeout(() => dialog.classList.add('show'), 10);

    // Event listeners
    const closeBtn = dialog.querySelector('.dialog-close');
    const primaryBtn = dialog.querySelector('.btn-primary');
    const secondaryBtn = dialog.querySelector('.btn-secondary');

    // Kapama fonksiyonu
    function closeDialog() {
      dialog.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(dialog);
        document.body.classList.remove('dialog-open');
      }, 300);
    }

    // Buton işlevleri
    closeBtn.addEventListener('click', closeDialog);
    primaryBtn.addEventListener('click', () => {
      if (onPrimary) onPrimary();
      closeDialog();
    });
    secondaryBtn.addEventListener('click', () => {
      if (onSecondary) onSecondary();
      closeDialog();
    });

    // ESC tuşuyla kapatma
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', handler);
      }
    });

    // Dialog dışına tıklayarak kapatma
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });
  }

  /**
   * Toast mesajı gösterme
   * @param {string} message - Gösterilecek mesaj
   * @param {number} duration - Gösterim süresi (ms)
   */
  function showToast(message, duration = 3000) {
    // Önceki toast varsa kaldır
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    // Yeni toast oluştur
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');

    document.body.appendChild(toast);

    // Gösterme animasyonu
    setTimeout(() => toast.classList.add('show'), 10);

    // Otomatik kapanma
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // Sayfa yüklendiğinde tüm işlemleri başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Lazy load görseller
      initLazyImages();
      // Diğer başlangıç işlemleri buraya eklenebilir
    });
  } else {
    // Sayfa zaten yüklenmişse hemen başlat
    initLazyImages();
  }

  /**
   * Lazy load görsel optimizasyonu
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

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Intersection Observer desteklenmiyor, fallback
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }}

  function handleHeaderScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    // Sayfanın en üstündeyse
    if (currentScrollTop <= 10) {
      header.classList.remove('scrolled-down', 'scrolled-up');
      header.classList.add('at-top');
    } 
    // Diğer tüm scroll pozisyonlarında - her zaman görünür
    else {
      header.classList.remove('scrolled-down', 'at-top');
      header.classList.add('scrolled-up');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Tüm info panel'leri al
    const infoPanels = document.querySelectorAll('.info-panel');
    
    // Kapatma fonksiyonu için event listener ekleme
    function addCloseButton() {
        infoPanels.forEach(panel => {
            // Eğer zaten kapatma butonu yoksa ekle
            if (!panel.querySelector('.close-btn')) {
                const closeBtn = document.createElement('div');
                closeBtn.className = 'close-btn';
                closeBtn.addEventListener('click', function() {
                    panel.style.display = 'none';
                });
                panel.appendChild(closeBtn);
            }
        });
    }
    
    // Kapatma butonlarını ekle
    addCloseButton();
});

// Bilgi panelini gösterme fonksiyonu
function showInfo(panelId) {
    // Önce tüm panelleri gizle
    const allPanels = document.querySelectorAll('.info-panel');
    allPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // İlgili paneli göster
    const selectedPanel = document.getElementById('info-' + panelId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
    }
    
    // Aktif seviye görsel efekti
    const allLevels = document.querySelectorAll('.level');
    allLevels.forEach(level => {
        level.classList.remove('active');
    });
    
    // Tıklanan seviyeyi aktif olarak işaretle
    const clickedLevel = document.querySelector(`[onclick="showInfo('${panelId}')"]`);
    if (clickedLevel) {
        clickedLevel.classList.add('active');
    }
    
    // Animasyonlu geçiş için scroll işlemi
    selectedPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showAlert() {
  const alertBox = document.getElementById('customAlert');
  alertBox.style.display = 'block';

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 4000); // 4 saniye sonra otomatik gizle
}

function hideAlert() {
  document.getElementById('customAlert').style.display = 'none';
}

const scrollBtn = document.getElementById('scrollBtn');

// Import Howler.js library for audio
// Note: This should be added in the HTML file, not loaded in the array
// <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>

// Music symbols
const musicSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];

// Show/hide button when page is scrolled
window.addEventListener('scroll', function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "flex";
    } else {
        scrollBtn.style.display = "none";
    }
});

// Play music animation and scroll to top when button is clicked
scrollBtn.addEventListener('click', function(e) {
    // Animation effect
    playMusicAnimation(e);
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Optional: if you still want sound effects, uncomment this
    // playSimpleTones();
});

// Create music note animation
function playMusicAnimation(e) {
    // Get the button's position for better placement
    const rect = scrollBtn.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Create 5 music notes around the button
    for (let i = 0; i < 5; i++) {
        const musicNote = document.createElement('div');
        musicNote.className = 'music-animation';
        musicNote.textContent = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
        
        // Position notes around the button
        const angle = Math.random() * Math.PI * 2;
        const distance = 40; // Increased distance for better visibility
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        musicNote.style.position = 'fixed';
        musicNote.style.left = (buttonCenterX + x) + 'px';
        musicNote.style.top = (buttonCenterY + y) + 'px';
        musicNote.style.fontSize = '24px';
        musicNote.style.color = '#007bff';
        musicNote.style.zIndex = '9999';
        musicNote.style.pointerEvents = 'none';
        musicNote.style.animation = 'float-up 2s ease-out forwards';
        
        document.body.appendChild(musicNote);
        
        // Remove note after animation
        setTimeout(() => {
            if (musicNote.parentNode) {
                document.body.removeChild(musicNote);
            }
        }, 2000);
    }
}

// Simple tones without requiring external libraries
function playSimpleTones() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Simple ascending scale
        const notes = [
            { frequency: 440, duration: 0.1 }, // A4
            { frequency: 494, duration: 0.1 }, // B4
            { frequency: 523, duration: 0.1 }, // C5
            { frequency: 587, duration: 0.1 }, // D5
            { frequency: 659, duration: 0.1 }  // E5
        ];
        
        let time = audioContext.currentTime;
        
        notes.forEach(note => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = note.frequency;
            
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.2, time + 0.01); // Lower volume
            gainNode.gain.linearRampToValueAtTime(0, time + note.duration);
            
            oscillator.start(time);
            oscillator.stop(time + note.duration);
            
            time += note.duration;
        });
    } catch (e) {
        console.log("Audio playback failed:", e);
    }
}

// Hide button initially
scrollBtn.style.display = "none";

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
@keyframes float-up {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(0, -100px) scale(0.5);
        opacity: 0;
    }
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
document.head.appendChild(style);// Mobil menü toggle için
document.querySelector('.menu-toggle').addEventListener('click', function() {
  this.classList.toggle('active');
  document.querySelector('.main-nav').classList.toggle('active');
  document.querySelector('.menu-overlay').classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Overlay'e tıklayarak menüyü kapatma
document.querySelector('.menu-overlay').addEventListener('click', function() {
  document.querySelector('.menu-toggle').classList.remove('active');
  document.querySelector('.main-nav').classList.remove('active');
  this.classList.remove('active');
  document.body.classList.remove('menu-open');
});

// Dropdown menüler için mobil dokunma desteği
document.querySelectorAll('.has-dropdown > a').forEach(item => {
  item.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      this.setAttribute('aria-expanded', !isExpanded);
      dropdown.style.maxHeight = isExpanded ? '0' : dropdown.scrollHeight + 'px';
      dropdown.style.padding = isExpanded ? '0' : '0.6rem 0';
    }
  });
});

// Mobilde smooth scroll performans iyileştirmesi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const dropdownToggles = document.querySelectorAll('.has-dropdown');

  // Hamburger menü
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('active'));
    document.body.classList.toggle('menu-open');
    if (mainNav.classList.contains('active')) {
      mainNav.querySelector('a').focus(); // İlk bağlantıya odaklan
    }
  });

  // Dropdown menüler
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = toggle.classList.contains('active');
      dropdownToggles.forEach(item => {
        item.classList.remove('active');
        item.querySelector('a').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        toggle.classList.add('active');
        toggle.querySelector('a').setAttribute('aria-expanded', 'true');
      }
    });

    // Klavye desteği
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });

  // Overlay ile kapatma
  menuOverlay.addEventListener('click', () => {
    mainNav.classList.remove('active');
    menuOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    dropdownToggles.forEach(toggle => {
      toggle.classList.remove('active');
      toggle.querySelector('a').setAttribute('aria-expanded', 'false');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const logoLink = document.querySelector('.logo');
  const targetSection = document.querySelector('#anasayfa');

  if (logoLink && targetSection) {
    logoLink.addEventListener('click', (event) => {
      event.preventDefault(); // Varsayılan bağlantı davranışını engelle
      targetSection.scrollIntoView({
        behavior: 'smooth', // Yumuşak kaydırma
        block: 'start' // Bölümün üst kısmı görünür
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollIndicator = document.querySelector('.scroll-indicator-container');
  const heroSection = document.getElementById('anasayfa');
  const nextSection = heroSection.nextElementSibling;

  if (scrollIndicator && nextSection) {
    scrollIndicator.addEventListener('click', () => {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
});