/* Analítica con consentimiento de cookies (RGPD) — Fadia Garrido
   Google Analytics 4 solo se carga si la persona ACEPTA en el banner. */
(function () {
  var GA_ID = 'G-Z6VQDKP7F1';
  var KEY = 'fg-cookie-consent';

  function loadGA() {
    if (window.__fgGaLoaded) return;
    window.__fgGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    trackWhatsAppClicks();
  }

  /* Contar los clics en cualquier enlace de WhatsApp (evento "clic_whatsapp" en GA4) */
  function trackWhatsAppClicks() {
    if (window.__fgWaTracked) return;
    window.__fgWaTracked = true;
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
      if (!a || !window.gtag) return;
      var boton = a.classList.contains('whatsapp-float')
        ? 'Icono flotante'
        : ((a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'Enlace WhatsApp');
      window.gtag('event', 'clic_whatsapp', {
        boton: boton,
        pagina: location.pathname
      });
    }, true);
  }

  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function removeBanner() {
    var b = document.getElementById('fg-cookie-banner');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    var style = document.createElement('style');
    style.textContent =
      '#fg-cookie-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;max-width:640px;margin:0 auto;' +
      'background:var(--cream,#faf9f7);border:1px solid var(--stone,#e6e1d8);border-radius:14px;' +
      'box-shadow:0 14px 40px rgba(0,0,0,.16);padding:1.15rem 1.3rem;z-index:9999;' +
      "font-family:'Arial',sans-serif;color:var(--ink,#3a3733);font-size:.9rem;line-height:1.55}" +
      '#fg-cookie-banner p{margin:0 0 .9rem}' +
      '#fg-cookie-banner a{color:var(--sage,#7d9b76);text-decoration:underline}' +
      '#fg-cookie-banner .fg-cb-actions{display:flex;gap:.6rem;flex-wrap:wrap}' +
      "#fg-cookie-banner button{font-family:'Arial',sans-serif;font-size:.85rem;font-weight:700;" +
      'border-radius:8px;padding:.6rem 1.15rem;cursor:pointer;border:1px solid var(--sage,#7d9b76)}' +
      '#fg-cookie-banner .fg-accept{background:var(--sage,#7d9b76);color:#fff}' +
      '#fg-cookie-banner .fg-reject{background:transparent;color:var(--ink,#3a3733);border-color:var(--stone,#cfc8bd)}';
    document.head.appendChild(style);

    var div = document.createElement('div');
    div.id = 'fg-cookie-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Aviso de cookies');
    div.innerHTML =
      '<p>Usamos cookies de analítica (Google Analytics) para entender cómo se usa la web y mejorarla. ' +
      '¿Nos das tu permiso? Más información en la <a href="/cookies.html">Política de Cookies</a>.</p>' +
      '<div class="fg-cb-actions">' +
      '<button type="button" class="fg-accept">Aceptar</button>' +
      '<button type="button" class="fg-reject">Rechazar</button>' +
      '</div>';
    document.body.appendChild(div);

    div.querySelector('.fg-accept').addEventListener('click', function () {
      setConsent('accepted'); removeBanner(); loadGA();
    });
    div.querySelector('.fg-reject').addEventListener('click', function () {
      setConsent('rejected'); removeBanner();
    });
  }

  var consent = getConsent();
  if (consent === 'accepted') {
    loadGA();
  } else if (consent === 'rejected') {
    /* sin analítica */
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
