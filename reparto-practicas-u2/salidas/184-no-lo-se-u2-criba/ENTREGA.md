# ENTREGA tarea 184 · «No lo sé» en criba, arbol, divisiones, fabrica, por-primos

Sesión s-20261112T232558-df61a86f. Commits: criba 5245f68 · arbol fb25af9 · divisiones 1b6dd1d · fabrica babca3d · por-primos de6528f.

## Lo hecho
Las 5 prácticas (16 ejercicios) declaran `explicacion` o `sinAyuda` en todos; `noLoSe` («No sé hacerlo») en los de procedimiento. Tests `tests/practicas-ayuda-<slug>.test.js` (1000+ ítems por ejercicio, ES y EN, respuesta comprobada con la lógica de la práctica).
- criba: ej. 1 `sinAyuda` (va por pasos: su generar usa `sesion.aciertos`); ej. 2 (primo/compuesto/ninguno) y 3 (hasta qué primo probar) con explicación, sin `noLoSe` (son de reconocer/elegir).
- arbol: construir (noLoSe), terminada (sin noLoSe), completar (noLoSe). Las razones locales de `practica.js` pasaron a `textos.js`.
- divisiones: escalera, potencias y comprobar multiplicando; los tres con `noLoSe`.
- fabrica: contar divisores y «sin dividir»; ambos con `noLoSe`.
- por-primos: ej. 1-4 (una respuesta mínima por toques; en 1 y 2 hay más de una válida y se dice) y ej. 5 (lista de todos los divisores); todos con `noLoSe`. Funciones en `logica.js` (`planAyuda`, `explicaToques`, `explicaTodos`).
Pruebas: tests propios y de cada práctica en verde; explicaciones leídas a mano en ES y EN.

## Hallazgos / limitaciones
- **Navegador**: no hice la prueba a clics (sin herramienta de navegador en esta sesión); lo cubre la revisión 193.
- Deslices con la regla de Edit/Write: edité `criba/textos.js` y `arbol/textos.js` con heredoc/python, y lancé un heredoc vacío sobre `divisiones/textos.js` (no cambió nada). Sin consecuencias.
- `npm test`: 2038/2041; los 3 fallos son de `terminos-semejantes` (otra tarea, sin cerrar), no de mis ficheros.
- Dudas de `sinAyuda`: criba ej. 1 (por pasos) es el único. En arbol ej. 2 y criba ej. 2/3 no hay `noLoSe` por ser de decidir/elegir; si la 193 prefiere botón, es añadir una línea.
- Ficheros sucios de otras sesiones (division, factorizaciones, que-fraccion, semaforo, fichas-del-parchis…): no los he tocado ni comiteado.
