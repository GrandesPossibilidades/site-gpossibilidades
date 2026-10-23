/* Grandes Possibilidades — menu, galeria, formulário e movimento. */

var CONFIG = {
  whatsapp: '5521976810029',
  /* Chave do Web3Forms. O formulário envia para comercial@gpossibilidades.com.br.
     Vazio = o botão volta a abrir o WhatsApp. */
  web3forms: '000b3480-ad19-4293-ba53-843ecad4bc43'
};

(function () {
  'use strict';

  /* ---- menu no celular ---- */
  var botao = document.querySelector('.menu-abrir');
  var nav = document.querySelector('.nav');
  if (botao && nav) {
    function fechar() {
      nav.classList.remove('aberto');
      botao.textContent = 'Menu';
      botao.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    botao.addEventListener('click', function () {
      if (nav.classList.contains('aberto')) return fechar();
      nav.classList.add('aberto');
      botao.textContent = 'Fechar';
      botao.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('aberto')) fechar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechar(); botao.focus(); }
    });
  }

  /* ---- cabeçalho ganha desfoque ao rolar ---- */
  var topo = document.querySelector('.topo');
  if (topo) {
    addEventListener('scroll', function () {
      topo.classList.toggle('rolou', scrollY > 40);
    }, { passive: true });
  }

  /* ---- seções surgindo ----
     O conteúdo já está visível no HTML. Só escondemos se der para animar,
     e uma rede de segurança revela tudo caso o observador não dispare. */
  var aSurgir = [].slice.call(document.querySelectorAll('.surge'));
  if (aSurgir.length && window.IntersectionObserver && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function revelar(el) { el.classList.remove('oculto'); el.classList.add('visivel'); }

    /* Só escondemos o que já nasce abaixo da dobra. O que o visitante vê ao
       chegar aparece de imediato, sem piscar e sem depender do observador. */
    var alturaTela = window.innerHeight || 0;
    var escondidos = aSurgir.filter(function (el) {
      if (el.getBoundingClientRect().top < alturaTela * 0.9) return false;
      el.classList.add('oculto');
      return true;
    });

    if (escondidos.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { revelar(e.target); io.unobserve(e.target); }
        });
      }, { threshold: .08 });
      escondidos.forEach(function (el) { io.observe(el); });
      /* rede de segurança: nada fica escondido mais de 2 segundos */
      setTimeout(function () { escondidos.forEach(revelar); }, 2000);
    }
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

  /* ---- formulário: envia de verdade, por e-mail ---- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var estado = form.querySelector('.form-estado');
    var botaoEnviar = form.querySelector('button[type="submit"]');

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
    function aviso(texto) {
      if (!estado) return;
      estado.textContent = texto;
      estado.hidden = false;
    }

    form.addEventListener('submit', function (e) {
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
      if (!valido) {
        e.preventDefault();
        form.querySelector('[data-erro] input, [data-erro] textarea').focus();
        return;
      }
      /* sem JavaScript o formulário envia sozinho e cai em /obrigado.
         Com JavaScript, enviamos por fetch para a pessoa não sair da página. */
      if (!window.fetch || !CONFIG.web3forms) return;
      e.preventDefault();
      botaoEnviar.disabled = true;
      var rotuloOriginal = botaoEnviar.textContent;
      botaoEnviar.textContent = 'Enviando...';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.success) throw 0;
          form.reset();
          aviso('Recebemos. Respondemos em até 48 horas.');
        })
        .catch(function () {
          aviso('Não conseguimos enviar agora. Fale com a gente pelo WhatsApp: (21) 97681-0029.');
        })
        .then(function () {
          botaoEnviar.disabled = false;
          botaoEnviar.textContent = rotuloOriginal;
        });
    });
  });

  /* ---- ano do rodapé ---- */
  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
