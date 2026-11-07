# Hero em vídeo e títulos 2.5D — 07/11/2026

Origem: vídeo "uhi89c.mp4" fornecido na pasta do Google Drive da Aura; duração 42,63s; H.264 1280×720 com AAC; 3.704.475 bytes. O original foi armazenado sem recompressão em 16 partes ASCII sob `media-source/hero-video/`. O workflow do Pages concatena e decodifica essas partes e valida SHA-256 antes de publicar `site/assets/hero-background.mp4`.

- Hero: autoplay **mudo**, `playsinline`, `loop`, `preload=metadata`, imagem original como fallback.
- Som: ativado só por clique; sem áudio fora da seção; vídeo pausa ao sair da tela.
- Movimento reduzido: não inicia vídeo automaticamente; pode iniciar por clique.
- Títulos: módulo separado reage a `aura:star-position`; sombras variam com direção/distância da estrela. Com iluminação desligada, os títulos voltam ao CSS original.
- Estrela no fundo claro: halo com contorno oliva para contraste.

## Segurança e reversão
Backup da versão imediatamente anterior: `backup/antes-video-e-relevo-2026-11-07`. O backup anterior do sistema de luz permanece em `backup/antes-luz-nivel-2-2026-11-07`.

Para remover somente este recurso, retire do HTML os links `hero-scene.css/js` e `title-relief.css/js`, o elemento `video` e o botão `#aura-hero-sound`. Para rollback completo, restaure o conteúdo do commit apontado pelo backup através de novo commit na `main`.
