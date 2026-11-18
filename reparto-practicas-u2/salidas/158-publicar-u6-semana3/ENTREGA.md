# ENTREGA tarea 158 · Revisión y publicación de la semana 3 de la unidad 6

**Al cierre de la segunda pasada (s-20261118T131928-cf1250cf, 18-11), LISTA**: publicadas `resuelve`, `parentesis-algebra` y
`denominadores` (08197e9). La semana 3 de la U6 está entera. Detalles en «Segunda pasada»; lo de debajo es la primera pasada, tal como se entregó.

## Segunda pasada (18-11, de 13:19Z a 13:32Z, s-20261118T131928-cf1250cf)

Commit: **08197e9**. `practicas/_comun/catalogo.js`: `disponible: true` en las ids 74, 75 y 76. `docs/practicas-unidad6.md`: el párrafo
«Semana 3» de §6 y la línea «**Publicadas**». `npm test` 2481/2481. Tests propios (comun, las tres prácticas y sus ayudas): 102/102.

Precondiciones comprobadas: las tres reabiertas de la primera pasada están cerradas LISTAS:
- 150 en 0289880 (s-20261118T090058-f9be4c5d);
- 151 en 421218b (s-20261118T090057-4da5731a);
- 152 en c00bd13 (s-20261118T091101-e7f14bb3).

Nada a medias en `catalogo.js` ni en `docs/practicas-unidad6.md` (su último commit era ba0a3ba, de la primera pasada). El papel de la U6
no ha cambiado desde la primera pasada: se volvió a leer y sale idéntico (hojas 1-4, exámenes 3 y 4 con sus extra, cuestionarios 3 y 4,
los cinco finales).

### Qué se ha revisado

Se usaron los mismos scripts de la primera pasada, que seguían en /tmp/pu2-158/, sobre el código de HEAD dcc3245.
- **Cotejo de casos**: 20000 ítems por ejercicio, con las mismas semillas (158001-158012) y la misma idea de «mismo caso» (cada miembro
  reducido, coeficientes exactos, miembros en cualquier orden). **0 casos** en los 12 ejercicios, comparando con:
  - las hojas 3 y 4;
  - el examen 3 y su extra;
  - el examen 4 y su extra;
  - los cinco finales.

  En `denominadores` también se hizo la comprobación término a término: 0 en los cuatro ejercicios.
  Lo único que sigue saliendo es lo que no se reserva, igual que en la 156 y la 157: los recuadros de ejemplo de las hojas y los
  cuestionarios Forms 3 y 4 (de 1 a 28 casos por ejercicio).
- **Regla de oro** (aritmética propia, 20000 ítems por ejercicio): **0 fallos**. Esto incluye el ej. 4 de `parentesis-algebra` con ecuación: ya
  no hay ningún ítem en el que la línea «equivocada» tenga la misma solución que la de arriba.
- **Variedad**: ningún ítem sale más del 0,53 % de las veces (`denominadores` ej. 1). En `parentesis-algebra`, los ej. 1 y 2 siguen generando
  unas 2600 expresiones distintas de cada 20000.
- **Clics** (CDP, ratón de verdad, Chrome sin ventana, sobre una copia de HEAD con `base.js` parcheado solo en la copia): los 4 ejercicios de
  cada práctica, en español y en inglés, a 375 y a 1100 px, con un ítem acertado y uno fallado. **48 de 48 recorridos bien**: sin errores de
  JavaScript, sin diálogos y sin desbordes horizontales. Un recorrido (`resuelve` ej. 4, es, 1100 px) se repitió porque el servidor de Python
  cortó la carga de `src/config.js`; en la repetición salió bien. Se leyeron los feedbacks de fallo a 375 px y se miraron las capturas.
  - `resuelve`: «−2 : (−2)» con paréntesis y raya.
  - `parentesis-algebra`: el ej. 4 va en tercera persona («Ha cambiado el signo…»).
  - El enunciado de `parentesis-algebra` ej. 4 ya no se parte después del «=».
