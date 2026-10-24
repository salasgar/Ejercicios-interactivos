# Entrega · Tarea 92 · Generador `enteros` al día con la unidad 3

Sesión `s-20261024T224222-ff835dd0` · commit `57f0a14`

## Ficheros
- `src/ejercicios/enteros.js` (reescrito): 12 subtipos, cada uno con sus `items` del inventario de la unidad 3; el módulo exporta `items`, `subtipos` y `SUBTIPOS` (como `divisibilidad.js`). El nombre del tipo sigue siendo `enteros`.
- `tests/enteros-items.test.js` (nuevo): 15 tests; 3000 ítems por subtipo.

## Subtipos y destrezas
| Subtipo | Ejemplo | items |
|---|---|---|
| resta_naturales | `1 - 13` | U3-1C-11 |
| negativo_mas_positivo | `-10 + 6` | U3-1C-12 |
| negativo_menos_positivo | `-13 - 3` | U3-1C-13, U3-2C-21 |
| cadena_corta | `-3 + 8 - 2` | U3-1A-01 |
| cadena_larga (4-6 términos) | `-6 + 5 - 4 + 8 - 9` | U3-2A-01, U3-2C-01 |
| suma_negativo | `7 + (-9)` | U3-2C-05 |
| resta_negativo | `14 - (-11)` | U3-2C-06 |
| negativo_menos_negativo | `-2 - (-9)` | U3-2C-06 |
| dos_signos | `-(-6)`, `+(-2)`, `-(+6)` | U3-2C-07 |
| quitar_parentesis | `(-2) - (+6) + (-4) - (-9)` | U3-2C-08 |
| producto | `(-2) \cdot (-3)` | U3-2C-15 |
| cociente | `(-36) \div (-9)` | U3-2C-18 |

## Qué cambia respecto a lo anterior
- Las primeras formas (sesiones 2-3) **no llevan ningún paréntesis**, ni de un número ni de una operación: antes eran `(−a) − b` y `(−a) + b`. El test lo comprueba en las cinco formas de ese grupo.
- Quitado de **todos los pasos** el `-(a + b)` (paréntesis que envuelve una operación, de la sesión 11): ahora «`-10 - 2 = -12`» con el cálculo `10 + 2 = 12` al lado.
- Distractores = errores típicos del inventario, calculados con los números del ítem: restar al revés (3 − 5 = 2), `-5 + 3 = -8`, regla de los signos en una suma (`-2 - 3 = +5`), `5 - (-3) = 2`, operar de derecha a izquierda (`2 - 4 + 3 = 2 - 7`), perder el signo del primer término, `13 - 19 = 6`, `(-2)·(-3) = -6`, `5·(-2) = 3`, `-(-9) = -9`, `-(+6) = +6`, etc. Siempre se baraja el pool y se recortan tres (`tresDe`), sin repetidos ni la correcta.
- El producto ya no saca dos positivos; el cociente es exacto y con al menos un negativo.

## Escritura
- El menos que se ve es el de KaTeX en modo matemático (`tex()` deja `-` ASCII, y KaTeX lo compone como U+2212): no hace falta tocar `tex`.
- Producto con `\cdot`, nunca `\times`; cociente con `\div` (la app lo pasa a `:` en español). Test: ni `×`, ni letras, ni `+n` como resultado, ni dos signos seguidos sin paréntesis.
- Sin cotas de realismo: no hay contextos, solo cuentas.

## Cómo probarlo en 1 minuto
```bash
npm test                                  # 975/975
node --test tests/enteros-items.test.js   # 15 tests propios
node -e "import('./src/ejercicios/index.js').then(({TIPOS,crearRng})=>{for(let s=1;s<=10;s++){const e=TIPOS.enteros.generar(crearRng(s));console.log(e.enunciado,'→',e.opciones.map(o=>(o.correcta?'*':'')+o.tex).join(' ; '))}})"
```

## Pendiente / propuestas (ver la terminada)
- `_comun/enteros.js` (tarea 79) aún no existe: los errores típicos se calculan dentro de `enteros.js`. Cuando exista, no hace falta cambiar nada; solo sería reutilizar.
- Los mensajes de `errores` son los de la tabla (sin números); los números del ítem van en los pasos del distractor (`mal: true`). El motor no admite parámetros en el mensaje.
- Rellenos genéricos (valor ± 1) solo en `dos_signos` (la única error documentado es el opuesto) y en producto/cociente como cuarto recurso.
- Fuera de alcance: hueco `□ · (-4) = 20` (U3-2C-19) y 0 : n (U3-2C-20), no pedidos en la ficha.
