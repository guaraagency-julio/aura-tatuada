# Aura Tatuada — Sistema de design / Impeccable 4.8

**Modo:** Experience + Persuade (portfólio de artista que ajuda o visitante a decidir entrar em contato).

## Direção
- Atmosfera: verde-oliva / creme / luz natural / plantas / madeira / blackwork.
- Fonte de verdade: fotografias e marca impressa do estúdio, enviadas no briefing. Evitar estética genérica de estúdio de tatuagem (neon/caveira).
- Marca: `aura.` é uma reconstrução textual temporária; o logotipo original é o necessário para fidelidade tipográfica.
- A franja verde e creme personifica Camila. Ela permanece decorativa sem encobrir controles.
- A estrela desloca-se entre seções em trajetórias curtas acionadas pelo scroll, mantendo-se fora da ordem de foco e sem interromper ações.
- O principal gesto da galeria é o deslize horizontal; o deslize vertical continua rolando a página.

## Tokens
- `--olive-900:#292d1c` | `--olive-800:#3b422d` | `--olive-700:#535c42`.
- `--paper:#eee7d9` | `--cream:#e8ddc9` | `--sand:#c8b99f`.
- Títulos editoriais: Cormorant Garamond / Georgia; corpo: DM Sans; marca: Manrope (substituir pelo SVG original).
- Container: até 1180px. Breakpoints por conteúdo: 1100 / 820 / 560 / 370.
- Movimento: transform e opacity via um `requestAnimationFrame`; reduzido respeita `prefers-reduced-motion`.

## Verificações
- Chromium headless com `set_content` e assets embutidos em `data:` por bloqueio de navegação local da sandbox.
- Viewports 1440×900, 820×1180, 390×844, 320×700.
- Sem overflow horizontal, sem erros JS, menu e controle de galeria funcionam, preferências de movimento reduzido ocultam estrela. As imagens reais renderizam com scroll normal; screenshot de página completa do Chromium pode omitir imagens fora da viewport enquanto não rasterizadas.
- **Pendente:** inspeção visual em dispositivos físicos, testes touch sintetizados e Lighthouse após deploy de preview.
