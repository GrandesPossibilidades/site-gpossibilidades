/* =========================================================
   GRANDES POSSIBILIDADES — scripts do site
   ========================================================= */

var CONFIG = {
  /* Número de WhatsApp (somente dígitos, com DDI e DDD). */
  whatsapp: '5521976810029',

  /* E-mail que recebe os formulários no modo de reserva. */
  email: 'comercial@gpossibilidades.com.br',

  /* Endpoint do formulário.
     Deixe vazio ('') para o site enviar as mensagens pelo WhatsApp.
     Para receber por e-mail, crie um formulário grátis em https://formspree.io
     e cole aqui o endereço gerado, por exemplo:
     formEndpoint: 'https://formspree.io/f/xxxxxxxx'                        */
  formEndpoint: ''
};

(function () {
  'use strict';

  /* ---------------------------------------------------
     Menu de navegação (mobile)
     --------------------------------------------------- */
  function iniciarMenu() {
    var botao = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!botao || !nav) return;

    botao.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    /* No mobile, o item "SERVIÇOS" abre o submenu em vez de navegar. */
    nav.querySelectorAll('.tem-submenu > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 900px)').matches) {
          e.preventDefault();
          link.parentElement.classList.toggle('aberto');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('aberto')) return;
      if (nav.contains(e.target) || botao.contains(e.target)) return;
      nav.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) {
        nav.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.focus();
      }
    });
  }

  /* ---------------------------------------------------
     Galeria com lightbox
     --------------------------------------------------- */
  function iniciarGaleria() {
    var itens = Array.prototype.slice.call(document.querySelectorAll('.galeria-item'));
    if (!itens.length) return;

    var caixa = document.createElement('div');
    caixa.className = 'lightbox';
    caixa.hidden = true;
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-label', 'Visualizador de imagens');
    caixa.innerHTML =
      '<button class="lb-fechar" type="button" aria-label="Fechar">&times;</button>' +
      '<button class="lb-anterior" type="button" aria-label="Imagem anterior">&#10094;</button>' +
      '<img alt="">' +
      '<button class="lb-proxima" type="button" aria-label="Próxima imagem">&#10095;</button>' +
      '<p class="lightbox-legenda"></p>';
    document.body.appendChild(caixa);

    var figura = caixa.querySelector('img');
    var legenda = caixa.querySelector('.lightbox-legenda');
    var atual = 0;
    var ultimoFoco = null;

    function mostrar(indice) {
      atual = (indice + itens.length) % itens.length;
      var origem = itens[atual].querySelector('img');
      figura.src = origem.getAttribute('data-grande') || origem.src;
      figura.alt = origem.alt;
      legenda.textContent = origem.alt + '  (' + (atual + 1) + '/' + itens.length + ')';
    }

    function abrir(indice) {
      ultimoFoco = document.activeElement;
      mostrar(indice);
      caixa.hidden = false;
      document.body.style.overflow = 'hidden';
      caixa.querySelector('.lb-fechar').focus();
    }

    function fechar() {
      caixa.hidden = true;
      document.body.style.overflow = '';
      if (ultimoFoco) ultimoFoco.focus();
    }

    itens.forEach(function (item, i) {
      item.addEventListener('click', function () { abrir(i); });
    });

    caixa.querySelector('.lb-fechar').addEventListener('click', fechar);
    caixa.querySelector('.lb-anterior').addEventListener('click', function () { mostrar(atual - 1); });
    caixa.querySelector('.lb-proxima').addEventListener('click', function () { mostrar(atual + 1); });
    caixa.addEventListener('click', function (e) { if (e.target === caixa) fechar(); });

    document.addEventListener('keydown', function (e) {
      if (caixa.hidden) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }

  /* ---------------------------------------------------
     Slideshow
     --------------------------------------------------- */
  function iniciarSlideshow() {
    var slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    var slides = Array.prototype.slice.call(slideshow.querySelectorAll('figure'));
    if (slides.length < 2) return;

    var contador = slideshow.querySelector('.slideshow-contador');
    var atual = 0;
    var timer = null;

    function ir(indice) {
      slides[atual].classList.remove('ativo');
      atual = (indice + slides.length) % slides.length;
      slides[atual].classList.add('ativo');
      /* carrega a próxima com antecedência */
      var proxima = slides[(atual + 1) % slides.length].querySelector('img');
      if (proxima && proxima.loading === 'lazy') proxima.loading = 'eager';
      if (contador) contador.textContent = (atual + 1) + '/' + slides.length;
    }

    function reiniciarTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () { ir(atual + 1); }, 5000);
    }

    slideshow.querySelector('.anterior').addEventListener('click', function () { ir(atual - 1); reiniciarTimer(); });
    slideshow.querySelector('.proxima').addEventListener('click', function () { ir(atual + 1); reiniciarTimer(); });

    slideshow.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    slideshow.addEventListener('mouseleave', reiniciarTimer);

    /* arrastar com o dedo */
    var inicioX = null;
    slideshow.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
    slideshow.addEventListener('touchend', function (e) {
      if (inicioX === null) return;
      var delta = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(delta) > 45) { ir(delta < 0 ? atual + 1 : atual - 1); reiniciarTimer(); }
      inicioX = null;
    });

    ir(0);
    reiniciarTimer();
  }

  /* ---------------------------------------------------
     Formulários
     --------------------------------------------------- */
  function iniciarFormularios() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var status = form.querySelector('.form-status');
      var botao = form.querySelector('button[type="submit"]');

      function aviso(texto) {
        if (!status) return;
        status.textContent = texto;
        status.hidden = false;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var dados = new FormData(form);
        var campos = [];
        dados.forEach(function (valor, chave) {
          if (String(valor).trim()) campos.push(chave + ': ' + valor);
        });

        if (!campos.length) {
          aviso('Preencha os campos antes de enviar.');
          return;
        }

        if (CONFIG.formEndpoint) {
          if (botao) { botao.disabled = true; botao.textContent = 'Enviando...'; }
          fetch(CONFIG.formEndpoint, {
            method: 'POST',
            body: dados,
            headers: { Accept: 'application/json' }
          }).then(function (resposta) {
            if (!resposta.ok) throw new Error('falha');
            form.reset();
            aviso('Obrigado pelo envio!');
          }).catch(function () {
            aviso('Não conseguimos enviar agora. Fale com a gente pelo WhatsApp: ' + formatarTelefone());
          }).then(function () {
            if (botao) { botao.disabled = false; botao.textContent = 'Enviar'; }
          });
          return;
        }

        /* Sem endpoint configurado: abre o WhatsApp com a mensagem pronta. */
        var texto = 'Olá! Vim pelo site.\n\n' + campos.join('\n');
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
        aviso('Obrigado pelo envio! Abrimos o WhatsApp para concluir.');
      });
    });
  }

  function formatarTelefone() {
    var n = CONFIG.whatsapp;
    return '+' + n.slice(0, 2) + ' ' + n.slice(2, 4) + ' ' + n.slice(4, 9) + '-' + n.slice(9);
  }

  /* ---------------------------------------------------
     Ano do rodapé
     --------------------------------------------------- */
  function atualizarAno() {
    var alvo = document.querySelectorAll('[data-ano]');
    var ano = new Date().getFullYear();
    alvo.forEach(function (el) { el.textContent = ano; });
  }

  /* --------------------------------------------------- */
  function iniciar() {
    iniciarMenu();
    iniciarGaleria();
    iniciarSlideshow();
    iniciarFormularios();
    atualizarAno();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
