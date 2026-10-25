# Entrega de la tarea 96 · Revisión y publicación de la semana 4 de la unidad 3 (y cierre de la documentación)

Sesión `s-20261025T213350-78771150`, 2026-10-25 (encadenada tras la 94 y la 95). Commit del código: **dfc97ae**.

## En una línea

**Publicada `errores3` (89). Reabierta (sin publicar): `variacion` (90)**: en el ejercicio 2, dos temperaturas «de hoy» que no se dan el
mismo día («Hoy hay −4 °C en Moscú y 28 °C en Murcia»). **Escrito lo que la 79 dejó «por escribir»** en `docs/practicas-unidad3.md`
(§1, 2, 3, 5, 6 y 8, y la nota del año 0 en §7) y **la sección de la unidad 3 en el `README.md`**.

Con esto quedan publicadas **diez de las doce** prácticas de la U3, más la ortografía. Faltan `dos-signos` (84, reabierta por la 94; la
necesita la semana 2) y `variacion` (90; la necesita la semana 4). **Ya no queda ninguna tarea de publicación que pueda ponerles
`disponible: true`**: ver «Para Juan Luis».

## Ficheros (git show --stat dfc97ae)
- `practicas/_comun/catalogo.js`: `disponible: true` de `errores3` (solo ese campo).
- `docs/practicas-unidad3.md`: §1 (qué ve el alumno), §2 (cómo lee el profesor los errores típicos), §3 (`enteros.js` y `recta-enteros.js`),
  §5 (cómo se añade una práctica de la U3), §6 (las doce prácticas: ejercicios y cotas), §7 (nota de U3-4C-05 al día: el año 0 ya está
  decidido) y §8 (dónde está lo demás). La tabla de destrezas (§7) no se ha tocado: `tests/practicas-registro.test.js` sigue en verde.
- `README.md`: sección «Prácticas de la unidad 3», con la tabla de las doce y el enlace a `docs/practicas-unidad3.md`.

`npm test`: 1166/1166.

## Qué se ha revisado y cómo
- **`errores3`**: lógica leída y 14 ítems por ejercicio, uno por plantilla. En «¿Dónde está el error?» la única línea falsa es la marcada.
  Las que agrupan o adelantan un paso sin cambiar el valor (`−7 − 3 + 2 + 1 = −7 − 3 + 3`) son buenas, con la regla de Juan Luis del
  8-10. En «¿Qué error es?» los dos distractores son de otro grupo de errores (`GRUPOS`), y ningún nombre ajeno describe el cálculo malo.
  En «¿Error o no?» las parejas válidas tienen su gemela con error. Navegador (375 px, es) con clics: acierto y fallo de los tres
  ejercicios; feedback con la línea, el nombre del error, el porqué con los números del ítem y «Bien hecho sería…».
- **`variacion`**: lógica y textos leídos. Navegador con clics en los ej. 1, 3, 4 y 5. El año 0 sigue la regla de la hoja 4 de Juan Luis
  («subtract and take away 1»): 1275 a. C. → 1948 d. C. = 3222, con la explicación paso a paso. El ej. 5 pide el cambio con signo
  («¿Cuánto cambia en total?»), así que `4 · 3` frente a `4 · (−3)` no son dos respuestas buenas. Solo falla el realismo del ej. 2.
- **Lo de la sesión 13 de prácticas ya publicadas**, que entra en esta semana: `jerarquia-enteros` 4 (combinada `3² + 6 · 7`, paso a paso
  con clics, acierto) y `parentesis-enteros` 3, 4 y 5 (las dos cuentas de `(−4 · 3)²` / `−4 · 3²`; de dentro afuera con corchetes;
  «coloca los paréntesis» acepta cualquier colocación que dé el resultado). Sin desbordes y sin errores de consola.

## Por qué se reabre la 90 (detalle en `hechos/reabiertas/90--s-20261025T213350-78771150-revision.md`)
`PARES` del ej. 2: Burgos −12…8 °C con Málaga 10…30 °C y Moscú −25…3 °C con Murcia 8…35 °C, en «Hoy hay … en … y … en …». −25 °C es de
invierno y 35 °C de verano: no pasan el mismo día. Es lo mismo que la 93 reabrió en `leelo3` ej. 4. Arreglo corto (cotas de un mismo día
de invierno y su test), banda MEDIO.

## Propuesta de la tarea de la semana 4 (para que Juan Luis la monte en el panel; no está creada)

`U3 · Semana 4 · Problemas, errores típicos y combinadas` / `U3 · Week 4 · Word problems, common mistakes and combined operations`
· `unidad: 3` · `desde: '2026-12-07'` · `hasta: '2026-12-10'` (el 7 y el 8 son festivos: en la práctica, del miércoles 9 al jueves 10;
el examen final es el vie 11-12).
**5 ★ + 5 a elegir = 100 puntos** (la ortografía es uno de los ★: el resto suma 90).

| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 4]` «¿Está bien escrita?» | — (decisión del 23-10) | sí |
| ★ | `['errores3', 1]` ¿Dónde está el error? | U3-3C-19, 4A-05 (11-13) | sí |
| ★ | `['errores3', 2]` ¿Qué error es? | U3-4C-08 nuclear, 2C-21 (12) | sí |
| ★ | `['variacion', 1]` ¿Cuánto ha cambiado? | U3-4C-02 y 4C-07 nucleares (12) | **tras la reabierta** |
| ★ | `['variacion', 5]` Del enunciado a la cuenta | U3-4C-01, 4C-10, 3C-21 (9, 12) | **tras la reabierta** |
| elegir | `['jerarquia-enteros', 4]` Combinadas | U3-4A-01 y 4A-02 nucleares (13) | sí |
| elegir | `['parentesis-enteros', 3]` ¿Al paréntesis o al número? | U3-4A-03 nuclear, 4A-06 (13) | sí |
| elegir | `['parentesis-enteros', 4]` De dentro afuera | U3-4A-07 (13) | sí |
| elegir | `['parentesis-enteros', 5]` Coloca los paréntesis | U3-4A-04 (13) | sí |
| elegir | `['errores3', 3]` ¿Error o no? | U3-4C-09 (12) | sí |
| elegir | `['variacion', 2]` La diferencia | U3-4C-03 (12) | **tras la reabierta** |
| elegir | `['variacion', 3]` El dato que falta | U3-4C-04 (12) | **tras la reabierta** |
| elegir | `['variacion', 4]` Antes y después de Cristo | U3-4C-05 (12) | **tras la reabierta** |
| elegir | `['leelo3', 4]` Palabras y símbolos | U3-4B-01, 4B-02 (12-13) | sí |

`nElegir: 5` (9 en la lista).

```js
  estrella: [['ortografia', 4], ['errores3', 1], ['errores3', 2], ['variacion', 1], ['variacion', 5]],
  elegir: [['jerarquia-enteros', 4], ['parentesis-enteros', 3], ['parentesis-enteros', 4], ['parentesis-enteros', 5], ['errores3', 3], ['variacion', 2], ['variacion', 3], ['variacion', 4], ['leelo3', 4]],
  nElegir: 5,
```

Criterio: es la semana del examen final, con dos días festivos. Los ★ son lo de la sesión 12 (vie 4-12): la tabla de errores típicos y los
problemas. Lo de la sesión 13 (combinadas con corchetes) se da el jueves 10, el mismo día del plazo, así que va en «a elegir», como en las
semanas anteriores. **Alternativa**, si quieres que las combinadas sean obligatorias por el examen del viernes: `jerarquia-enteros` 4 y
`parentesis-enteros` 3 a ★ en lugar de `variacion` 5 y `errores3` 1 (sigue sumando 100).

**Plan B, si `variacion` no está publicada el jueves 3-12**: ★ `['ortografia', 4]`, `['errores3', 1]`, `['errores3', 2]` y
`['saltos', 5]` (repaso de los problemas de varios movimientos, U3-2C-04); a elegir los 6 que quedan (`jerarquia-enteros` 4,
`parentesis-enteros` 3, 4 y 5, `errores3` 3, `leelo3` 4), `nElegir: 6` → 100 puntos. Sin `variacion`, U3-4C-02 y 4C-07 (nucleares)
quedan sin práctica en la semana.

- **Destrezas nucleares de la semana sin práctica: ninguna** (con `variacion` publicada). Las 6 (4A-01, 4A-02, 4A-03, 4C-02, 4C-07 y 4C-08)
  tienen al menos un ejercicio en la lista; 4A-01 («qué va primero» en una combinada) se trabaja en `jerarquia-enteros` 4, que pide tocar la
  operación antes de cada paso (el ejercicio 1 de esa práctica ya no lleva combinadas).
- Validadas con `erroresTareas` (las dos versiones): sin errores, 100 puntos.

## Para Juan Luis
1. **Dos prácticas reabiertas sin nadie que las publique** (las cuatro tareas de publicación están cerradas):
   - `dos-signos` (84): el «Comprobar» del ej. 3 no responde al clic. **Para la semana 2: publicada antes del jue 19-11.**
   - `variacion` (90): ciudades del ej. 2. **Para la semana 4: publicada antes del jue 3-12.**
   Cada una necesita una sesión MEDIO que la arregle (frases en mi último mensaje) y, después, alguien que la verifique y ponga
   `disponible: true`: o una tarea de publicación nueva que dé de alta la coordinadora (ALTO, corta), o que tú autorices a la sesión
   que la arregla a publicarla ella si su prueba en navegador con clics sale bien.
2. Las cuatro propuestas de tarea (semanas 1 a 4) están en las ENTREGAS de la 93, la 94, la 95 y esta.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/errores3/ («Probar sin código»). `npm test`. Leer `docs/practicas-unidad3.md` §6.
