# Entrega de la tarea 195 · Publicar `lee-decimales`, `compara-decimales`, `suma-resta-decimales` y `multiplica-divide-decimales` (U5)

Sesión `s-20261113T170133-3d38e018` (Opus 5.5, ALTO), 2026-11-13, encadenada tras cerrar la 190 (revisión del «No lo sé» de estas
cuatro, entre otras). Commit del código: **b483ad7** (`catalogo.js`, `registro.js`, `docs/practicas-unidad5.md`).

## Resultado

| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `lee-decimales` (123, 57) | **pasa**: 0 casos del papel en la misma tarea; regla de oro, clics y feedback bien | **PUBLICADA** · bloque «Semana 1» desde el 18-1 |
| `compara-decimales` (124, 58) | **pasa** (tras sus dos reabiertas del 8-11 y el 9-11) | **PUBLICADA** · «Semana 1» |
| `suma-resta-decimales` (125, 59) | **pasa** | **PUBLICADA** · «Semana 1» |
| `multiplica-divide-decimales` (126, 60) | **pasa** (tras su reabierta del 8-11) | **PUBLICADA** · «Semana 2» desde el 18-1 |

Con esto están publicadas **las siete** prácticas de la U5. La portada no enseña la U5 hasta el lun 18-1 (`UNIDADES.desde`), así que
hoy no las tiene delante ningún alumno; se llega a ellas por URL. Ninguna se reabre.

Además, por la propuesta 1 de la 131: el §7 de `docs/practicas-unidad5.md` y `DESTREZAS` de `practicas/_comun/registro.js` dicen ya que
**U5-2C-14 y U5-2C-15** (las combinadas) las trabaja `multiplica-divide-decimales` (su ej. 6, desde el 6-11). `registro.js` no está en la
lista literal de ficheros de la ficha, pero la ficha manda cambiar «el §7 con `registro.js`» y `tests/practicas-registro.test.js` exige
que coincidan: es una línea, en la fila de `multiplica-divide-decimales`.

## Cómo se revisó

### 1. El papel (barrido propio, guiones en el scratchpad de la sesión, nunca en el repo)
- **El papel no ha cambiado desde el barrido de la 130 y la 131**: el único commit en esas carpetas desde el 8-11 es 93cd37d (9-11), que
  solo cambió el comentario «Se compila con» al renombrar los `.tex`; `find -newermt '2026-11-09 18:15'`, vacío.
- **Qué se lee**: las dos claves (`casos-examen-semana{1,2}.tsv`: 240 filas, enunciado y respuesta, seis variantes por posición), las
  hojas 1 y 2 troceadas por apartado y **sin los recuadros de apoyo** (más a mano lo que la hoja 1 escribe con palabras y las flechas de su
  recta), y los cinco `.tex` del final (modelos 1 y 2, recuperación, adaptado-A y dislexia), por apartado y por pregunta entera. Los
  números escritos con palabras en los enunciados («Three friends…») y las fracciones decimales («n/100 as a decimal») se convierten.
  Comprobado que la clave cubre los cuatro `.tex` de los exámenes semanales (normales y extra, 2160 ítems): todo número de sus enunciados
  está en la clave (lo que queda fuera son las opciones del tipo test).
- **Antes de fiarme de los ceros**, la lista que cada práctica ya reserva, pasada por mi lector (recalculando sus huellas con su propia
  función): `lee-decimales` 31 de 31; `compara-decimales` parejas 26/26, conjuntos 15/15, redondeos 51/51; `suma-resta-decimales` 64/64;
  `multiplica-divide-decimales` 68/85. Las 17 de esta última que mi lector no reproduce son, por lo que pedía su reabierta, combinadas y
  problemas que la 126 escribió con su propio formato (los problemas van en palabras en el papel); reserva de más, no de menos. Para
  cubrir ese hueco, el barrido mira también si una combinada del ej. 6 lleva todos los números de un mismo problema del papel: 0.
