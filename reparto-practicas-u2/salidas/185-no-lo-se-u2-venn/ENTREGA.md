# ENTREGA tarea 185 · «No lo sé» en venn, imposibles, clasificador, reloj, baldosas

Sesión s-20261112T232555-695b625b. Commits: venn ec8174c · imposibles 0e29a43 · clasificador adde017 · reloj d3781d1 · baldosas 4a3d78c.

## Lo hecho
Las 5 prácticas (16 ejercicios) declaran `explicacion` en todos; `noLoSe` («No sé hacerlo») en los de procedimiento (venn 4, reloj 3, baldosas 3; imposibles y clasificador sin él: son de decidir/clasificar). Ningún `sinAyuda`. Cada explicación lleva los números del ítem y acaba con «La respuesta es». Funciones exportadas en `logica.js` (explicaVenn, explicaReglas, explicaPuede, explicaProducto, explicaNombrar, explicaClasificar, explicaJustificar, explicaLinea, explicaHora, explicaTres, explicaBaldosa, explicaCuantas, explicaCuerdas); textos en `TX.ayuda`.
Tests: `tests/practicas-ayuda-{venn,imposibles,clasificador,reloj,baldosas}.test.js` (1000 ítems por ejercicio, ES y EN, solución por fuerza bruta). `npm test`: 2044/2044. Explicaciones leídas a mano en ES y EN.

## Hallazgos / limitaciones
- **Navegador**: sin prueba a clics (sin herramienta de navegador en esta sesión); lo cubre la revisión 193.
- Deslices con la regla de Edit/Write: añadí código con heredoc/Python en venn/logica.js, reloj y baldosas (logica, textos, practica). Nadie más tocaba esos ficheros.
- imposibles: el feedback se refactorizó para usar las mismas funciones que la explicación (feedbackPuede, feedbackProducto), sin cambiar su texto.
- Hubo un fallo transitorio de `npm test` en un fichero de otra sesión (traduce); al final todo en verde.
