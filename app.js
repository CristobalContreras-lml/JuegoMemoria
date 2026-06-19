// Estado inicial
const state = {
    cartas: [],
    volteadas: [],
    bloqueado: false,
    movimientos: 0
};

// Generar mazo y barajar
function iniciarJuego() {
    const emojis = ['🍎', '🚀', '🐱', '🌵', '🎲', '🎧', '⚽', '🍕'];
    const mazo = [...emojis, ...emojis].map((emoji, index) => ({
        id: index,
        emoji,
        revelada: false,
        encontrada: false
    }));
    state.cartas = mazo.sort(() => Math.random() - 0.5);
    state.bloqueado = false;
    state.movimientos = 0;
    render();
}

// Función render (fuente única de verdad)
function render() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    state.cartas.forEach(carta => {
        const div = document.createElement('div');
        div.className = `carta ${carta.revelada || carta.encontrada ? 'revelada' : ''}`;
        div.textContent = carta.revelada || carta.encontrada ? carta.emoji : '';
        div.dataset.id = carta.id;
        tablero.appendChild(div);
    });
    document.getElementById('contador').textContent = state.movimientos;
}