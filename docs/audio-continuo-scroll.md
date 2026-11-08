# Reprodução contínua do vídeo no scroll

Removido o observador de interseção que pausava o vídeo e silenciava a música assim que a primeira seção saía da tela. Agora o vídeo continua reproduzindo ao visitar as demais seções, preservando loop, preferências de áudio e botão de som.

Quando a guia do navegador fica oculta, a reprodução ainda pausa e retoma ao voltar; o modo de movimento reduzido também foi preservado. Autoplay com som continua sujeito às políticas do navegador.

Backup: backup/antes-musica-continuar-scroll-2026-11-08.

O teste regressivo verifica que percorrer a página até o rodapé não aciona pause() no vídeo.