- **20000 ítems por ejercicio** (18 ejercicios, idioma alterno), con la tarea de cada caso (por la destreza en los exámenes; por el
  enunciado del ejercicio en hojas y finales). Cuenta la misma tarea con los mismos datos: el mismo decimal en leer, valor de una cifra,
  fracción decimal, recta y redondeo; la misma pareja (sin orden) en comparar y en «entre»; tres o más valores de un mismo conjunto en
  ordenar; la misma cuenta entera en los cálculos (sumas y restas con signo y sin orden, productos sin orden, divisiones con orden,
  combinadas tal cual o con los mismos números y operaciones); todos los datos de un problema dentro de un mismo problema del papel.

  | Práctica · ejercicios | Examen 1 | Examen 2 | Hojas | Final | Ítem más repetido |
  |---|---|---|---|---|---|
  | `lee-decimales` 1 · 2 · 3 · 4 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0,77 % · 0,36 % · 0,15 % · 0,16 % |
  | `compara-decimales` 1 · 2 · 3 · 4 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0,30 % · 0,01 % · 0,13 % · 0,18 % |
  | `suma-resta-decimales` 1 · 2 · 3 · 4 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0,01 % · 0,04 % · 0,12 % · 0,07 % |
  | `multiplica-divide-decimales` 1-6 | 0 en los seis | 0 en los seis | 0 en los seis | 0 en los seis | ≤ 0,13 % en los seis |

  Lo que el barrido marcó y se descartó a mano (no es la misma tarea con los mismos datos): un decimal que es la *respuesta* de un caso y
  no su número (el valor de una cifra, un redondeo); una pareja de un número consigo mismo (el caso «iguales»); un conjunto que comparte uno
  o dos valores; parejas de un ejercicio de *ordenar* usadas en «entre»; problemas con uno o dos números en común y datos distintos; cambios
  de unidad que mueven la coma en el otro sentido o por otra potencia. **Variedad**: ningún ejercicio pasa del 1 % (el umbral es el 10 %).

### 2. Regla de oro y realismo
- 3000 ítems por cada ejercicio con opciones (12, contando los dos idiomas de `lee-decimales` 1), comparando **por valor**: una sola
  correcta y ningún distractor del mismo valor (en la fracción decimal, ninguna otra fracción decimal equivalente). **0 problemas.**
- Leídos a mano 30 ítems por ejercicio con todos sus distractores, y repasadas una docena de cuentas: cada distractor es otro valor y
  responde a un error con nombre; en las lecturas, ninguna otra lectura válida del mismo número entre las opciones.
- Cotas del acta en 3000 ítems: fruta 0,5-5 kg a 0,80-6,00 €/kg; gasolina 5-70 L a 1,20-2,00 €/L; en el súper, importes de fruta de
  0,50 a 15 € y de gasolina de 6 a 47,99 €; medidas creíbles (estaturas hasta 2,10 m, botellas de 1 a 2 L, paquetes de hasta 30 kg).

### 3. Navegador (Chrome headless por CDP, clics de ratón con `Input.dispatchMouseEvent`, nunca Intro)
- `?probar=1&ejercicio=N&idioma=es|en`, «Empezar», servidor local. Para acertar a propósito, el `logica.js` de cada práctica se sirve
  envuelto **solo en el navegador** (interceptado con `Fetch`, sin tocar el disco) para que cada `generar*` deje su ítem a la vista.
- **Los 18 ejercicios, a 375 y a 1200 px, en español y en inglés (72 combinaciones), un ítem acertado y uno fallado en cada una**:
  72 aciertos dados por buenos y 72 fallos dados por malos; la recta de `lee-decimales` 4 también en su modo «tocar» (4 combinaciones
  más). Todos los feedback de fallo hablan de los números del ítem (rehacen la cuenta, nombran el error); coma en español y punto en
  inglés; nada desborda; **consola limpia** en todas.
- **«No lo sé»**: las cuatro prácticas se probaron esta misma tarde en la 190 (cierre 70e06bb), sobre los mismos commits que se publican:
  cada ejercicio a 375 y 1200 px con cuatro ayudas seguidas, tarjeta, ítem inerte, aviso de la tercera ayuda, ítem siguiente distinto,
  sin desbordes ni errores. No se ha repetido.
- `npm test`: **2154/2154**.

## Las dos propuestas de tarea semanal, al día (para Juan Luis; las monta la 132 en el panel)

**Valen tal cual las dos, en su plan A** (todo lo que citan está publicado desde hoy):

