# Site Grandes Possibilidades

Site institucional da **Grandes Possibilidades** — gráfica no Rio de Janeiro.
Reconstrução do site que estava no Wix, agora em HTML/CSS/JS estático, sem
mensalidade e hospedado na Vercel.

---

## Como funciona

Não há build, framework nem dependências. São arquivos estáticos: a Vercel
publica a pasta como está. Para editar um texto, basta abrir o `.html`
correspondente e alterar.

```
index.html               Página inicial
quem-somos.html          Quem Somos
servicos.html            Serviços (visão geral + parceiros)
impressao-grafica.html   Portfólio de impressos
comunicacao-visual.html  Portfólio de comunicação visual
brindes.html             Portfólio de brindes
supermercados.html       Supermercados (slideshow + formulário)
404.html                 Página de erro

assets/css/style.css     Todo o visual do site
assets/js/main.js        Menu, galeria, slideshow e formulários
assets/img/              61 imagens (baixadas do Wix, já otimizadas)

vercel.json              Redirecionamentos e cache
sitemap.xml, robots.txt  SEO
```

---

## Rodar localmente

Qualquer servidor estático serve. Com Node instalado:

```bash
npx serve .
```

Abra `http://localhost:3000`. (Abrir o arquivo direto pelo Explorer **não**
funciona porque os caminhos são absolutos, começando com `/`.)

---

## Formulários de contato

Hoje os formulários funcionam **pelo WhatsApp**: ao clicar em Enviar, o site
abre a conversa com a mensagem já preenchida. Funciona sem cadastro nenhum.

### Para receber por e-mail

1. Crie um formulário grátis em <https://formspree.io> (plano gratuito
   aceita 50 mensagens por mês).
2. Copie o endereço gerado, algo como `https://formspree.io/f/abcdwxyz`.
3. Abra `assets/js/main.js` e cole na linha `formEndpoint`:

```js
formEndpoint: 'https://formspree.io/f/abcdwxyz'
```

Pronto — as mensagens passam a chegar por e-mail e o WhatsApp continua
disponível como botão flutuante.

### Outros ajustes rápidos

No topo de `assets/js/main.js`:

| Campo          | O que faz                                    |
| -------------- | -------------------------------------------- |
| `whatsapp`     | Número do WhatsApp (só dígitos, com DDI/DDD) |
| `email`        | E-mail comercial exibido no site             |
| `formEndpoint` | Endpoint do formulário (vazio = WhatsApp)    |

---

## Apontar o domínio para a Vercel

Enquanto o domínio `gpossibilidades.com.br` estiver apontando para o Wix, o
site novo fica acessível só pelo endereço `.vercel.app`. Para virar a chave:

1. Na Vercel: **Project → Settings → Domains → Add**, informe
   `gpossibilidades.com.br` e `www.gpossibilidades.com.br`.
2. A Vercel mostra os registros DNS a configurar (normalmente um `A` para o
   domínio raiz e um `CNAME` para o `www`).
3. Configure esses registros onde o domínio foi registrado (Registro.br ou o
   painel de DNS que estiver em uso).
4. Aguarde a propagação (de minutos a algumas horas) e confirme que o site
   novo abre nos dois endereços.
5. **Só então** cancele a assinatura do Wix.

> ⚠️ Não cancele o Wix antes do passo 4. As imagens já estão todas neste
> repositório, então o site não depende mais do Wix — mas o domínio, sim,
> até o DNS ser alterado.

---

## SEO já aplicado

Do guia de melhorias, as tarefas de site (T1 a T7) já estão feitas:

- **T1–T4** — Título SEO, descrição e manchete (H1) de cada página, com os
  textos do guia. As páginas de portfólio ganharam também o parágrafo de
  apresentação.
- **T5** — Botão flutuante de WhatsApp em todas as páginas.
- **T6** — Texto alternativo (ALT) descritivo em **todas** as imagens.
- **T7** — Nenhuma página de loja foi recriada; a loja parada desde 2022
  deixou de existir.

Extras que não estavam no guia:

- Dados estruturados `LocalBusiness` (Schema.org) na página inicial — é o
  que alimenta o painel lateral do Google.
- `sitemap.xml` e `robots.txt`.
- URLs antigas do Wix redirecionadas com 301 (ver `vercel.json`), para não
  perder o histórico que o Google já tem.
- Tags Open Graph — quando alguém compartilha o link no WhatsApp ou no
  Facebook, aparece título, descrição e imagem.
- Site responsivo de verdade (o Wix mantinha uma versão mobile separada).
- Imagens otimizadas: 16,9 MB → 6,1 MB.

**Ainda pendente (fora do site):** as tarefas T8, T9 e T10 do guia, que são
no Google Meu Negócio — categorias, horário, fotos e avaliações.

---

## Manutenção comum

**Trocar uma foto do portfólio:** substitua o arquivo em `assets/img/`
mantendo o mesmo nome, ou edite o `<img src="...">` na página. Lembre de
ajustar o `alt` para descrever a nova imagem.

**Adicionar uma foto à galeria:** copie um bloco `<button class="galeria-item">`
inteiro e troque `src` e `alt`. A galeria e o lightbox se ajustam sozinhos.

**Mudar uma cor:** todas as cores estão no topo do `assets/css/style.css`,
no bloco `:root`.

**Publicar uma alteração:** faça o commit e o push para o GitHub. A Vercel
republica sozinha em cerca de um minuto.
