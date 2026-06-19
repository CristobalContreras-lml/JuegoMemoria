const EMOJIS = ['🍎', '🚀', '🐱', '🌵', '🎲', '🎧', '⚽', '🍕', '☀️', '🌈', '🍦', '🚗'];

const state = {
    cartas: [],
    volteadas: [],
    bloqueado: false,
    movimientos: 0,
    timer: null
};

const RecordManager = {
  guardar: (movimientos) => {
    const mejor = localStorage.getItem('mejorPuntaje') || Infinity;
    if (movimientos < mejor) {
      localStorage.setItem('mejorPuntaje', movimientos);
      return true;
    }
    return false;
  }
};

function iniciarJuego() {
    // 1. Obtener dificultad y emojis
    if (state.timer) clearTimeout(state.timer);
    const nivel = parseInt(document.getElementById('dificultad').value);
    const emojisSeleccionados = EMOJIS.slice(0, nivel);
    
    // 2. Crear mazo (duplicar, barajar y asignar IDs únicos)
    const mazo = [...emojisSeleccionados, ...emojisSeleccionados].map((emoji, index) => ({
        id: index,
        emoji,
        revelada: true,
        encontrada: false
    }));
    
    state.cartas = mazo.sort(() => Math.random() - 0.5);
    state.volteadas = [];
    state.bloqueado = true;
    state.movimientos = 0;
    
    document.getElementById('mensaje').textContent = '';
    document.getElementById('contador').textContent = '0';
    render();
    state.timer = setTimeout(() => {
        state.cartas.forEach(c => c.revelada = false);
        state.bloqueado = false;
        document.getElementById('mensaje').textContent = '';
        render();
    }, 1000);
}

function render() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    state.cartas.forEach(carta => {
        const div = document.createElement('div');
        // Agregamos ambas clases según el estado
        div.className = 'carta';
        if (carta.revelada || carta.encontrada) {
            div.classList.add('revelada');
            div.textContent = carta.emoji;
        }
        if (carta.encontrada) {
            div.classList.add('encontrada');
        }
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
        revisarVictoria();
    } else {
    state.timer = setTimeout(() => {
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
        let mensaje = `¡Felicidades! Ganaste en ${state.movimientos} movimientos.`;
        if (RecordManager.guardar(state.movimientos)) {
            mensaje += ' ¡Nuevo récord!';
        }
        document.getElementById('mensaje').textContent = mensaje;
    }
}

// Eventos
document.getElementById('tablero').addEventListener('click', (e) => {
    const cartaDiv = e.target.closest('.carta');
    if (!cartaDiv || state.bloqueado) return;

    const id = Number(cartaDiv.dataset.id);
    const carta = state.cartas.find(c => c.id === id);

    if (carta.revelada || carta.encontrada) return;

    carta.revelada = true;
    state.volteadas.push(carta);
    render();

    if (state.volteadas.length === 2) {
        state.bloqueado = true;
        compararCartas();
    }
});

document.getElementById('reiniciar').addEventListener('click', iniciarJuego);

// Iniciar al cargar
iniciarJuego();