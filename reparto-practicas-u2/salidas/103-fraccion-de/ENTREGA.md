# Entrega de la tarea 103 · La fracción de una cantidad (fraccion-de)

Sesión `s-20261027T082817-350699e7`, 2026-10-27. Commit del código: **0f5a9e8**.

## Ficheros
`practicas/fraccion-de/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-fraccion-de.test.js` (14 tests, 3000 ítems por ejercicio).

## Ejercicios y destrezas
1. **Calcula** (U4-1C-08, 1C-09): «3/5 de 40», resultado escrito; botón Pista (1.º dividir, 2.º multiplicar; cuentan como ayuda). Errores: fraccion-de-al-reves, se-queda-en-la-unitaria, multiplica-por-el-denominador, multiplica-sin-dividir.
2. **Con contexto** (U4-1A-01): diez contextos con cota (depósito de coche 20-90 L, garrafa 5-50 L, botella 300-3000 ml, clase 12-36, instituto 200-3000, pizza 3-15 trozos, ahorro 100-2000 € de 10 en 10, bici 10-50 km, coche 100-1000 km, hora = 60 min).
3. **¿Qué fracción es?** (U4-1C-04, **1A-03**): dos casillas (numerador sobre denominador), respuesta irreducible; cinco grupos con total y dos con las dos partes. Errores: parte-entre-el-resto, sin-simplificar (propio).
4. **El problema** (U4-1A-01, **1A-02**, 2A-02, **2A-03**): cuatro variantes (lo que queda/NO, dos fracciones y el resto, hallar el total desde la parte, hallar el total desde lo que falta), cuatro opciones; distractores de errores con nombre (los de fracciones.js y los propios de ERRORES_PROPIOS), todos dentro de la cota y distintos por valor.

No hay práctica para U4-3A-03/3A-04 (propuesta de la 98 sigue pendiente).

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/fraccion-de/ → «Probar sin código» (el código 7NPD no se aceptó en esta máquina: «no existe»). `node --test tests/practicas-fraccion-de.test.js`.
