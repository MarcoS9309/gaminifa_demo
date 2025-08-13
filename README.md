# 🩸 Artery Dash## 🎮 Mecánicas de juego
- Controlas un **glóbulo rojo** que avanza por una arteria con efectos visuales mejorados.
- **Efectos de partículas**: Estela de movimiento, explosiones de colisión y celebraciones.
- Esquiva:
  - **Placas de colesterol** (tipo tuberías) con gradientes realistas.
  - **Glóbulos blancos** (leucocitos) con efectos de brillo.
  - **Bacterias** con cilios animados.
- Consigue **bonus** con efectos de pulsación:
  - **O₂**: +2 puntos con resplandor azul.
  - **Vitaminas**: +3 puntos con resplandor dorado.
- **Dificultad dinámica**: el hueco entre obstáculos se reduce con tu puntuación.
- **Récord guardado** en el navegador con `localStorage`.
- **Final divertido**: al chocar aparece un **pixel-doctor** con un diagnóstico gracioso y efectos de partículas.*Artery Dash** es un minijuego estilo *Flappy Bird* con estética **pixel art** mejorada en vista lateral, ambientado dentro de un vaso sanguíneo.  
Fue diseñado para amenizar la espera en hospitales o consultorios, ofreciendo un toque educativo y divertido sobre el sistema cardiovascular.

**Nueva versión mejorada** con efectos visuales avanzados, sistema de partículas y optimizaciones de rendimiento para una experiencia más fluida e inmersiva.

![Captura del juego](./Screenshot/ChatGPT%20Image%2013%20ago%202025,%2016_11_54.png)ry Dash

**Artery Dash** es un minijuego estilo *Flappy Bird* con estética **pixel art** en vista lateral, ambientado dentro de un vaso sanguíneo.  
Fue diseñado para amenizar la espera en hospitales o consultorios, ofreciendo un toque educativo y divertido sobre el sistema cardiovascular.

![Captura del juego](./screenshot.png) <!-- Puedes añadir esta imagen si tomas una captura -->

---

## Mecánicas de juego
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

## ✨ Mejoras Visuales y de Rendimiento

### 🎨 **Efectos Visuales Avanzados**
- **Sistema de partículas** completo con efectos de:
  - Estela del glóbulo rojo durante el movimiento
  - Explosiones de partículas al colisionar
  - Celebraciones al pasar obstáculos
  - Efectos de recolección de bonus
- **Gradientes mejorados** para todos los elementos del juego
- **Sombras y profundidad** en obstáculos y personajes
- **Animaciones fluidas** con cilios de bacterias ondulantes
- **Efectos de resplandor** en bonus con pulsación suave
- **Fondo dinámico** con puntos de luz flotantes en la arteria

### ⚡ **Optimizaciones de Rendimiento**
- **Gradientes cacheados** para evitar recreación innecesaria
- **Renderizado optimizado** con mejor gestión de transparencias
- **Animaciones suaves** con interpolación mejorada
- **Sistema de partículas eficiente** con gestión automática de memoria

### 🎨 **Interface Mejorada**
- **Diseño moderno** con gradientes y efectos de profundidad
- **Botones interactivos** con efectos hover y transiciones
- **Mejor contraste** y legibilidad en todos los elementos
- **Efectos de desenfoque** (backdrop filter) en modales

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

### 🔧 **Servidor de desarrollo**
Para desarrollo o testing local:
```bash
# Navega al directorio del juego
cd artery-dash

# Inicia un servidor HTTP simple
python3 -m http.server 8080

# Abre en el navegador: http://localhost:8080
```

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
- **Personaliza efectos visuales**:
  - Intensidad de partículas: modifica las funciones `createParticle()`
  - Colores de gradientes: ajusta las variables de gradiente en `initGradients()`
  - Efectos de resplandor: modifica los valores alpha en las funciones de dibujo

### 🎨 **Configuración Visual**
```javascript
// Ejemplos de personalización en el código:
const PX = 3;                    // Píxeles más grandes
world.arteryPhase += 0.03;       // Pulsación más rápida
const pulseScale = 1 + Math.sin(...) * 0.2;  // Pulsación más intensa
```

---

## 📜 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - consulta el archivo [LICENSE](LICENSE) para más detalles.

### 🔓 **Términos de Uso**
- ✅ **Uso comercial** permitido
- ✅ **Modificación** y distribución permitidas  
- ✅ **Uso privado** permitido
- ✅ **Distribución** permitida
- ⚠️ **Atribución requerida** - incluye el aviso de copyright original
- ❌ **Sin garantía** - el software se proporciona "tal como está"

La licencia MIT es una de las más permisivas y ampliamente utilizadas en proyectos de código abierto.

---

## ✍️ Créditos
- **Idea y diseño**: [Marco Vinicio](https://github.com/MarcoS9309)
- **Programación**: Basado en HTML5 Canvas + JavaScript.
- **Mejoras visuales**: Sistema de partículas, gradientes avanzados y optimizaciones de rendimiento.
- **Colaboración creativa**: El equipo de Marco Vinicio

### 🚀 **Tecnologías Utilizadas**
- **HTML5 Canvas** para renderizado 2D optimizado
- **JavaScript ES6+** con características modernas
- **Web Audio API** para efectos de sonido generativos
- **CSS3** con gradientes, sombras y efectos modernos
- **Sistema de partículas** personalizado para efectos visuales

---

### 📈 **Changelog v2.0 - Enhanced Edition**
- ✅ Sistema de partículas completo con optimización automática
- ✅ Gradientes cacheados para mejor rendimiento
- ✅ Efectos visuales mejorados en todos los elementos
- ✅ Animaciones más fluidas y suaves
- ✅ Interface moderna con efectos de profundidad
- ✅ Optimizaciones de renderizado y monitoreo de FPS
- ✅ Mejor experiencia de usuario general
- ✅ Documentación completa y archivo de licencia

---

## 🤝 **Contribuciones**

Las contribuciones son bienvenidas! Si quieres contribuir:

1. **Fork** el repositorio
2. Crea una **rama feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### 🎯 **Ideas para Contribuir**
- Nuevos tipos de obstáculos o bonus
- Más efectos de partículas
- Mejoras en la IA de dificultad
- Soporte para múltiples idiomas
- Nuevos temas visuales
- Optimizaciones de performance

---
