# Correção pontual — portfólio lado a lado e favicon

Em telas a partir de 821 px, o portfólio volta a mostrar a cena da janela e o texto em duas colunas. A regra legada em `@media(max-width:1100px)` empilhava os elementos em notebooks e era a causa do problema. Em telas de até 820 px, o layout continua empilhado.

Adicionado favicon SVG em `site/favicon.svg` com a estrela de quatro pontas da marca sobre o fundo verde-oliva. `index.html` referencia o ícone explicitamente.

Não foram alterados o carrossel, a estrela móvel, o vídeo do hero, as categorias, a galeria Studio, nem as demais seções.

Backup: `backup/antes-ajuste-grid-favicon-2026-11-07`.
