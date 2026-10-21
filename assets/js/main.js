/* Grandes Possibilidades — menu, galeria e formulário.
   Capítulo 09: três scripts curtos, nada além disso. */

var CONFIG = {
  whatsapp: '5521976810029',
  /* Vazio = o formulário envia pelo WhatsApp.
     Para receber por e-mail, crie um formulário em https://formspree.io
     e cole aqui o endereço gerado. */
  formEndpoint: ''
};

(function () {
  'use strict';

  /* ---- menu no celular ---- */
  var botao = document.querySelector('.menu-abrir');
  var nav = document.querySelector('.nav');
  if (botao && nav) {
    botao.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Fechar' : 'Menu';
      document.body.style.overflow = aberto ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('aberto')) botao.click();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) botao.click();
    });
  }

  /* ---- galeria: amplia com <dialog> nativo ---- */
  var itens = [].slice.call(document.querySelectorAll('.galeria button'));
  if (itens.length && window.HTMLDialogElement) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lupa';
    dlg.innerHTML =
      '<img alt="">' +
      '<div class="lupa-barra">' +
        '<button type="button" data-ir="-1" aria-label="Imagem anterior">&#10094;</button>' +
        '<p class="rotulo rotulo--suave"></p>' +
        '<button type="button" data-ir="1" aria-label="Próxima imagem">&#10095;</button>' +
        '<button type="button" data-fechar aria-label="Fechar">&times;</button>' +
      '</div>';
    document.body.appendChild(dlg);

    var foto = dlg.querySelector('img');
    var legenda = dlg.querySelector('p');
    var atual = 0;

    function mostrar(i) {
      atual = (i + itens.length) % itens.length;
      var o = itens[atual].querySelector('img');
      foto.src = o.getAttribute('data-grande') || o.src;
      foto.alt = o.alt;
      legenda.textContent = o.alt + '  ·  ' + (atual + 1) + '/' + itens.length;
    }
    itens.forEach(function (b, i) {
      b.addEventListener('click', function () { mostrar(i); dlg.showModal(); });
    });
    dlg.addEventListener('click', function (e) {
      var ir = e.target.getAttribute && e.target.getAttribute('data-ir');
      if (ir) mostrar(atual + Number(ir));
      else if (e.target.hasAttribute && e.target.hasAttribute('data-fechar')) dlg.close();
      else if (e.target === dlg) dlg.close();
    });
    document.addEventListener('keydown', function (e) {
      if (!dlg.open) return;
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }

  /* ---- formulário ---- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var estado = form.querySelector('.form-estado');

    function marcarErro(campo, texto) {
      campo.setAttribute('data-erro', '');
      if (!campo.querySelector('.erro')) {
        var p = document.createElement('p');
        p.className = 'erro';
        p.textContent = texto;
        campo.appendChild(p);
      }
    }
    function limparErro(campo) {
      campo.removeAttribute('data-erro');
      var e = campo.querySelector('.erro');
      if (e) e.remove();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valido = true;

      form.querySelectorAll('.campo').forEach(function (campo) {
        var c = campo.querySelector('input, textarea');
        if (!c) return;
        limparErro(campo);
        if (c.required && !c.value.trim()) {
          marcarErro(campo, 'Preencha este campo.');
          valido = false;
        } else if (c.type === 'email' && c.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.value)) {
          marcarErro(campo, 'Falta o domínio. Exemplo: nome@empresa.com.br');
          valido = false;
        }
      });
      if (!valido) { form.querySelector('[data-erro] input, [data-erro] textarea').focus(); return; }

      var dados = new FormData(form);
      var linhas = [];
      dados.forEach(function (v, k) { if (String(v).trim()) linhas.push(k + ': ' + v); });

      function ok(texto) {
        if (!estado) return;
        estado.textContent = texto;
        estado.hidden = false;
      }

      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, { method: 'POST', body: dados, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw 0; form.reset(); ok('Recebemos. Respondemos em até 48 horas.'); })
          .catch(function () { ok('Não conseguimos enviar agora. Fale com a gente pelo WhatsApp.'); });
        return;
      }
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' +
        encodeURIComponent('Olá! Vim pelo site.\n\n' + linhas.join('\n')), '_blank', 'noopener');
      ok('Recebemos. Respondemos em até 48 horas.');
    });
  });

  /* ---- ano do rodapé ---- */
  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
