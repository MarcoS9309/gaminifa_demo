# 🩸 Artery Dash

**Artery Dash** es un minijuego estilo *Flappy Bird* con estética **pixel art** en vista lateral, ambientado dentro de un vaso sanguíneo.  
Fue diseñado para amenizar la espera en hospitales o consultorios, ofreciendo un toque educativo y divertido sobre el sistema cardiovascular.

![Captura del juego](./screenshot.png) <!-- Puedes añadir esta imagen si tomas una captura -->

---

## 🎮 Mecánicas de juego
- Controlas un **glóbulo rojo** que avanza por una arteria.
- Esquiva:
  - **Placas de colesterol** (tipo tuberías).
  - **Glóbulos blancos** (leucocitos).
  - **Bacterias**.
- Consigue **bonus**:
  - **O₂**: +2 puntos.
  - **Vitaminas**: +3 puntos.
- **Dificultad dinámica**: el hueco entre obstáculos se reduce con tu puntuación.
- **Récord guardado** en el navegador con `localStorage`.
- **Final divertido**: al chocar aparece un **pixel-doctor** con un diagnóstico gracioso.

---

## ⌨️ Controles
- **Saltar**: `Espacio` / Click / Toque.
- **Pausar**: `P`.
- **Silenciar/activar sonido**: `M`.

---

## 📂 Instalación y uso local
1. Descarga el archivo [`index.html`](./index.html).
2. Ábrelo con tu navegador favorito (Chrome, Firefox, Edge…).
3. ¡Listo! No requiere instalación ni conexión a internet.

---

## 🌐 Publicación en GitHub Pages
1. **Crea un repositorio** en GitHub, por ejemplo: `artery-dash`.
2. **Sube el archivo** `index.html` a la raíz del repositorio.
3. Ve a **Settings → Pages**:
   - **Source**: `Deploy from a branch`.
   - **Branch**: `main` (o `master`), carpeta `/root`.
4. Guarda los cambios.  
   GitHub generará una URL del tipo:  
   `https://<tu-usuario>.github.io/artery-dash/`.
5. Abre la URL para jugar.

---

## 🛠️ Personalización
- Ajusta el tamaño del pixel art: cambia `const PX = 2;` en el código.
- Modifica la velocidad o gravedad: variables `world.speed` y `world.gravity`.
- Cambia los mensajes del pixel-doctor en la función `pickDiagnosis()`.

---

## 📜 Licencia
Este juego se distribuye bajo la licencia **MIT**, por lo que puedes modificarlo y publicarlo libremente, siempre y cuando incluyas la atribución correspondiente.

---

## ✍️ Créditos
- **Idea y diseño**: [Marco Vinicio](https://github.com/<tu-usuario>)
- **Programación**: Basado en HTML5 Canvas + JavaScript.
- **Colaboración creativa**: El equipo de Marco Vinicio

---
