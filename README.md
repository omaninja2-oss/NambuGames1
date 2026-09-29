# 🏠 Corre que a Mãe Tá Vindo! — v1.0

Jogo web 2D em HTML5, CSS3 e JavaScript puro, sem backend.

## História
Três dias. Três rodadas de tarefas. Uma mãe ficando cada vez menos paciente.

1. **Dia 1 — Arrumando a Casa:** introdução mais tolerante a movimento, ferramentas, tarefas, corrida e paciência.
2. **Dia 2 — Hora do Almoço:** cozinha, tarefas em etapas, eventos, barulho e investigação.
3. **Dia 3 — A Mãe Tá Brava:** pressão maior, perseguição, imprevistos e o grande final.

## Controles
- **WASD / Setas:** movimentar
- **SHIFT:** correr
- **E:** interagir / segurar para executar tarefas
- **Q:** largar item
- **ESC:** pausar

## v1.0
- abertura curta e pulável
- menu com seleção de dias, conquistas, estatísticas, ajuda, configurações e créditos
- progressão Dia 1 → Dia 2 → Dia 3
- balanceamento revisado
- diretor de eventos com proteção contra sobreposição crítica
- feedback de ferramentas e orientação contextual
- save com migração dos dados anteriores
- confirmação antes de apagar progresso
- opção de reduzir tremor
- áudio procedural com fallback seguro e música ambiente simples
- final normal e Final Perfeito preservados

## GitHub Pages
O projeto continua totalmente estático e usa caminhos relativos. A publicação esperada é:

https://omaninja2-oss.github.io/NambuGames1/

## Estrutura
- `index.html` — telas, menus e HUD
- `style.css` — arte da interface, animações e responsividade
- `game.js` — gameplay, IA, eventos, save, áudio e progressão

Não há dependências externas obrigatórias.
