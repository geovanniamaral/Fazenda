/**
 * Fazenda Rio Acima - Scripts Principais
 * Interatividade, Galeria, Simulador de Eventos e Integração com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contatos e reservas: preencha somente quando o número oficial existir.
  const WHATSAPP_NUMBER = '';
  const AIRBNB_URL = 'https://www.airbnb.com.br/rooms/1753655522855520461?unique_share_id=14c888a3-2520-431e-a065-56ece72af80e&viralityEntryPoint=1&s=76';

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
  const mainChaleImg = document.getElementById('chale-main-image');
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
  const galleryItems = document.querySelectorAll('.gallery-item img, .chale-main-img, .restaurant-img-main');

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

  // 5. Botão Flutuante de WhatsApp (Popover)
  const waTrigger = document.querySelector('.whatsapp-trigger-btn');
  const waPopover = document.querySelector('.whatsapp-popover');

  if (waTrigger && waPopover) {
    if (!WHATSAPP_NUMBER) {
      document.querySelector('.floating-whatsapp')?.classList.add('is-hidden');
    }

    waTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      waPopover.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!waPopover.contains(e.target) && !waTrigger.contains(e.target)) {
        waPopover.classList.remove('show');
      }
    });
  }

  // 6. Formulário / Simulador de Casamentos & Eventos
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

  // 7. Disparos Dinâmicos de WhatsApp para outros botões
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
