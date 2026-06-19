# Juego de Memoria - Auditoría y Refactorización

Repositorio de entrega para el proyecto de auditoría de código web. Este proyecto transforma una aplicación funcional pero vulnerable en una arquitectura robusta, segura y escalable.

## 1. Auditoría del Código (`app.js`, `index.html`)

Se realizó una revisión profunda sobre el código fuente original, identificando y resolviendo fallas críticas:

* **Seguridad (Vulnerabilidad XSS):** Se reemplazó el uso de `innerHTML` por `textContent` al interactuar con el DOM, neutralizando vectores de ataque de inyección de scripts.
* **Gestión de Estados (Condiciones de Carrera):** Se implementó un bloqueo lógico (`state.bloqueado`) durante los procesos asíncronos (`setTimeout`), evitando comportamientos inconsistentes por clics rápidos durante las animaciones.
* **Arquitectura (Fuente Única de Verdad):** Se refactorizó la lógica para eliminar la dependencia directa del DOM. Ahora, toda la lógica de comparación y victoria reside en el objeto `state`, garantizando que el DOM sea siempre una representación fiel de los datos.

## 2. Reflexión Técnica (Rúbrica)

### ¿Dónde te ayudó la IA y dónde fue incorrecta?
La IA fue fundamental para identificar patrones de vulnerabilidad (como el uso de `innerHTML`) y sugerir estructuras de estado. Sin embargo, su propuesta inicial de lógica asíncrona era insuficiente: permitía clics durante el `setTimeout`, lo cual "rompía" el juego. Tuve que auditar y corregir manualmente la implementación del bloqueo de estados para asegurar la estabilidad.

### Justificación de dos decisiones de diseño
1.  **Uso de `textContent` vs `innerHTML`:** Es una medida de seguridad crítica. `innerHTML` parsea etiquetas y ejecuta código arbitrario, lo que permite ataques XSS. `textContent` trata todo contenido estrictamente como texto plano, eliminando el riesgo.
2.  **Control de estado centralizado:** Se decidió gestionar el flujo mediante un objeto `state` (`cartas`, `bloqueado`, `movimientos`). Esto desacopla la lógica de negocio de la capa de presentación (DOM), haciendo el código más fácil de testear y escalar.

### Bonus: Mejoras implementadas
* **Dificultad Dinámica:** Implementación de un selector que ajusta la cantidad de cartas (`4`, `8`, o `12` parejas), permitiendo escalar la complejidad sin cambiar la estructura del código.
* **Persistencia de datos (`localStorage`):** Integración de un `RecordManager` para persistir el mejor puntaje (mínimos movimientos) entre sesiones del navegador, aumentando el valor de la experiencia de usuario.

### Una cosa que mejoraría con más tiempo
Implementaría un temporizador de partida que penalice el tiempo de resolución total, añadiendo una capa extra de desafío y competitividad al juego.

## 3. Conclusión
El proceso de auditoría permitió transformar un código frágil en una aplicación robusta. La lección principal es que la automatización es una herramienta de aceleración, pero la responsabilidad técnica y la seguridad de la arquitectura dependen siempre de la validación humana.