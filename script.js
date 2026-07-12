/* script.js - Interactive Functions for CP Studio Branding Portal */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference, otherwise use light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  });
  
  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'ri-sun-line';
    } else {
      themeIcon.className = 'ri-moon-line';
    }
  }

  // 2. Sticky Header & Active Scroll State
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    // Header class on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active navigation link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id') || '';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // 3. Color Palette Clipboard & Interaction
  const colorCards = document.querySelectorAll('.color-card');
  
  colorCards.forEach(card => {
    const copyBtn = card.querySelector('.color-card-copy-btn');
    const hexCode = card.getAttribute('data-color');
    
    // Copy on card click or button click
    const copyAction = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(hexCode).then(() => {
        showToast(`Color ${hexCode} copiado al portapapeles!`);
        
        // Add temporary animation class
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
      });
    };
    
    card.addEventListener('click', copyAction);
    if (copyBtn) {
      copyBtn.addEventListener('click', copyAction);
    }
  });

  // 4. Typography Live Sandbox
  const sandboxInput = document.getElementById('sandbox-input');
  const headingRender = document.getElementById('heading-render');
  const bodyRender = document.getElementById('body-render');
  
  if (sandboxInput) {
    sandboxInput.addEventListener('input', (e) => {
      const text = e.target.value.trim();
      if (text.length > 0) {
        headingRender.textContent = text;
        bodyRender.textContent = `A través de "${text}", CP Studio redefine la forma en que los servicios de tecnología se integran con las personas. Proporcionamos una arquitectura de software limpia y transparente combinada con la solidez de una ingeniería moderna.`;
      } else {
        headingRender.textContent = 'Ingeniería con Enfoque Humano';
        bodyRender.textContent = 'Combinamos la precisión técnica del desarrollo de software con la calidez del diseño humano. Creamos soluciones robustas para consultoría de servicios TI.';
      }
    });
  }

  // 5. Logo Background Tester
  const logoDisplayCard = document.getElementById('logo-display-card');
  const bgSwitches = document.querySelectorAll('.bg-switch');
  
  bgSwitches.forEach(sw => {
    sw.addEventListener('click', () => {
      bgSwitches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      
      const bgColor = sw.getAttribute('data-bg');
      logoDisplayCard.style.backgroundColor = bgColor;
      
      // Update typography and borders inside the container based on background contrast
      if (bgColor === '#251f1c') {
        logoDisplayCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        logoDisplayCard.style.borderColor = '';
      }
      
      showToast(`Fondo de logo cambiado`);
    });
  });

  // 6. Application Tabs Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
      
      showToast(`Vista de aplicación: ${btn.textContent.trim()}`);
    });
  });

  // 7. Business Card Flip
  const bizCardInner = document.getElementById('biz-card-inner');
  if (bizCardInner) {
    bizCardInner.addEventListener('click', () => {
      bizCardInner.classList.toggle('flipped');
    });
  }

  // 8. Copy HTML Email Signature
  const copySigBtn = document.getElementById('copy-signature-btn');
  const signaturePreview = document.getElementById('signature-preview');
  
  if (copySigBtn && signaturePreview) {
    copySigBtn.addEventListener('click', () => {
      // Get HTML inside signature preview
      const signatureHtml = signaturePreview.innerHTML;
      
      // Try copy as rich text HTML to clipboard
      try {
        const blob = new Blob([signatureHtml], { type: 'text/html' });
        const textBlob = new Blob([signaturePreview.textContent], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blob,
          'text/plain': textBlob
        });
        
        navigator.clipboard.write([item]).then(() => {
          showToast('Firma HTML copiada como texto enriquecido para Gmail/Outlook!');
        });
      } catch (err) {
        // Fallback to text copy
        navigator.clipboard.writeText(signatureHtml).then(() => {
          showToast('Código HTML de la firma copiado!');
        });
      }
    });
  }

  // 9. Export Assets (CSS Tokens)
  const copyTokensBtn = document.getElementById('copy-tokens-btn');
  const cssTokensCode = document.getElementById('css-tokens-code');
  
  if (copyTokensBtn && cssTokensCode) {
    copyTokensBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(cssTokensCode.textContent).then(() => {
        showToast('Variables CSS de la marca copiadas con éxito!');
      });
    });
  }

  // Toast Notification Utility
  const toast = document.getElementById('toast');
  let toastTimeout;
  
  function showToast(message) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    toastText.textContent = message;
    
    clearTimeout(toastTimeout);
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ==========================================================================
  // CP Studio - Commercial Portfolio Website Logic
  // ==========================================================================

  // 10. Portfolio Grid Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  if (filterBtns.length > 0 && portfolioCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Button Class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        
        // Show/Hide Portfolio Cards with smooth scale transitions
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300); // matches var(--transition-normal)
          }
        });
        
        showToast(`Filtrado por: ${btn.textContent.trim()}`);
      });
    });
  }

  // 11. Project Modal Triggers (View Cases Details)
  const viewCaseBtns = document.querySelectorAll('.portfolio-btn, .portfolio-card-clickable');
  const projectModals = document.querySelectorAll('.project-modal');
  const modalCloseBtns = document.querySelectorAll('.project-modal-close');
  
  if (viewCaseBtns.length > 0 && projectModals.length > 0) {
    // Open Modal
    viewCaseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = btn.getAttribute('data-project');
        const modal = document.getElementById(targetId);
        
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scroll
          showToast(`Abriendo detalles del proyecto...`);
        }
      });
    });
    
    // Close Modal via Button
    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.project-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Restore scroll
        }
      });
    });
    
    // Close Modal via Outside Clicks
    projectModals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Close Modal via Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        projectModals.forEach(modal => {
          if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      }
    });
  }

  // 12. Contact Form Interactive Handler
  const contactForm = document.getElementById('consult-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const formEndpoint = 'https://formsubmit.co/ajax/carmen.perdomo@cpstudio.cl';
      
      // Visual Submitting State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando...';
      submitBtn.style.opacity = '0.8';
      
      try {
        const serviceSelect = document.getElementById('service');
        const selectedService = serviceSelect?.selectedOptions?.[0]?.text || 'Sin especificar';
        const formData = new FormData(contactForm);
        formData.set('_subject', `Nuevo contacto CP Studio - ${selectedService}`);
        formData.set('_template', 'table');
        formData.set('_captcha', 'false');
        formData.set('_next', 'https://cpstudio.cl');

        const response = await fetch(formEndpoint, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('No se pudo enviar el mensaje');
        }

        showToast('¡Mensaje enviado con éxito! Te responderemos a la brevedad.');
        contactForm.reset();
        createSparkles(submitBtn);
      } catch (error) {
        console.error('Contact form submission failed:', error);
        showToast('No se pudo enviar el mensaje. Por favor, escríbenos directamente a carmen.perdomo@cpstudio.cl');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '';
      }
    });
  }
  
  function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.width = '8px';
      sparkle.style.height = '8px';
      sparkle.style.backgroundColor = 'var(--color-primary)';
      sparkle.style.borderRadius = '50%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';
      
      // Spread coordinates
      const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 200;
      const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 80;
      
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.opacity = '1';
      sparkle.style.transform = 'scale(1)';
      sparkle.style.transition = 'all 1s ease-out';
      
      document.body.appendChild(sparkle);
      
      // animate
      setTimeout(() => {
        sparkle.style.opacity = '0';
        sparkle.style.transform = 'translateY(-30px) scale(0.2)';
      }, 50);
      
      setTimeout(() => {
        sparkle.remove();
      }, 1050);
    }
  }
});
