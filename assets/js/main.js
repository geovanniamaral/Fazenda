/**
 * Fazenda Rio Acima - Scripts Principais
 * Interatividade, Galeria, Simulador de Eventos e Integração com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contatos e reservas: preencha somente quando o número oficial existir.
  const WHATSAPP_NUMBER = '';
  const AIRBNB_URL = 'https://www.airbnb.com.br/rooms/1753655522855520461';
  const photoCatalog = window.FAZENDA_PHOTOS || {};

  const photoLabel = (path) => {
    const rawFilename = path.split('/').pop();
    let filename = rawFilename;
    try {
      filename = decodeURIComponent(rawFilename);
    } catch (_) {
      // Mantém o nome original quando ele contém um caractere % isolado.
    }
    filename = filename.replace(/\.[^.]+$/, '');
    return filename
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);

  const featuredFirst = (photos) => {
    const featuredIndex = photos.findIndex(path => /fachada|principal|capa|vista/i.test(path));
    if (featuredIndex <= 0) return photos;
    return [photos[featuredIndex], ...photos.slice(0, featuredIndex), ...photos.slice(featuredIndex + 1)];
  };

  const photosFor = (category) => featuredFirst([...(photoCatalog[category] || [])]);

  // As galerias são montadas a partir das pastas catalogadas na publicação.
  const heroPhoto = photosFor('hero')[0];
  const hero = document.querySelector('.hero');
  if (hero && heroPhoto) {
    hero.style.backgroundImage = `linear-gradient(180deg, rgba(15, 31, 20, 0.7) 0%, rgba(28, 51, 34, 0.88) 100%), url('${heroPhoto}')`;
  }

  const mainChaleImg = document.getElementById('chale-main-image');
  const chalePhotos = photosFor('chales');
  const chaleThumbs = document.querySelector('[data-photo-gallery="chales"]');
  if (mainChaleImg && chalePhotos.length) {
    mainChaleImg.src = chalePhotos[0];
    mainChaleImg.alt = `${photoLabel(chalePhotos[0])} — chalé da Fazenda Rio Acima`;
  }
  if (chaleThumbs && chalePhotos.length) {
    chaleThumbs.innerHTML = chalePhotos.map((path, index) =>
      `<img src="${escapeHtml(path)}" alt="${escapeHtml(photoLabel(path))} — chalé" class="chale-thumb${index === 0 ? ' active' : ''}" loading="lazy" decoding="async" />`
    ).join('');
  }

  document.querySelectorAll('[data-photo-featured]').forEach(image => {
    const photos = photosFor(image.dataset.photoFeatured);
    if (photos.length) {
      image.src = photos[0];
      image.alt = `${photoLabel(photos[0])} — Fazenda Rio Acima`;
    }
  });

  document.querySelectorAll('[data-photo-gallery]').forEach(container => {
    const category = container.dataset.photoGallery;
    if (category === 'chales') return;

    const photos = category === 'todas'
      ? [...new Set(['hero', 'chales', 'espaco-gastronomico', 'eventos', 'baias', 'paisagens'].flatMap(photosFor))]
      : photosFor(category);
    if (!photos.length) return;

    if (category === 'todas') {
      container.innerHTML = photos.map(path => `
        <div class="gallery-item">
          <img src="${escapeHtml(path)}" alt="${escapeHtml(photoLabel(path))} — Fazenda Rio Acima" loading="lazy" decoding="async" />
          <div class="gallery-overlay"><span>${escapeHtml(photoLabel(path))}</span></div>
        </div>`).join('');
    } else if (category === 'baias') {
      container.innerHTML = photos.map(path =>
        `<img src="${escapeHtml(path)}" alt="${escapeHtml(photoLabel(path))} — estrutura para cavalos" loading="lazy" decoding="async" />`
      ).join('');
    } else {
      container.innerHTML = photos.map(path =>
        `<img src="${escapeHtml(path)}" alt="${escapeHtml(photoLabel(path))} — Fazenda Rio Acima" loading="lazy" decoding="async" />`
      ).join('');
    }
  });

  // 1. Header com sombra e blur ao rolar a página
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Menu Mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Fechar ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
      });
    });
  }

  // 3. Galeria de Fotos do Chalé (Troca de Thumbnails)
  const thumbs = document.querySelectorAll('.chale-thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainChaleImg) {
        mainChaleImg.src = thumb.src;
        mainChaleImg.alt = thumb.alt;
      }
    });
  });

  // 4. Lightbox Modal para Galeria Geral
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.querySelector('.modal-close');
  const galleryItems = document.querySelectorAll('.gallery-item img, .chale-main-img, .restaurant-img-main, .section-photo-strip img, .baias-img-grid img');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 5. Formulário / Simulador de Casamentos & Eventos
  const eventForm = document.getElementById('event-simulator-form');
  if (eventForm) {
    const eventTypeControl = document.getElementById('event-type');
    const submitButton = document.getElementById('event-submit-button');
    const quoteFields = document.querySelectorAll('.event-quote-field');

    const updateEventForm = () => {
      const isAirbnb = eventTypeControl.value === 'Airbnb';
      quoteFields.forEach(field => field.classList.toggle('is-hidden', isAirbnb));

      submitButton.classList.toggle('btn-airbnb', isAirbnb);
      submitButton.classList.toggle('btn-whatsapp', !isAirbnb);
      submitButton.disabled = !isAirbnb && !WHATSAPP_NUMBER;
      submitButton.innerHTML = isAirbnb
        ? '<i class="fa-brands fa-airbnb"></i> Ver disponibilidade no Airbnb'
        : '<i class="fa-brands fa-whatsapp"></i> WhatsApp em breve';
    };

    eventTypeControl.addEventListener('change', updateEventForm);
    updateEventForm();

    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventType = document.getElementById('event-type').value;

      if (eventType === 'Airbnb') {
        window.open(AIRBNB_URL, '_blank', 'noopener,noreferrer');
        return;
      }

      if (!WHATSAPP_NUMBER) {
        window.alert('O atendimento pelo WhatsApp será ativado assim que o número oficial estiver disponível.');
        return;
      }

      const guests = document.getElementById('event-guests').value;
      const eventDate = document.getElementById('event-date').value;
      const notes = document.getElementById('event-notes').value;

      const message = `Olá! Gostaria de um orçamento para a Fazenda Rio Acima (Pedreira/SP):\n\n` +
                      `📌 *Tipo de Evento:* ${eventType}\n` +
                      `👥 *Estimativa de Convidados:* ${guests}\n` +
                      `📅 *Data Pretendida:* ${eventDate || 'A definir'}\n` +
                      (notes ? `💬 *Observações:* ${notes}\n` : '') +
                      `\nPoderiam me enviar mais detalhes e disponibilidade?`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    });
  }

  // 6. Integração pronta para ser ativada quando houver número oficial.
  window.sendWhatsApp = function(topic) {
    if (!WHATSAPP_NUMBER) {
      window.alert('O atendimento pelo WhatsApp será ativado assim que o número oficial estiver disponível.');
      return;
    }

    let text = "Olá! Gostaria de mais informações sobre a Fazenda Rio Acima.";
    if (topic === 'chale') {
      text = "Olá! Vi a Casa/Chalé no site e gostaria de saber sobre disponibilidade e reserva para me hospedar na Fazenda Rio Acima.";
    } else if (topic === 'restaurante') {
      text = "Olá! Gostaria de saber mais sobre a locação do Espaço Gastronômico/Salão de Festas da Fazenda Rio Acima.";
    } else if (topic === 'casamento') {
      text = "Olá! Gostaria de agendar uma visita e solicitar orçamento para Casamento/Evento na Fazenda Rio Acima.";
    } else if (topic === 'baias') {
      text = "Olá! Tenho interesse no Aluguel de Baias / Hospedagem Equina na Fazenda Rio Acima.";
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };
});
