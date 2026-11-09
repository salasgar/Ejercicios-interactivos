# ENTREGA tarea 155 · leelo6 «Léelo en inglés» (U6 Álgebra, catálogo id 79)

Sesión s-20261109T101421-07923cb9 · código en commit a8a6596 · `npm test` 1715/1715 (tests propios: 9, con 3000 ítems por ejercicio, semillas 0/100/200 en verde).

## Qué hay
`practicas/leelo6/`: `logica.js`, `textos.js`, `estilos.css`, `practica.js`, `index.html` (ya enlaza `estilos.css`). Test: `tests/practicas-leelo6.test.js`. Siguen `disponible: false` en el catálogo: publicar es de la tarea de publicación de cada semana.

1. **La palabra**: 38 términos (con `sesion` y `familia`); inglés→español y al revés; el contrario típico (expression/equation, coefficient/constant term, numerator/denominator, left/right, ago/in time, no solution/infinite) entra siempre como distractor.
2. **Léelo**: leer expresión, ecuación y en español; y escribir lo que dice la frase. Distractores por error con nombre (signo-cambiado, numeros-cambiados, producto-como-suma, division-como-producto…); formas canónicas y lecturas válidas de `algebra.js`.
3. **La consigna**: grupos expresión (s.3), ecuación (s.5), paréntesis (s.10), denominadores (s.11). Plantillas con operación contraria (resta/suma, divide/multiplica) y solo válidas si el signo cuadra.
4. **Completa**: 12 plantillas (coeficiente, término independiente, semejantes, evaluar, solución, ambos miembros, expresión, paréntesis, denominador, nº de soluciones, en total, hace…años).

## Casos reservados
Al escribirla no existían hoja ni examen de la U6: `RESERVADOS_HOJA` y `HUELLAS_EXAMEN` están vacíos y `esReservado` ya se aplica al generar. **La tarea de publicación de cada semana tiene que cotejar** y rellenarlos (huella FNV-1a de la forma canónica) si hace falta.

## Decisiones a revisar (propuestas)
- Ids de destreza: los de la propuesta F0 sin firmar (U6-1B-01…4B-01).
- 3B-02 (sin solución / infinitas soluciones) está en «Completa» (sesión 9) y en el vocabulario; pendiente de F0.
- Contenido de paréntesis, denominadores y problemas (semanas 3-4) incluido con su `sesion`; si se prefiere no mostrarlo antes de darlo, filtrar por `sesion`.
- Cotas: coeficientes 2-9, constantes 1-9, denominadores 2-6, valor de x 2-6, lápices 5-30, edades 8-16, «hace» 1-5 años.

## Pendiente
Probarla en navegador (375 px y ancho, es/en): no se hizo en esta sesión (sin navegador); solo se probó por tests y por muestreo a mano de ítems.
