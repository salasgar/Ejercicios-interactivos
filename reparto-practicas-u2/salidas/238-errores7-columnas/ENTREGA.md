# ENTREGA · Tarea 238 · errores7, ejercicio 1 en columnas

Sesión: s-20261122T122731-0722f6b1 · commit del código: **bab276f**

## Ficheros
- `practicas/errores7/logica.js` — familias, rutas, `columnasPosibles`, `generarDonde` en columnas, distractores, `claveItem`.
- `practicas/errores7/textos.js` — textos del ej. 1, `explicacionColumnas`, `explicaDonde`, cuatro `REGLAS` nuevas; fuera «Todo está bien».
- `practicas/errores7/practica.js` — `montarDonde` con `columnasPulsables` y una pregunta por columna mala (calcado de errores3).
- `practicas/errores7/estilos.css` — fuera la regla muerta de «Todo está bien»; `.instruccion--siguiente`.
- `tests/practicas-errores7.test.js`, `tests/practicas-ayuda-errores7.test.js`.

## Qué hace el ejercicio 1
El mismo problema resuelto por 2-4 alumnos (1-2 columnas bien por caminos distintos, 1-2 mal con errores distintos; no se
dice cuántas). Se toca la línea mala de cada columna mala, «Comprobar», y una pregunta tipo test por columna mala (el nombre
bueno y dos de **otro tipo de problema**). Un solo `api.responder`; el primer fallo enseña la explicación de todas las columnas.

| Familia (peso) | Rutas buenas | Rutas malas (error del catálogo) |
|---|---|---|
| directa (3): «3 bolígrafos cuestan 6,00 €. ¿Cuánto cuestan 9?» | por el factor («el triple»); reducción a la unidad; regla de tres con x (como `regla-de-tres`) | `razonar-sumando`; `inversa-en-directa` («cuestan la tercera parte»); `contestar-otra-cosa` (da el precio de uno) |
| porcentaje (3): alumnos o euros | decimal (20 % = 0,2); `c : 100 · p`; `p · c : 100` en tres pasos | `porcentaje-entre-mil` (p ≥ 10), `porcentaje-entre-diez` (p < 10), `dividir-entre-el-porcentaje` (p ≥ 20), `porcentaje-sin-dividir` |
| descuento (2) | calcular el descuento y restarlo; «se paga el 100 % − 20 % = 80 %» | `restar-el-porcentaje-como-numero`, `descuento-por-precio-final`, `aumento-por-descuento` («se paga el 100 % + 20 %») |
| escala (1) | pasar a km al final; pasar antes a km lo que vale 1 cm | `escala-sin-cambio-de-unidad` |

10 rutas buenas y 11 malas. Cuatro errores del catálogo nuevos en esta práctica (sin plantilla, solo en columnas):
`inversa-en-directa`, `contestar-otra-cosa`, `porcentaje-sin-dividir`, `aumento-por-descuento`, con su regla en `REGLAS`.

Reparto real en 3000 ítems (semilla 21): **2 columnas 561 · 3 columnas 1476 · 4 columnas 963** (1+1 561, 2+1 867, 1+2 609,
2+2 963); familias: directa 1049, porcentaje 901, descuento 758, escala 292.

## Regla de oro y verdad de las líneas
- El test evalúa con un lector propio **cada igualdad** de las líneas en español («20 % de 150 = 150 : 100 · 20»,
  «150 000 cm = 1,5 km», «x = 6,00 € · 9 : 3 = 18,00 €»): todas verdad en las columnas buenas y en las malas salvo la línea
  mala; en los errores de cuenta, la línea mala tiene una igualdad falsa; en los de razonamiento es una frase falsa
  («así que cuestan 6,00 € más», «se paga el 100 % + 20 %», «Respuesta: 9 bolígrafos cuestan 2,00 €»). Cada columna acaba en
  el resultado calculado a mano (bueno o el de su error).
- Distractores: de otro tipo de problema (`CLASE_COLUMNA`) y nunca `contestar-otra-cosa`, `aumento-por-descuento` ni
  `inversa-en-directa` (nombres tan generales que podrían describir columnas de otro tipo: dar el descuento por el precio
  también es «contestar otra cosa»; 150 : 20 se podría leer como «resolverla como inversa»). `razonar-sumando` no va con
  `aumento-por-descuento` (ahí sí ha sumado). Guarda por si «20 % de 50 € = 20 €» saliera de un porcentaje mal calculado.

## Cotas de realismo (comprobadas en el test con los 3000 ítems)
- directa: las de `razonar-sumando` (de 2 a 5 unidades, hasta 30; cuaderno 2-5 €, bolígrafo 2-4 €, entrada 3-9 €, bocadillo 3-6 €).
- porcentaje: centro de 100 a 800 alumnos y clase que recauda de 100 a 800 €; del 2 al 80 %; **alumnos enteros y dinero al céntimo**.
- descuento: artículos de 20 a 150 €, del 10 al 60 %, precio final al céntimo.
- escala: **dos pueblos a 1-30 km** (la plantilla de los ej. 2 y 3 admite 0,2 km, que son dos casas: ver propuestas).

## Cambios fuera del ejercicio 1 (obligados por el test)
- El porqué de `porcentaje-entre-mil/diez` y de `dividir-entre-el-porcentaje` escribía «8 %» con espacio normal: ahora con
  `aTexto` (espacio duro en español, pegado en inglés). Lo ven también los ej. 2 y 3.

## Prueba en navegador
Chrome headless por CDP (script en /tmp, perfil temporal, cerrado en `finally`), `?probar=1&ejercicio=1`, a 375 y 1200 px, en
español e inglés: 64 ítems con 2, 3 y 4 columnas; acertando todo, marcando una columna buena, fallando una pregunta y «No lo
sé»; sin errores de consola ni desborde horizontal; el enunciado que se ve es el del ítem. **A 375 px sale una columna por
fila, no dos** (igual en errores3): ver propuestas.

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/errores7/?probar=1&ejercicio=1&idioma=es (y `idioma=en`).
`node --test tests/practicas-errores7.test.js tests/practicas-ayuda-errores7.test.js` (34 tests).

## Propuestas
1. CSS común (`practicas/_comun/estilos.css`, `.columnas`): `minmax(9.5rem, 1fr)` no cabe dos veces a 375 px (sobra ~1 px);
   con `minmax(9rem, 1fr)` irían dos por fila. Afecta a todas las «Caza el error» en columnas.
2. Plantilla `escala-sin-cambio-de-unidad` (ej. 2 y 3): «dos pueblos» a 0,2-0,9 km no es creíble; cota de 1 km o cambiar el
   contexto a «dos casas»/«dos tiendas» de un plano de ciudad cuando la escala es 1 : 10 000.
