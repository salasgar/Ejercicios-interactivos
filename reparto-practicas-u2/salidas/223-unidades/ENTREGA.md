# ENTREGA · Tarea 223 · «Cambia de unidad» (unidades, U7)

Sesión: s-20261123T124757-9c1c5c78. Commit del código: **bf357e1**. F0 de la U7 sin firmar: se ha hecho con el acta (`inventario-unidad7-revision.md`, puntos n y o), que manda sobre la ficha.

## Qué dice el acta y qué se ha hecho
- Dentro: longitud, masa y capacidad con la escalera completa y la tonelada (`U7-4C-04..08`). Nucleares: km, m, cm, mm; t, kg, g; L, mL. No nucleares: dam, hm, dag, hg, daL, hL (más dL, cL, kL, mg). Complejo e incomplejo. Símbolos SI siempre.
- **El tiempo entra** (horas y minutos, sesión 18, punto o, `U7-4C-10`): horas 0,25 / 0,5 / 0,75 / 1,5 / 2,25 y minutos enteros.
- Fuera: **superficie y hectárea (a la U8)**, volumen, litro-dm³ y unidades agrarias.
- Desviaciones de la ficha/catálogo: el ej. 3 es «Horas y minutos» (la ficha decía superficie). `catalogo.js` no se ha tocado: su nombre y detalle del ej. 3 hay que cambiarlos en la 228/230.

## Ficheros
`practicas/unidades/{logica.js, textos.js, practica.js, estilos.css, index.html}`, `tests/practicas-unidades.test.js` (3000 ítems por ejercicio, semilla fija, segundo camino con BigInt) y `tests/practicas-ayuda-unidades.test.js` (1000 por ejercicio e idioma). No se ha tocado nada más; `disponible` sigue en `false`.

## Los cinco ejercicios
1. **Longitud** (campo): 1-3 saltos, dato de 0-2 decimales, resultado de ≤3 decimales entre 0,01 y 9999. Errores nombrados: subir por bajar, salto de más o de menos, número sin cambiar.
2. **Masa y capacidad** (4 opciones): la mitad de los ítems lleva unidad no nuclear; sale la tonelada. Cuatro valores distintos por `mismoValor`.
3. **Horas y minutos** (4 opciones): h→min y min→h; errores: «cien en vez de sesenta» y horas y minutos pegados.
4. **Complejo e incomplejo** (campo, tres formas a / b1 / b2): la parte pequeña siempre es menor que un salto; errores: pegar cifras, sumar sin pasar, decimal como unidad pequeña, total sin quitar, cociente en vez de resto.
5. **¿Qué unidad?** (4 opciones): 24 casos (8 por magnitud) con intervalo creíble `[lo, hi]`; una unidad falsa solo vale si queda a menos de lo/5 o a más de 5·hi; todas las magnitudes con ≥3 falsas.

«No lo sé» en los cinco (texto «No sé hacerlo» en el 1 y el 4); la explicación acaba en «La respuesta es …» / «The answer is …».

## Reserva anti-copia
`CASOS_HOJA = []` y `HUELLAS_EXAMEN = new Set([])` **vacíos**: la hoja y el examen del paquete 4 no existen aún. `esReservado` está conectado en los cinco generadores y tiene test; la 230 solo tiene que rellenarlos (clave `cambio|mag|de|a|num/den`, FNV-1a con `huella`; en el ej. 5, `sensata|<id>`).

## Tests
Propios 18/18 (3 ejercicios con segundo camino, errores, variedad ≤10 %, reserva, textos); con `practicas-comun` y `practicas-no-lo-se` en verde; `npm test` 2793/2793.

## No comprobado
- **Sin navegador con clics** en esta sesión (automática): no se ha probado a 375 px ni con ratón. Se han leído a mano enunciados y explicaciones en es y en de los generadores y los 24 casos del ej. 5 (realismo). **Falta pasarla una vez a mano** (acertar, fallar, «No lo sé», es/en) antes de que la 230 ponga `disponible:true`.

## Para Juan Luis
- Si al firmar F0 el tiempo se quedara fuera de esta práctica, el ej. 3 se quita sin tocar el resto (`generarTiempo` y su test).
- Longitud: las parejas con unidades nucleares salen en ~13 % de los ítems del ej. 1 (el resto lleva dam, hm o dm); se puede subir si quiere más cercanía a km-m-cm-mm.