- **Barrido de textos**: 3000 ítems por ejercicio, en todos los textos del ítem. Se ha buscado:
  - el guion del teclado como signo;
  - «: −» y «· −» sin paréntesis;
  - dobles espacios, «×» y punto decimal;
  - mayúscula tras los dos puntos.

  Solo sale lo de abajo.

### Resultado

| Práctica | Casos del papel | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `resuelve` (150, 0289880) | 0 en los 4 ejercicios | 0 fallos | 0,12 % | 16/16 | **publicada** |
| `parentesis-algebra` (151, 421218b) | 0 en los 4 ejercicios | 0 fallos | 0,29 % | 16/16 | **publicada**, con reabierta corta |
| `denominadores` (152, c00bd13) | 0 en los 4 (y 0 término a término) | 0 fallos | 0,53 % | 16/16 | **publicada** |

**Reabierta corta, que no despublica** (`hechos/reabiertas/151--s-20261118T131928-cf1250cf-revision.md`; MEDIO, ~10 min; antes del 1-2-2027).
En el ej. 4 de `parentesis-algebra`, cuando la línea no tiene error, el feedback dice «¡Bien! Está bien: En 6(3 + 3x)…», con mayúscula tras los
dos puntos; en inglés, «It is right: In…». La ayuda ya lo corrige, pero el feedback del ítem no. Se publica igual, como `traduce` en la 156,
porque es una mayúscula y la U6 no se ve en la portada hasta el 1-2-2027.

### Propuesta de la tarea semanal 3

Es el **plan A** de abajo, sin cambios, porque están publicadas las tres: 8 ★ + 2 a elegir, 100 puntos, con `['ortografia-puntuacion', 1]`.
Sale el lun 15-2 a las 8:00 y se entrega el jue 18-2 a las 23:59. Los planes B y C ya no hacen falta, salvo que se despublique alguna antes.

Sesión s-20261118T084149-af8e25f2 (18-11, de 08:41Z a 09:00Z). **PARCIAL: no se publica ninguna.** `resuelve` (150),
`parentesis-algebra` (151) y `denominadores` (152) se escribieron antes que la hoja 3 y el examen 3. Tienen las listas de reserva vacías y
sacan casos del papel en casi todos sus ejercicios. Las tres quedan **reabiertas**, y sus listas de reserva ya están calculadas.

Commit: ba0a3ba (`docs/practicas-unidad6.md`: las cotas de las tres en §6 y el párrafo «Semana 3»). `catalogo.js` no cambia: las tres
siguen con `disponible: false`, y la línea «**Publicadas**» de docs, también. `npm test` 2476/2476.

Precondiciones comprobadas: la 157 LISTA (b4d950f) y nada a medias en `catalogo.js` ni en `docs/practicas-unidad6.md`. La hoja 3 (tarea 08,
s-20261114T162910-dcad59f2) y el examen 3 (tarea 18, s-20261116T174612-2f9a1431) de la U6 están cerrados, sin reabiertas.

## Qué se ha revisado y cómo

Los scripts están en /tmp/pu2-158/. Llevan casos de examen en claro, así que no salen de /tmp, y /tmp se borra al reiniciar el Mac.

- **Cotejo de casos**: 20000 ítems por ejercicio, con semilla fija (158000 + n, de 158001 a 158012, en el orden resuelve,
  parentesis-algebra, denominadores). Se compara con lo que está en el papel:
  - los enunciados de la hoja 3 y de la hoja 4;
  - el examen 3 y su extra, el examen 4 y su extra (las líneas `\item`);
  - los cinco finales: modelo 1, modelo 2, ejemplo, adaptado-A y dislexia.

  «Mismo caso» quiere decir el mismo tipo (ecuación o expresión, con o sin paréntesis, con o sin denominadores) y la misma forma reducida:
  cada miembro reducido, con coeficientes exactos (BigInt) y los miembros en cualquier orden. Es la `clave()` de las prácticas, pero sin el
  orden de los miembros. Los recuadros de ejemplo de las hojas y los cuestionarios Forms se miran, pero no se reservan, como en la 156 y la 157.
