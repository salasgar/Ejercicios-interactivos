# Entrega de la tarea 119 · Segunda publicación de equivalentes, compara, fraccion-de y suma-resta (semanas 1 y 2 de la U4)

Sesión `s-20261102T141053-b5277421`, 2026-11-02. Commit: **4bac7a2** (`catalogo.js`: `disponible: true` de `equivalentes` y `compara`;
`docs/practicas-unidad4.md`; dos erratas de texto de una línea en `fraccion-de` y `suma-resta`).

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `equivalentes` (100, 48) | **pasa**: lo que pedía la reabierta del 30-10 está hecho y ningún caso de las hojas ni de los exámenes sale | **PUBLICADA** · bloque «Semana 1» |
| `compara` (102, 50) | **pasa**: ídem (un hallazgo fuera de criterio, abajo) | **PUBLICADA** · bloque «Semana 1» |
| `fraccion-de` (103, 51) | **no pasa**: el ej. 4 saca cuatro de los seis casos de U4-1A-01 del examen semanal 1 | sin publicar · `hechos/reabiertas/103--s-20261102T141053-b5277421-revision.md` (MEDIO, corta) |
| `suma-resta` (104, 52) | **no pasa**: los ej. 2 y 3 sacan ejercicios de la hoja 2, iguales o conmutados | sin publicar · `hechos/reabiertas/104--s-20261102T141053-b5277421-revision.md` (MEDIO, corta) |

Comprobado: la U4 sigue oculta en la portada hasta el lun 14-12 (`UNIDADES` sin tocar); con `equivalentes` y `compara` publicadas, el bloque
«Semana 1» de `bloquesPublicados(CATALOGO, 4)` enseña `que-fraccion`, `equivalentes`, `simplifica` y `compara`.

**Las dos reabiertas se quedan sin publicador**: `fraccion-de` y `suma-resta` tienen que estar publicadas antes del **jue 17-12** (la
tarea de la semana 2 empieza el lun 21-12). La 120 no puede publicarlas (su ficha publica solo 105-107). Hace falta una tarea de
publicación nueva (ALTO), que da de alta la coordinadora; la 121 (las tareas de la U4 en el panel) puede montar ya la de la semana 1.

## Cómo se revisó
- **Casos del papel, con un barrido independiente** (guiones en el scratchpad de la sesión, no se comitean porque leen los casos en claro):
  los 360 casos de los tres `casos-examen-semanaN.tsv` (con la columna `correcta`), las opciones de `examen-semanaN.tex` y
  `examen-semanaN-extra.tex`, los cuatro `.tex` del examen final (modelos 1 y 2, recuperación y **adaptado-A**, que es del 30-10 por la
  mañana, posterior a la revisión de la 117) y los ejercicios de las tres hojas, sin los recuadros «Recuerda», «Ejemplo» y «Ojo».
  20000 ítems por ejercicio. La clave no se tomó de las prácticas (sería repetir su posible error) sino de los datos: **fracciones con
  signo, operación y orden**; las sumas se compararon **sin orden** (a + b = b + a, −a + n = n − a), como las parejas de las reabiertas
  del 30-10. Cuenta solo la **misma tarea con los mismos datos**, con el criterio de la 117 (también cuando el examen pregunta un paso del
  mismo problema que la práctica).
  - `equivalentes`: 0 casos en los ej. 1, 2 y 4 (el ej. 3, equipos de ocho tarjetas, no tiene casos de papel comparables). Comprobado
    también el arreglo del orden de `PAREJAS_RESERVADAS`: la pareja de la hoja 1, ej. 7a, ya no sale.
  - `compara`: 0 casos de examen y 0 de las hojas en los ej. 1 y 3, con signo (las negativas de la hoja 1, ej. 12a, y de la hoja 2, ej. 1b,
    tampoco salen con signo cambiado). El ej. 4 (recta) no lo usa ningún examen, como dijo la 117.
  - `fraccion-de`: ej. 1, 2 y 3, 0 casos (el ej. 3, con las dos partes sin orden: 0 de los 11 casos de U4-1A-03 de exámenes y hoja). Ej. 4:
    0 casos de U4-1A-02, U4-2A-02 y U4-2A-03, pero **sí** U4-1A-01 (abajo).
  - `suma-resta`: 0 casos de examen en los cinco ejercicios, también conmutados. De la hoja 2 sí salen siete (abajo).
