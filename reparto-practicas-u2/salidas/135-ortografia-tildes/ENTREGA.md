# ENTREGA · Tarea 135 · Ortografía: las tildes (`ortografia-tildes`, id 64)

Sesión: `s-20261105T234411-1c82015c`. Fecha: 2026-11-06. Sin publicar (`disponible: false`; la publica la 141).

## Ficheros entregados

`practicas/ortografia-tildes/{logica,practica,textos}.js` (sustituyen el esqueleto de la 134; `index.html` y `estilos.css`
sin cambios) y `tests/practicas-ortografia-tildes.test.js` (28 tests).

## Ítems por ejercicio y nivel

| Ejercicio | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|---|
| 1 La sílaba tónica (dos pasos) | 16 (5 agudas, 5 llanas, 6 esdrújulas) | 16 (5, 5, 6) | 16 (4 agudas, 4 llanas, 4 esdrújulas, 4 sobresdrújulas) |
| 2 ¿Lleva tilde? | 16 (8 con, 8 sin) | 16 (8, 8) | 16 (8, 8: 4 adverbios en -mente, 4 monosílabos, 4 mayúsculas) |
| 3 Diptongos e hiatos | 16 (8, 8) | 16 (8, 8) | 15 palabras (8, 7) + 4 frases aún/aun (2 y 2) |
| 4 Palabras de Matemáticas | 16 (8 con tilde, 8 sin) | 16 (8, 8) | 16 (8, 8) |

## Cómo está hecho

- `acentuar(silabas, tonica)`: el motor de reglas (agudas, llanas, esdrújulas, sobresdrújulas, hiato con i/u tónica, monosílabos,
  la y final y la s tras consonante como consonantes, u muda de que/qui/gue/gui). Cada palabra de los bancos se escribe a mano
  con partición, tónica **y forma correcta** (`"'lá-piz"`, `"'fá-cil|mente"`); el test comprueba que el motor da esa forma en los
  195 ítems, más una tabla aparte de 55 palabras, y que cada sílaba tiene un solo núcleo. Las explicaciones salen del motivo
  (`razon`), así que dicen la regla de **esa** palabra.
- El ejercicio 4 usa la misma notación: la explicación y el test también pasan por el motor, no solo por la tilde de la cadena.

## Decisiones donde la ficha dejaba margen

1. **Ejercicio 3: se toca la letra, no la sílaba.** Con las sílabas partidas ya se vería si hay hiato o diptongo (`di-a` / `rui-do`)
   y no habría nada que decidir; con las letras, el alumno decide pronunciando. Piezas: las letras de la palabra (≤ 10), `unidas`.
2. **Ejercicio 1, nivel 3: cuatro botones** (aguda, llana, esdrújula, **sobresdrújula**). Con tres, una sobresdrújula tendría dos
   respuestas defendibles. Niveles 1 y 2, tres botones.
3. **Nivel 3 del ejercicio 3** lleva 4 frases de aún/aun (dos y dos) como hueco, con «todavía»/«incluso» en la explicación.
4. **`río` y `frío` no entran** (aunque la ficha los nombra en el nivel 1 del 3): su forma sin tilde, «rio»/«frio», está en la lista de lo
   que nunca es distractor. Sustituidos por día, tía, país, raíz, maíz, oír, baúl, María.
5. **Ejercicio 4 sin «más»** (la ficha lo nombra): su tilde es diacrítica (la 45 la trabaja) y el motor no la modela; entra «también».
6. `veintiún` se escribe como 2 sílabas (vein-tiún); `ci-lin-dro`, `trian-gu-lo` y demás particiones, a mano y revisadas.

## Cómo probarlo

`npm run servir`, `http://localhost:8080/practicas/ortografia-tildes/?nivel=1|2|3` → «Probar sin código».
Hecho con clics (Chrome): ej. 1 acertando los dos pasos; ej. 2, 3 y 4 fallando (feedback con la regla de la palabra);
sin errores; a 375 px sin desbordar.

## Propuestas (no hechas)

- Los nombres «Luis», «Lucía», «María», «Ángel», «Óscar» y «Úrsula» están en los bancos: `sin-nombres-de-alumnos` en verde, pero si un
  alumno real se llama así, que lo decida Juan Luis (son nombres corrientes).
- La 141 debería leer **todas las frases del ejercicio 4** (48) y las particiones silábicas; el motor no las puede juzgar.