- **Regla de oro**, con aritmética propia sobre lo que se enseña, en 20000 ítems por ejercicio. Se comprueba que:
  - en las opciones, solo la buena es equivalente (por solución o por valor) y no hay dos opciones iguales;
  - en los campos, la respuesta buena es exacta y ningún error reconocido da la respuesta buena;
  - en `resuelve` 4, solo el paso marcado rompe la equivalencia, y ninguno cuando no hay error;
  - en `parentesis-algebra` 4, «No hay error» se marca solo cuando la línea vale lo mismo que la de arriba.
- **Con clics** (CDP, `Input.dispatchMouseEvent`, Chrome sin ventana), sobre una copia de HEAD 10ce5d7 en la que `base.js` está parcheado
  solo en la copia: en los 4 ejercicios de cada práctica, en español y en inglés, a 375 y a 1100 px, un ítem acertado y uno fallado. Son 48
  recorridos, todos con el feedback esperado, sin errores de JavaScript, sin diálogos y sin desbordes horizontales. Los feedbacks de fallo se
  han leído a 375 px y se han mirado las 24 capturas.
- Tests: `node --test` de comun, las tres prácticas y sus ayudas, 110/110.

## Resultado

| Práctica | Casos del papel (por ejercicio: casos distintos · ítems de 20000) | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `resuelve` (150) | ej. 1: examen 3 1 · 1, examen 4 2 · 2 · ej. 2: hoja 3 2 · 21, hoja 4 1 · 1, examen 3 5 · 27, extra 2 · 6, examen 4 8 · 15, finales 3 · 8 · ej. 3: examen 3 2 · 4, examen 4 2 · 3, finales 1 · 1 · ej. 4: hoja 3 1 · 2, examen 3 3 · 5, examen 4 2 · 2 | 0 fallos | 0,12 % | bien | **reabierta** |
| `parentesis-algebra` (151) | ej. 1: hoja 3 17 · 359, examen 3 11 · 171, extra 6 · 69, examen 4 6 · 111, finales 2 · 6 (y hoja 4) · ej. 2: hoja 3 16 · 366, examen 3 11 · 181, extra 5 · 51, examen 4 5 · 93, finales 2 · 12 · ej. 3: hoja 3 4 · 13, finales 1 · 2 · ej. 4: hoja 3 17 · 252, examen 3 12 · 111, extra 5 · 37, examen 4 6 · 74 | 19 de 20000 en el ej. 4 con dos respuestas defendibles | 0,29 % | bien | **reabierta** |
| `denominadores` (152) | en los cuatro ejercicios: hoja 3 6-9 casos · 35-44 ítems, examen 3 5-8 casos · 140-233, extra 1 · 19-30, examen 4 6 · 34-49, finales 1-2 · 2-6, hoja 4 1 · 13-28 | 0 fallos | 0,49 % | bien | **reabierta** |

En `denominadores` hay una comprobación más estricta: la misma ecuación escrita término a término. Aun así salen 5 casos del examen 3 en cada
ejercicio (87-158 ítems de 20000).

## Reabiertas

Están en `hechos/reabiertas/`, con las listas de reserva ya calculadas en `hechos/notas/s-20261118T084149-af8e25f2-<slug>-reserva.txt`. La hoja
va en claro, con sus dos claves; los exámenes, solo como `huellaCanonica`. Se ha comprobado sobre 80000 ítems que la clave y la huella
coinciden con las que calcula la práctica. Arreglarlas es pegar las listas, ocuparse del orden de los miembros y añadir un test: MEDIO, cortas.

- **`150--s-20261118T084149-af8e25f2-revision.md`** (`resuelve`): 34 casos de las hojas y 146 huellas. Tiene dos detalles de notación en el
  feedback: «-3 : 6», con el guion del teclado, en el ej. 2, y «−5 : −7» en el ej. 3. Al final lleva una corrección añadida: los casos del ej. 2
  coinciden con pasos intermedios del papel («encuentra el error»), no con los repasos de la semana 2.
