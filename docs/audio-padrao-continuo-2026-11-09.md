# Aura — áudio ligado por padrão e contínuo

- A preferência inicial permanece **ligado**. O vídeo tenta tocar com som ao carregar, preservando volume, loop e execução durante o scroll.
- Chrome, Edge e Safari podem bloquear áudio automático. Nesse caso o vídeo permanece mudo até a primeira interação válida ou o clique no botão de som.
- Corrigido o desbloqueio em smartphones: `pointerup` / `touchend` são considerados, além de clique com mouse e teclas usuais. A rolagem por toque agora pode liberar som ao terminar o gesto, quando permitido pelo navegador.
- Depois que a pessoa desativa o som usando o botão, outras interações não o reativam; só o próprio botão pode reativá-lo.
- O controle flutuante continua ao lado do controle de iluminação e o vídeo não é pausado ao rolar a página.
- Pausa ao ocultar a aba e comportamento de movimento reduzido preservados.
- Backup da versão anterior: `backup/antes-audio-padrao-scroll-2026-11-09`.

Teste adicionado ao Chromium para simular bloqueio inicial e desbloqueio na primeira interação móvel.
