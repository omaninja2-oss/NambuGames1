# 🏠 Corre que a Mãe Tá Vindo!

Jogo web 2D feito em HTML5, CSS3 e JavaScript puro.

## Como jogar
- **WASD / Setas:** movimentar
- **E (segure):** realizar a tarefa quando estiver perto do objeto
- Complete todas as tarefas antes do tempo acabar e antes que a paciência da mãe chegue ao limite.

## Fases
1. **Arrumando a Casa** — varrer a sala, limpar o banheiro e guardar objetos.
2. **Hora do Almoço** — ingredientes, comida, louça e área.
3. **A Mãe Tá Brava** — quintal, lixo, organização, cozinha e tarefa surpresa.

## Executar
Abra `index.html` em um navegador moderno. Não precisa de servidor ou backend.

## GitHub Pages
Em **Settings → Pages**, escolha **Deploy from a branch**, branch **main** e pasta **/(root)**. Depois salve.

O projeto não depende de bibliotecas externas e está pronto para hospedagem estática.

## Estrutura
- `index.html` — telas e HUD
- `style.css` — visual e responsividade
- `game.js` — movimentação, colisões, tarefas, fases, IA da mãe, perseguição, cronômetro e estados do jogo

Os gráficos atuais são desenhados com Canvas e elementos temporários, facilitando a troca futura por sprites e efeitos profissionais.