- **Semana 1** (propuesta de la 130, ENTREGA de la 130): `U5 · Semana 1 · Leer, comparar, redondear y sumar decimales`, del lun 18-1 al
  jue 21-1, entrega **jue 21-1 a las 23:59**. 7 ★ (`['ortografia', 8]`, `lee-decimales` 1, 2 y 3, `compara-decimales` 1, 2 y 4) + 3 a
  elegir entre seis (`lee-decimales` 4, `compara-decimales` 3, `suma-resta-decimales` 1-4) = 10 ejercicios, 10 puntos cada uno, 100.
- **Semana 2** (propuesta de la 131): `U5 · Semana 2 · Multiplicar, dividir, fracciones y decimales`, del lun 25-1 al mié 27-1, entrega
  **mié 27-1 a las 23:59** (el final es el jue 28-1). 8 ★ (`['ortografia', 9]`, `multiplica-divide-decimales` 1-4, `fraccion-decimal` 1,
  `suma-resta-decimales` 1 y 4) + 2 a elegir entre diez = 10 ejercicios, 100.
- La ortografía coincide con el calendario del curso (`comun/CALENDARIO-CURSO-2026-27.md`: 8 «¿Lleva tilde?» en U5 · 1 y 9 «Tilde
  diacrítica» en U5 · 2) y `ortografia` está publicada (id 45, 11 ejercicios).
- **`leelo5` y su reabierta del 13-11** (129, el ej. 3 «La consigna» enseña el marcado HTML en sus opciones): la semana 2 usa sus ej. 2 y 4,
  no el 3, así que la propuesta no depende de que cierre. Si no ha cerrado el 18-1, el fallo lo verá quien abra el ej. 3 por su cuenta.
- Los bloques `estrella`, `elegir` y `nElegir` están literales en las ENTREGA de la 130 y la 131, y no cambian.

## Hallazgos fuera de criterio (para Juan Luis; ninguno impide publicar)

1. **Hoja 2, «Right or wrong?», apartado d)**: es una cuenta **bien hecha** que el alumno tiene que juzgar, y el ej. 5 de
   `multiplica-divide-decimales` (problemas de fruta) la pide como problema con los mismos números en 19 de 20000 ítems. No reabro: es el
   caso de «una opción que está bien de un "¿cuál está mal?"», que el criterio deja fuera. Si lo quieres reservado, es una entrada más en
   `PRODUCTOS_HOJA` (reabierta corta de la 126). Las líneas *mal* hechas de ese ejercicio no salen en ninguna práctica.
2. **Examen 1, U5-1A-02, variante 3**: un ítem de «Medidas» (`suma-resta-decimales` 3) salió **una vez en 20000** con los mismos tres
   números de la botella del examen, colocados de otra forma: lo que el examen pide es un dato del ítem y al revés. No es la misma cuenta ni
   la misma pregunta; lo digo por si lo prefieres reservado (sería una huella más en la 125).
3. **`lee-decimales`, comillas españolas en inglés**: el feedback del ej. 1 pone la lectura elegida entre «» también en inglés («The digits of
   «seven point eight seven» are in a different order…»), y el enunciado del sentido «cifras» enseña la lectura entre «» en los dos idiomas.
   Está escrito a mano en `practica.js` (líneas 66 y 78), no en `textos.js`, así que esta tarea no lo toca. Arreglo: `“…”` en inglés, como
   ya hacen `se_lee` y `lectura_dice` de `textos.js` (reabierta corta de la 123, o con la próxima que toque la carpeta).
4. Ya dichos por la 190 y vistos otra vez en los clics, sin cambios: «1 decimal places» en `multiplica-divide-decimales`, «the thousandth
   digit» en `compara-decimales` (mejor «thousandths digit»).
5. **Sin ejercicio en la app** (no cambia nada): U5-1A-03, U5-1A-04, U5-1C-02, U5-1C-12, U5-2A-04, U5-2C-13 y U5-2C-16, como dice el §7.

## Cómo comprobarlo en un minuto
`grep -n "unidad: 5" practicas/_comun/catalogo.js` (las siete con `disponible: true`); `npm run servir` →
`http://localhost:8080/practicas/multiplica-divide-decimales/?probar=1&ejercicio=6` → «Empezar».
