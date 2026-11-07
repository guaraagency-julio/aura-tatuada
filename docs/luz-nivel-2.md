# Aura Tatuada — experimento de luz nivel 2

## Backup e restauracao
- Versao original: commit `6b776291a70cccaab2deb8c2b0593384e0670bc6`
- Branch de backup: `backup/antes-luz-nivel-2-2026-11-07`
- Branch de desenvolvimento: `experimento/luz-nivel-2`
- Ambiente de teste publico: GitHub Pages, branch `main`

### Como restaurar sem perder historico
Leia a tree do commit original usando `GET /repos/guaraagency-julio/aura-tatuada/git/commits/6b776291a70cccaab2deb8c2b0593384e0670bc6`.
Leia o HEAD atual da main. Crie **um novo commit** com a tree original e como parent o HEAD atual, depois avance `main` para esse novo commit por fast-forward. O GitHub Pages republica automaticamente.
Isso restaura exatamente os arquivos do backup e preserva todos os commits do experimento.

## Implementacao isolada
- `site/light-system.css`: luminosidade, halo, reflexos e sombras 2D.
- `site/light-system.js`: acompanha o evento `aura:star-position`.
- `site/main.js`: emite um evento dentro do requestAnimationFrame ja existente.
- `site/index.html`: importa CSS e JS extras.
- Sem WebGL, dependencias pagas ou alteracao de conteudos/fotografias.

## Uso
Role pelo site. O halo segue a estrela. Cartoes, folhas e fotografias recebem luminosidade e sombras direcionais aproximadas. Use o controle `Luz ligada`/`Luz desligada` para comparar a experiencia.
No celular o controle vira icone de 44px. Quem usa `prefers-reduced-motion: reduce` recebe o design original, sem efeito dinamico.

## Limite tecnico
Simulacao bidimensional; as sombras sao projetadas nos componentes do DOM, sem calculo fisico da geometria das fotografias. Para sombras fotograficas fisicamente corretas, seriam necessarios mapas de profundidade ou modelos 3D.

## Testes realizados
- Chromium emulado 1440, 390 e 320px, sem erros JavaScript ou overflow horizontal.
- Alternancia de luz ligada/desligada.
- Troca de categorias com novos cards.
- Movimento reduzido.
- Google Maps nao foi alterado. Teste em dispositivos fisicos ainda pendente.