- **`151--…-revision.md`** (`parentesis-algebra`): 29 casos y 55 huellas. Los ej. 1, 2 y 4 solo generan unas 2600 expresiones distintas, así
  que un alumno ve casi seguro alguna del examen 3. Además:
  - en el ej. 4 con ecuación, 19 de 20000 ítems tienen la línea «equivocada» con la misma solución que la de arriba, y «No hay error» también
    vale;
  - en el feedback en español se mezclan personas: «Has multiplicado bien pero se ha equivocado…»;
  - en el ej. 4 el feedback dice «Has…», pero el error es de otro.
- **`152--…-revision.md`** (`denominadores`): 17 casos y 66 huellas. No tiene nada más.

Las tres tienen el reclamo libre: las puede atender cualquier sesión MEDIO. Cuando cierren, **una segunda pasada de la 158** repite el
barrido con las mismas semillas, mira la regla de oro del ej. 4 de `parentesis-algebra`, hace los clics sobre el código nuevo y publica. Los
scripts de /tmp/pu2-158/ sirven tal cual si el Mac no se ha reiniciado:
- `node papel.mjs`;
- `node barrido.mjs`;
- `node oro.mjs`;
- `python3 -m http.server 8458` en `arbol/` (con el parche de `base.js`) y `node clics.mjs resuelve parentesis-algebra denominadores`.

Si /tmp se ha borrado, el modelo es el de la 157 (`salidas/157-publicar-u6-semana2/ENTREGA.md`).

## Propuesta de la tarea semanal 3 (para Juan Luis; no está creada: la monta la 160 en el panel y la programa en Classroom la tarea 34 del reparto de la U6)

`U6 · Semana 3 · Ecuaciones con paréntesis y denominadores` / `U6 · Week 3 · Equations with brackets and fractions` · `unidad: 6` ·
`desde: '2027-02-15'` · `hasta: '2027-02-18'`. Sale el **lun 15-2 a las 8:00** y se entrega el **jue 18-2 a las 23:59**; la prueba 3 es el
vie 19-2. Sesiones: 9 el lun 15-2 (la x en los dos miembros), 10 el mar 16-2 (paréntesis) y 11 el jue 18-2 (denominadores).

Como en la 131, la 156 y la 157, lo de la sesión que se da **el mismo día** del plazo (la 11, `denominadores`) va «a elegir». Sus nucleares
(U6-3C-11 y 3C-12) pasan a ★ de repaso en la tarea 4. Los ★ de repaso de esta semana son los nucleares de la sesión 7, que en la tarea 2
fueron «a elegir»: U6-2C-09 y 2C-11.

El ★ de ortografía es `['ortografia-puntuacion', 1]`, «Mayúsculas». Es el de la ficha y el de `docs/practicas-ortografia.md`, y está publicado
desde la 141 (9d51347). La ENTREGA de la 140 lo había cambiado por `['ortografia-letras', 1]` porque entonces no estaba publicado; ese cambio
ya no hace falta. Cada ejercicio vale 10 puntos.

