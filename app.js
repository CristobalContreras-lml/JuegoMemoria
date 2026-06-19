// Estado inicial
const state = {
    cartas: [],
    volteadas: [],
    bloqueado: false,
    movimientos: 0
};

// Gestión de Puntajes (Módulo de Persistencia)
const RecordManager = {
  guardar: (movimientos) => {
    const mejor = localStorage.getItem('mejorPuntaje') || Infinity;
    if (movimientos < mejor) {
      localStorage.setItem('mejorPuntaje', movimientos);
      return true;
    }
    return false;
  },
  obtener: () => localStorage.getItem('mejorPuntaje') || '-'
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
function compararCartas() {
    const [c1, c2] = state.volteadas;
    state.movimientos++;

    if (c1.emoji === c2.emoji) {
        c1.encontrada = true;
        c2.encontrada = true;
        state.volteadas = [];
        state.bloqueado = false;
        render();
        revisarVictoria(); // Llamamos a una función para saber si ganamos
    } else {
        setTimeout(() => {
            c1.revelada = false;
            c2.revelada = false;
            state.volteadas = [];
            state.bloqueado = false;
            render();
        }, 1000);
    }
}
function revisarVictoria() {
    const ganaste = state.cartas.every(carta => carta.encontrada);
    if (ganaste) {
        setTimeout(() => {
            alert(`¡Felicidades! Ganaste en ${state.movimientos} movimientos.`);
        }, 100);
        
    if (RecordManager.guardar(movimientos)) {
      msg += ' ¡Nuevo récord: ' + movimientos + '!';
    }
    document.getElementById('mensaje').textContent = msg;}
    
}

// Delegación de eventos en el contenedor del tablero
document.getElementById('tablero').addEventListener('click', (e) => {
    // Buscamos si el click fue sobre una carta
    const cartaDiv = e.target.closest('.carta');
    
    // Si no es una carta o el tablero está bloqueado, no hacemos nada
    if (!cartaDiv || state.bloqueado) return;

    const id = Number(cartaDiv.dataset.id);
    const carta = state.cartas.find(c => c.id === id);

    // Si la carta ya está revelada o encontrada, ignoramos el click
    if (carta.revelada || carta.encontrada) return;

    // Lógica: voltear la carta
    carta.revelada = true;
    state.volteadas.push(carta);
    render(); // Volvemos a dibujar basándonos en el nuevo estado

    // Si volteamos 2, comparamos
    if (state.volteadas.length === 2) {
        state.bloqueado = true; // Bloqueamos el tablero
        compararCartas();
    }
});

// Listener para el botón reiniciar
document.getElementById('reiniciar').addEventListener('click', iniciarJuego);


document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        iniciarJuego();
    }
});
iniciarJuego();