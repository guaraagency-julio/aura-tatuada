# Aura Tatuada Studio — Iteração de layout (07/11/2026)

Alterações sobre `aura-tatuada-layout-corrigido-final.zip`, com base em três capturas enviadas pelo cliente.

- **Portfólio:** fundo verde-oliva escuro. Foto original da janela inteira, com cards pequenos em profundidade posicionados sobre a fotografia. Navegação por clique no card, quatro indicadores inferiores em formato de pontos/barra e teclado. Retirados números e setas; carrossel com autoplay moderado e respeitando preferência por movimento reduzido.
- **Artista:** tema claro e retrato escuro preservado sem corte/esticamento.
- **Estúdio:** tema escuro e espaçamento reduzido. Substituído o mapa ilustrativo por `iframe` Google Maps com consulta ao endereço fornecido, mais link para abrir rota.
- **CTA:** tema claro, com a fotografia da Camila em frente à marca Aura retirada da antiga área do estúdio e posicionada ao lado da chamada para contato.
- **Rodapé e cabeçalho:** ornamento superior e cadarço de fundo mantidos.
- **Espaçamentos:** reduzidos os paddings verticais das seções; contêineres passam a alinhar seus conteúdos sem grandes vazios.

## Testes locais

- Renderização no Chromium em 1440, 820, 390 e 320 px.
- Sem erros de JavaScript e sem rolagem horizontal nos quatro tamanhos.
- Interações de clique nos indicadores e no card frontal confirmadas.
- Menu móvel abre e fecha; modo de movimento reduzido esconde a estrela móvel.
- **Pendente de verificação externa:** carregamento do Google Maps no navegador do usuário, porque o ambiente de teste bloqueia a navegação de iframe para o domínio Google Maps. O `iframe` permanece real no HTML, sem ilustração alternativa.
- **Pendente:** testes físicos de toque/gestos em iOS/Android e publicação no Cloudflare.