### Plan A (con las tres publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-puntuacion', 1]` Mayúsculas | — (ortografía) |
| ★ | `['resuelve', 1]` El primer paso | U6-3C-01, 3C-02 nucleares (9) |
| ★ | `['resuelve', 2]` Paso a paso | U6-3C-01, 3C-02 nucleares (9); 2C-12 |
| ★ | `['resuelve', 3]` Resuélvela | U6-3C-01, 3C-02 nucleares, 3C-03 (9) |
| ★ | `['parentesis-algebra', 1]` Quita el paréntesis | U6-3C-06, 3C-07 nucleares, 3C-08 (10) |
| ★ | `['parentesis-algebra', 3]` Resuelve con paréntesis | U6-3C-09 nuclear, 3C-10 (10) |
| ★ | `['transposicion', 3]` Dos operaciones, paso a paso (repaso) | U6-2C-09 nuclear (7) |
| ★ | `['transposicion', 4]` 3x = 12 frente a 12x = 3 (repaso) | U6-2C-11 nuclear (7) |
| elegir | `['resuelve', 4]` ¿Está bien resuelta? | U6-3C-05 (9) |
| elegir | `['parentesis-algebra', 2]` ¿Cuál es el desarrollo? | U6-3C-06, 3C-07 nucleares (10) |
| elegir | `['parentesis-algebra', 4]` Caza el error | U6-3C-06, 3C-07, 3C-09 (10) |
| elegir | `['denominadores', 1]` ¿Por cuánto multiplico? | U6-3C-11 nuclear (11) |
| elegir | `['denominadores', 3]` Resuélvela | U6-3C-11, 3C-12 nucleares (11) |
| elegir | `['denominadores', 4]` Paso a paso | U6-3C-11, 3C-12 nucleares (11) |

### Plan B (si falta una el jue 11-2)

- **Sin `denominadores`**: el plan A tal cual, porque solo estaba en «a elegir». Quedan para elegir `['resuelve', 4]` y
  `['parentesis-algebra', 2]` y `4`.
- **Sin `parentesis-algebra`**:
  - ★: la ortografía, `['resuelve', 1]`, `2`, `3` y `4`, `['transposicion', 3]`, `4` y `5`, Comprueba y corrige (U6-2C-07 y 2C-08,
    nucleares). Son 8.
  - A elegir: `['denominadores', 1]`, `3` y `4`; sin `denominadores`, `['es-solucion', 3]` y `4`.
  - Los paréntesis (sesión 10) se quedan sin práctica esa semana: se avisa.
- **Sin `resuelve`**:
  - ★: la ortografía, `['parentesis-algebra', 1]`, `2`, `3` y `4`, `['transposicion', 3]`, `4` y `5`. Son 8.
  - A elegir: `['denominadores', 1]`, `3` y `4`; sin `denominadores`, `['es-solucion', 3]` y `4`.
  - La x en los dos miembros (sesión 9) se queda sin práctica, aunque es la base de las otras dos: se avisa.

### Plan C (sin dos de las tres, o sin ninguna)

No vale la pena como tarea de la semana 3. Se manda:
- la ortografía;
- el repaso de la semana 2: `['transposicion', 3]`, `4` y `5` y `['es-solucion', 1]` y `2` como ★, y `['es-solucion', 3]` y `4` a elegir;
- lo que haya publicado de la semana 3, a elegir.

Y se avisa.

Si el lun 15-2 están publicadas las tres, plan A; si falta alguna, el plan que toque.

## Hallazgos fuera de criterio (para Juan Luis)

- **Cuestionarios Forms**: los generadores sacan casos de los cuestionarios 3 y 4. En `parentesis-algebra` son 15 expresiones en los ej. 1, 2 y
  4; en `denominadores`, de 6 a 9 ecuaciones por ejercicio. Como en la 156 y la 157, no se reservan porque no son examen. Si quieres que se
  reserven, se puede, igual que la hoja.
- **El ejemplo resuelto de la hoja 3**, `x/4 + x/6 = 10` (recuadro), sale en 52-71 ítems de cada 20000 en los ej. 1, 3 y 4 de
  `denominadores`. Es un ejemplo ya resuelto en la hoja y no se reserva (fuera de criterio, como en la 156 y la 157).
- `parentesis-algebra` genera pocas expresiones distintas en los ej. 1, 2 y 4 (unas 2600 de cada 20000 ítems). Con la reserva puesta,
  bajan muy poco (55 huellas y 29 claves). No se repite ninguna más del 0,3 %, así que la variedad cumple, pero conviene saberlo.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/resuelve/?probar=1 (y `parentesis-algebra/`, `denominadores/`), con «Probar sin código».
La portada no enseña la U6 hasta el 1-2-2027 (`UNIDADES.desde`).