- **Regla de oro**: los ej. de opción múltiple de las cuatro, 3000 ítems: una sola opción buena y ninguna repetida por valor
  (`fraccion-de` 4, `suma-resta` 4); `equivalentes` y `compara` no tienen más distractores que Sí/No y < />, que no pueden ser los dos
  verdad. Los tests de cada práctica ya barren por valor (`npm test` 1364/1364). Lectura de 30 ítems del ej. 4 de `fraccion-de` con todas
  sus explicaciones: de ahí la errata de concordancia de abajo.
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent` en el centro de cada botón, tarjeta, caja y punto de
  la recta; «Probar sin código»): **un acierto y un fallo de cada ejercicio**. `equivalentes` y `compara`, los 8 ejercicios a 375 y 1100 px, en español
  y en inglés (64 ítems): todos bien, con el feedback ligado a los números del ítem, fracciones enteras, sin desbordes (`scrollWidth`) y sin
  excepciones en la consola; el ej. 3 de `equivalentes` y el 2 de `compara`, colocando cada tarjeta en su caja, y el 4 de `compara`
  tocando el punto de la recta. `fraccion-de` y `suma-resta`, sus 9 ejercicios a 375 px en español (18 ítems), también bien; las otras
  tres combinaciones no se hicieron porque se reabren (la tarea que las publique las hará enteras).
- **Erratas de texto de una línea, arregladas** (no cambian la lógica):
  - `fraccion-de/textos.js`, ej. 4: «aquí 33 **es** 3 partes de 8» y «465 **es** 3 partes de 4, no una» (780 de 6000 textos en 3000 ítems):
    la reabierta del 30-10 puso «es» para el caso de 1 parte; ahora «es» con 1 y «son» con más.
  - `suma-resta/logica.js` 88, nombre del error `mcm-equivocado` en inglés: «Got the **l.c.m.** of the denominators wrong» → «LCM». Se ve
    en el ej. 5 en inglés como una de las razones que elige el alumno; la reabierta del 30-10 cambió los demás «l.c.m.» pero este no.

## Por qué no pasan `fraccion-de` y `suma-resta`
- `fraccion-de`, ej. 4, variante «queda» (lo que queda de un total): de los seis casos de **U4-1A-01** del examen semanal 1, salen las
  **variantes 1, 2, 3 y 4** (unas 340 veces en 100000 ítems; clase, depósito, viaje y ahorro). Mismos datos: el total y la fracción del
  examen; el examen pregunta cuántos sí, la práctica cuántos no, y la respuesta del examen es una de las opciones. Las huellas de los
  ej. 1 y 2 ya excluyen esos seis casos, pero el ej. 4 usa otra clave. En la prueba con clics salió uno de ellos.
- `suma-resta`, hoja 2: ej. 3 «5/6 + 1» (2g, 37 de 20000 tal cual y 50 como «1 + 5/6»), «3/5 + 2» (2e conmutado, 31), «2 − 5/6» (5e
  reordenado, 48); ej. 2 «7/8 + 1/12» (4c, 9 entre los dos órdenes), «4/9 − 1/6» (5b reordenado, 5), «5/6 + 1/3 − 1/4» (6a, 1), «4/6 + 6/10»
  (7a, 6). La reabierta del 30-10 pedía «revisar» 4c y 5e; la sesión que la cerró filtró cada caso solo en el orden de la hoja.

## Propuestas de la tarea de la app de las semanas 1 y 2 (para Juan Luis; no están creadas)
- **Semana 1** (lun 14-12 → jue 17-12): **vale tal cual el plan A** de `salidas/109-publicar-u4-semana1/ENTREGA.md` (6 ★ + 4 a elegir, 100
  puntos, `['ortografia', 5]` el primer ★): los cuatro ejercicios que llevaban «tras la reabierta» (`equivalentes` 1 a 4, `compara` 1 a 4)
  están publicados. El plan B ya no hace falta. Se puede montar en el panel (tarea 121) en cuanto Juan Luis quiera.
- **Semana 2** (lun 21-12 → jue 7-1, con la Navidad en medio): **sigue en espera**. El plan A de `salidas/110-publicar-u4-semana2/ENTREGA.md`
  (7 ★ + 3 a elegir; o la variante larga, ×100/120) necesita `suma-resta` y `fraccion-de` publicadas; sin `suma-resta` no hay tarea de la
  semana 2 que valga (plan B de la 110). Lo que sí cambia: los dos ejercicios de repaso de su lista «elegir», `['equivalentes', 4]` y
  `['compara', 1]`, ya están publicados.

## Hallazgos fuera de criterio (no bloquean; decide Juan Luis)
1. **`compara` ej. 1 y los distractores del examen**: cuatro parejas que aparecen como **opciones falsas** de U4-1C-17 en
   `examen-semana1.tex` (no como respuesta) salen en la práctica (12-20 veces cada una en 20000 ítems). La regla 6 se ha medido, como
   hizo la 117, con el caso (la opción buena); una opción falsa no da la respuesta, así que no se reabre. Si Juan Luis prefiere excluirlas,
   son cuatro huellas más en `HUELLAS_EXAMEN_PAREJAS`.
2. **Los cuestionarios (Forms) semanales** (`cuestionario-semanaN-casos.tsv`) no entran en la regla 6 y la práctica repite algún caso suyo
   (p. ej. el ej. 1 de `equivalentes`, el término que falta, uno del cuestionario 1). No se ha medido a fondo.
3. **Accesibilidad, base común**: `piezas.js` (`campoNumero`) pone el nombre del campo en `aria-label` tal cual, con etiquetas HTML: en el
   ej. 4 de `equivalentes`, un lector de pantalla lee «&lt;strong&gt;menor&lt;/strong&gt;». No se ve en pantalla.

## Ficheros (git show --stat 4bac7a2)
```
docs/practicas-unidad4.md       | 13 +++++++------
 practicas/_comun/catalogo.js    |  4 ++--
 practicas/fraccion-de/textos.js |  4 ++--
 practicas/suma-resta/logica.js  |  2 +-
 4 files changed, 12 insertions(+), 11 deletions(-)
```

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/equivalentes/ y http://localhost:8080/practicas/compara/ → «Probar sin código». Que la
portada no las enseña hasta el 14-12 se ve en `bloquesPublicados` (`tests/practicas-comun.test.js`).
