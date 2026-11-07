# Aura — Studio interativo e relevo em botões

Backup antes deste trabalho: \`backup/antes-estudio-tabs-relevo-botoes-2026-11-07\`.

## Origem do material

Pasta Google Drive: \`AURA TATUADA STUDIO - MATERIAL SITE / studio por dentro\` (11 imagens fornecidas).
Arquivos originais armazenados em \`media-source/studio/\`. O workflow do GitHub Pages converte para WebP com Pillow, limitando dimensões a 1280 × 1280 e preservando a proporção.

## Comportamento

- **Como é** (padrão): fotos internas do estúdio, clique sobre foto para próxima, gesto horizontal e indicadores para selecionar; imagens não são esticadas.
- **Onde é**: mapa real do Google Maps carregado ao abrir a aba; endereço e rotas permanecem disponíveis.
- Botões com \`role=tab\` e navegação por setas do teclado, Home/End.
- Relevo de luz em elementos clicáveis e superfícies do Studio; usa a posição já publicada em \`aura:star-position\` e respeita o interruptor existente e \`prefers-reduced-motion\`.
- A versão anterior fica preservada via branch de backup; sem alteração de Cloudflare.

## Verificação

Conferir nos browsers: desktop e mobile, troca das abas, mapa, navegação de 11 fotos, iluminação com estrela, botão para desligar a luz e navegação por teclado.
