# ENTREGA · Tarea 235 · «Caza el error» (U1, errores1): ejercicio 2 en columnas

Sesión: s-20261122T122714-8c8e0765 · Commit del código: `5fddf43` · 2026-11-22 · **Sin probar en navegador** (ver abajo).

## Ficheros entregados (`git show --stat 5fddf43`)

- `practicas/errores1/familias.js` (nuevo) — las 7 familias con sus rutas buenas y malas, y `evaluar` (comprueba el valor de cada línea).
- `practicas/errores1/logica.js` — `columnaDe`, `columnasPosibles`, `generarColumnas` (sustituye a `generarLinea`).
- `practicas/errores1/textos.js` — textos del ejercicio 2 (`comprobar`, `col_bien`, `col_mal`, `columna`, `la_linea_es`, `pregunta_col`), `LETRAS`, `explicacionColumnas`, `enunciadoColumnas`, `columnasDe` y el nuevo «No lo sé» (`explicaLinea`).
- `practicas/errores1/practica.js` — `montarLinea` en columnas (modelo: errores4) y el enunciado para la traducción con `columnasFijas`.
- `practicas/errores1/estilos.css` — `.instruccion--siguiente`.
- `tests/practicas-errores1.test.js`, `tests/practicas-ayuda-errores1.test.js`.

Los ejercicios 1, 3 y 4 no cambian (ni su banco de 34 plantillas). Lo único que forzó el test de columnas: los tests que
llamaban a `generarLinea` (saltoPaso, feedback con error, «No lo sé» de los ejercicios 1-3) ahora usan solo los generadores
de los ejercicios 1 y 3. `practicas/_comun/` no se ha tocado.

## Cómo es el ejercicio 2

El enunciado una vez arriba (sin poderse pulsar) y debajo 2-4 columnas, una por alumno: 1-2 bien, de formas distintas, y 1-2
con un error (errores distintos). No se dice cuántas están mal. El alumno toca en cada columna mala la línea mala y pulsa
«Comprobar»; si acierta, una pregunta por cada columna mala («¿Qué error hay en la columna B?») con el nombre bueno y dos
nombres que no pueden describirla: no están en ningún error del ítem, ni en sus `excluidos` ni son `CONFUNDIBLES` de ellos.
Una sola llamada a `api.responder` (`espera: 'boton'`): el primer fallo termina el ítem con la explicación de todas las
columnas; si todo está bien, 1 punto. Cada línea de cada columna se evalúa en los tests (buena: vale lo mismo que el
enunciado; mala: la primera que cambia es la declarada y las siguientes siguen su valor falso).

## Familias (7) y rutas: 15 buenas y 11 malas

| Familia | Enunciado | Bien | Mal |
|---|---|---|---|
| suma-producto | `a + b · c` (o `− d`) | producto-primero, producto-entre-parentesis | suma-antes (sumaAntes) |
| potencia-producto-suma | `a^2 + b · c` (a de 3 a 5) | potencia-primero, potencia-y-luego-producto, potencia-como-producto | potencia-por-dos (potencia), suma-antes-del-producto (sumaAntes) |
| resta-parentesis-resta | `a − (b + c) − d` | parentesis-primero, quitar-parentesis | olvida-el-parentesis (restaAntes), resta-al-reves (restaDerIzq) |
| producto-por-potencia | `a · b^2` | potencia-y-producto, producto-de-factores | potencia-por-dos (potencia), exponente-al-producto (expProducto) |
| cuadrado-de-suma | `(a + b)^2` | suma-y-cuadrado, suma-y-producto | exponente-a-cada-sumando (expSuma), cuadrado-por-dos (potencia) |
| raiz-mas-producto | `√n + k · j` | raiz-primero, producto-primero | raiz-es-la-mitad (raizMitad) |
| productos-independientes | `a · b + c · d` | dos-productos-a-la-vez, un-producto-por-linea | suma-antes-del-segundo-producto (sumaAntes) |

Quedan fuera del ejercicio 2 (siguen en los ejercicios 1 y 3): restoMayor, redondeo y olvidaParentesis (problemas de
enunciado), `b^e + k` y `a · b + c^e`: no salían dos caminos buenos con sentido o un segundo error del catálogo.

## Reparto real en 3000 ítems (semilla 204 del test)

- Columnas: 2 → 661 (22 %) · 3 → 1558 (52 %) · 4 → 781 (26 %).
- Familias: resta-parentesis-resta 567, producto-por-potencia 554, cuadrado-de-suma 545, potencia-producto-suma 521, raiz-mas-producto 296, suma-producto 263, productos-independientes 254.
- Las familias con un solo error posible (suma-producto, raiz-mas-producto, productos-independientes) dan 2 o 3 columnas; el 4 sale de las otras cuatro.

## Sin probar en Chrome

No hay herramienta de navegador en esta sesión automática; no se ha podido probar el ejercicio en pantalla. Lo cubierto: `npm test`
2738/2738, `node --check` de `practica.js`, los imports de `practica.js` contra los exports reales, y los tests de ambos
idiomas sobre los datos y los textos. **Pendiente para Juan Luis:** mirarlo en 375 px y en ancho, en español y en inglés (ítems de 2, 3 y 4
columnas, acertarlo todo, fallar el marcado, fallar una pregunta y «No lo sé»); la URL es la de la práctica errores1 con `?c=AJJN&ejercicio=2`.

## Nota

El mensaje del commit dice «7 familias con 15 rutas»: son 15 buenas y 11 malas (26 en total).
