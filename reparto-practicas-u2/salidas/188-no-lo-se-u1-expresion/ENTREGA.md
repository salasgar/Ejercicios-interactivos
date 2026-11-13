# Entrega de la tarea 188 · «No lo sé» en expresion, redondeo, constructor, distributiva y potencias10 (unidad 1)

Sesión de cierre: s-20261113T085511-3a4ee623 (relevó a s-20261112T235132-5b667b44, que hizo expresion y redondeo).

## Lo hecho

| Práctica | Commit | Ejercicios | Declaración |
|---|---|---|---|
| expresion | 33a2395 | 1, 2, 3 | `explicacion` en los tres (heredado de la sesión anterior) |
| redondeo | f06f828 | 1, 2, 3 | `explicacion` en los tres (heredado) |
| constructor | 48a1268 | 1 construir, 2 valor de las cifras, 3 comas y palabras | `explicacion` en los tres; `noLoSe` «No sé hacerlo» en el 1 |
| distributiva | 5aa21e0 | 1 parte el rectángulo, 2 factor común, 3 compensa con 99 | `explicacion` en los tres; `noLoSe` en el 1 y el 3 |
| potencias10 | 20e5f05 | 1 deslizador, 2 «and» y cifras, 3 billion | `explicacion` en los tres (sin `noLoSe`: reconocer/elegir/mover) |

Ningún `sinAyuda`: ningún ejercicio es un juego ni va por pasos.

Tests: `tests/practicas-ayuda-<slug>.test.js` de las cinco (1500-2400 ítems por ejercicio, en es y en); verdes junto a
`practicas-no-lo-se.test.js` y el test propio de cada práctica. `npm test`: 2136 pasan, 2 fallan
(`suma-resta` ejercicios 1 y 2, de la tarea 104/«No lo sé» de otra sesión: su fichero de test está modificado sin comitear; ajeno).

Cómo se probó: explicaciones leídas a mano en los dos idiomas (muestras de cada tipo de ítem; cuentas comprobadas); clics en
Chrome headless (CDP) en las cinco prácticas, 375 y 1200 px, los tres ejercicios y los dos idiomas: botón, cuatro tarjetas,
ítem apagado, aviso de la 3.ª ayuda, traducción, sin desborde, consola limpia, ítem siguiente distinto. Guion de clics: el de
`hechos/notas/s-20261113T074721-a71b7338-clics-no-lo-se.mjs` (tarea 192).

Qué se hizo al heredar constructor (sin comitear): se revisó y se comiteó tal cual, más una cota propia en
`explicaComaPalabras`: la frase «Si lo leyeras con las reglas del otro idioma, X sería X» (con X igual) se omite, porque
no dice nada. El test del ejercicio 3 que estaba en rojo lo había dejado en verde la coordinadora (espacio fino del «776 304»).

## Hallazgos fuera de criterio (para Juan Luis)

1. **Feedback ya existente de `constructor` ej. 3 (no tocado):** en las preguntas de separador de miles el mensaje de fallo
   dice a veces «75.443 sería 75.443» o «549,945 sería 549,945» (el mismo texto a los dos lados). En la explicación nueva
   ya se omite; el feedback del ejercicio sigue igual (prohibido tocarlo).
2. **Producto en la unidad 1:** la ficha y `docs/no-lo-se.md` dicen que la unidad 1 usa «×», pero distributiva ya escribe «·»
   en todo su texto y su feedback; las explicaciones nuevas siguen a la práctica («·») para no mezclar.
3. Aviso de proceso: en esta sesión la primera tanda de explicaciones de `distributiva/textos.js` se añadió con un script de
   python desde el shell (la regla pide Edit/Write por el candado de sesiones); los ajustes siguientes y el resto, con Edit.
   Sin consecuencias (ningún otro fichero reservado por otra sesión), pero queda dicho.
