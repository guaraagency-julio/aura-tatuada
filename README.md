# Aura Tatuada Studio

Site institucional autoral para o **Aura Tatuada Studio**, produzido pela Guará Agency.

**Estado:** Etapa 1 — estrutura e layout-base responsivo, pronto para revisão. **Ainda não publicado na Cloudflare.**

## Como visualizar

1. Abra o diretório `site/`.
2. Execute `python -m http.server 8000` dentro dessa pasta (ou use um servidor estático equivalente).
3. Visite `http://localhost:8000`.

A estrutura funciona sem dependências JavaScript. O repositório ainda não contém as fotografias binárias. Para visualizar as fotos reais, extraia o pacote de WebP disponibilizado na conversa na raiz do repositório: os arquivos cairão em `site/assets/`.

## Etapas

1. **Estrutura e linguagem visual:** seções semânticas, CSS responsivo, menu, guia de identidade e posições de fotos/efeitos. **Base entregue.**
2. **Identidade animada:** franja verde/creme, estrela viajante, plantas em parallax, janela/galeria e cadarço.
3. **Aprovação e lançamento:** conteúdo real, mapa e contatos verificados, SEO, desempenho, acessibilidade e Cloudflare.

Consulte `docs/identidade-visual.md` e `docs/etapas.md`.

## Referências externas de interação

- https://vila-capininga.vercel.app/ — elemento gráfico percorrendo o scroll.
- https://antimatter-studio.framer.website/ — folhagens, composição e movimento.

## Antes de publicar

- Obter o logotipo original em vetor para substituir a representação tipográfica provisória.
- Confirmar biografia, WhatsApp, endereço e Instagram.
- Confirmar autorização de uso público das fotografias e tatuagens.
- Sincronizar as imagens otimizadas com o repositório antes do deploy.

Desenvolvimento incremental: alterações visuais devem ser validadas antes de passar para a próxima etapa.
