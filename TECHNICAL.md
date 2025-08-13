# Artery Dash - Documentación Técnica

## 🏗️ Arquitectura del Código

### Estructura Principal
```
Artery Dash/
├── index.html          # Archivo principal del juego
├── LICENSE             # Licencia MIT
├── README.md           # Documentación del usuario
├── TECHNICAL.md        # Esta documentación técnica
└── Screenshot/         # Capturas de pantalla
```

## ⚙️ Componentes Técnicos

### 1. **Sistema de Renderizado**
- **Canvas 2D Context**: Renderizado optimizado con `image-rendering: pixelated`
- **Gradientes Cacheados**: Pre-creación de gradientes para evitar recreación en cada frame
- **Layered Rendering**: Partículas → Obstáculos → Jugador → UI

### 2. **Sistema de Partículas**
```javascript
// Tipos de partículas:
- 'trail'     // Estela del jugador
- 'collision' // Explosiones al chocar
- 'bonus'     // Efectos de recolección
```

### 3. **Optimizaciones de Performance**
- **FPS Monitoring**: Ajuste automático de calidad basado en rendimiento
- **Particle Culling**: Limpieza automática de partículas excesivas
- **Fixed Delta Time**: Loop principal con timestep fijo (60 FPS)
- **Object Pooling**: Reutilización de objetos para evitar garbage collection

### 4. **Sistema de Audio**
- **Web Audio API**: Generación sintética de sonidos
- **Frequency Mapping**: Diferentes tonos para diferentes acciones
- **Mute Control**: Control de estado de audio persistente

## 📊 Variables de Configuración

### Performance
```javascript
const PX = 2;              // Escala de píxeles
const fixedDt = 1000/60;   // 60 FPS target
const maxParticles = 150;  // Límite de partículas (dinámico)
```

### Gameplay
```javascript
world.speed = 1.6;         // Velocidad horizontal
world.gravity = 0.35;      // Gravedad del jugador
world.jump = -6.2;         // Fuerza de salto
```

### Visual Effects
```javascript
world.arteryPhase += 0.02; // Velocidad de pulsación arterial
pulseScale = 1 + sin() * 0.1; // Intensidad de pulsación de bonus
```

## 🎨 Sistema de Colores

### Paleta Médica
```css
--blood-vessel: #8b1e5a   /* Paredes arteriales */
--blood-dark:   #3b0b2e   /* Fondo oscuro */
--red-cell:     #e43f5a   /* Glóbulo rojo */
--white-cell:   #f0f0f0   /* Leucocito */
--bacteria:     #4ee07d   /* Bacteria */
--plaque:       #d6b35c   /* Placa ateroma */
--oxygen:       #74d0ff   /* Oxígeno */
--vitamin:      #ffcc00   /* Vitamina */
```

## 🔧 Funciones Críticas

### Detección de Colisiones
```javascript
circleRectCollision(cx, cy, cr, rx, ry, rw, rh)
circleCircleCollision(a, b)
```

### Generación de Obstáculos
```javascript
spawnPlaque()    // Placas con gap dinámico
spawnHazard()    // Leucocitos y bacterias
spawnBonus()     // Oxígeno y vitaminas
```

### Sistema de Estados
```javascript
'menu'  // Pantalla inicial
'play'  // Jugando activamente  
'crash' // Game over con diagnóstico
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Características Utilizadas
- Canvas 2D Context
- Web Audio API
- LocalStorage
- RequestAnimationFrame
- CSS Grid y Flexbox
- CSS Custom Properties

## 🚀 Optimizaciones Implementadas

### 1. **Renderizado**
- Gradientes pre-calculados
- Culling de objetos fuera de pantalla
- Batching de operaciones de dibujo similares

### 2. **Memoria**
- Limpieza automática de arrays
- Pool de partículas limitado
- Eliminación de objetos fuera del área de juego

### 3. **CPU**
- Fixed timestep para consistencia
- Monitoreo de FPS en tiempo real
- Ajuste dinámico de efectos visuales

## 🧪 Testing y Debugging

### Performance Monitoring
```javascript
// Acceso a métricas de rendimiento:
console.log('FPS:', currentFps);
console.log('Partículas activas:', particleSystem.length);
console.log('Obstáculos:', plaques.length + hazards.length);
```

### Configuración de Debug
```javascript
// Para habilitar modo debug:
const DEBUG = true;
// Mostrará información adicional en consola
```

## 📚 Referencias Técnicas

- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [HTML5 Game Development](https://developer.mozilla.org/en-US/docs/Games)

---

*Última actualización: Agosto 2025*
