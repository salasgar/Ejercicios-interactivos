# Hallazgos fuera de criterio — tarea 36 (PU2)

Sesión `s-20261009T082156-0a34d7a4` · 2026-10-09.

Lo que la segunda revisión ha visto y no estaba entre sus ocho puntos, o es de una decisión que
no le toca. Nada de esto está en las reabiertas, salvo donde se dice.

## 1. Decisiones que solo puede tomar Juan Luis

1. **`jerarquia`: adelantar la segunda operación de una cadena.** La sesión que aplicó su
   decisión del 8 de octubre fue un paso más allá: en una cadena del mismo nivel se acepta hacer
   antes la segunda operación si el valor no cambia y el intermedio es un natural (`5 + 3 + 2`
   tocando el segundo +; `11 + 130 − 6` tocando el −; `10 · 8 : 4` tocando el :). Se rechaza si
   cambiaría el valor (`10 − 4 + 3`) o si saldría un negativo (`16 + 6 − 10`). Afecta al 32 % de
   los ítems del ejercicio 1 y al 15 % del 2. Es coherente con «solo es fallo lo que cambia el
   valor», pero no con «izquierda a derecha en cadenas»: el alumno verá aceptado el − en
   `11 + 130 − 6` y rechazado en `16 + 6 − 10` con la frase «seguidas, de izquierda a derecha».
   Si lo quiere estricto, se quita `adelantarNoCambiaNada` de `practicas/jerarquia/logica.js:48`.
   La reabierta de la 20 pide no tocarlo hasta que decida.
2. **`propiedades`: ¿se retira mientras se arregla?** Los exponentes del enunciado no suben en
   los ejercicios 1 y 2 («(68)4=»). Se ha dejado publicada porque se puede contestar; retirarla
   es `disponible: false` en la fila id 30 del catálogo.
3. **`propiedades`: «Las potencias de bases distintas no se juntan»** sale también cuando quedan
   dos potencias con el mismo exponente (5⁹ · 2⁹), donde sí hay propiedad. 1,2 % de los ítems;
   solo importa si aⁿ · bⁿ = (a · b)ⁿ se da en el curso.
4. **`criba`: cómo arreglar el ejercicio 3.** La reabierta da dos salidas: que el número sea
   siempre primo o un compuesto cuyo menor divisor sea el último primo de la lista (49, 77,
   121, 143), o cambiar la pregunta. Si no dice nada, la sesión hará la primera.

Ya resueltas mientras corría esta revisión (se dejan dichas para que no se busquen):

- **`corrector/`**: al empezar, los cambios sin comitear de los exámenes individuales de la
  unidad 2 solo estaban en el autostash (`58bd3a4`). El commit `34b7d00` (10:03Z) los recuperó;
  hoy `git diff 58bd3a4 HEAD -- corrector tests/corrector.test.js` no da nada.
- **`especiales`** (2⁴ = 4²), **`errores1`** (`saltoPaso`) y **`mental`** (lápiz y papel):
  decididas el 9 de octubre, en las reaperturas `…f75f5cdb-decisiones.md`.

## 2. La base (`practicas/_comun/`): para la tarea 37

La tarea 37 (dada de alta el 9 de octubre) ya lleva los cuatro arreglos que pidió la revisión
18, entre ellos el punto 1 de abajo. Los puntos 2, 3 y 4 son nuevos y no están en su ficha:

1. **El botón «Comprobar» sigue visible después de responder en nueve prácticas** (fabrica,
   reloj, factorizaciones, distributiva, potencias10, dictado, mental, parentesis 4): el código
   hace `boton.hidden = true`, pero `_comun/estilos.css:167` (`.comprobar { display: block }`)
   anula el atributo. Queda un botón azul muerto encima del feedback. Arreglo de una línea:
   `.comprobar[hidden] { display: none; }`. Ya está en la ficha de la 37 (punto 8).
2. **La caja de traducción del modo alterno se sale 31 px cuando el ítem lleva dos contadores**
   (fabrica 1, factorizaciones 1 y 3, reloj 2): `.grupo-pasos` a dos columnas dentro de
   `.traduccion`. No pasa con `?idioma=` fijo. No llega a 375 px.
3. En la caja de traducción, los controles del ítem copiado parecen activos (contadores con
   «+», botón «Check») aunque es de solo lectura.
4. **`leerEntero`** (el campo que acepta «1.200», «1 200» y «1200» y rechaza «12.00») vive en
   `practicas/redondeo/logica.js`. Constructor, distributiva y division necesitan lo mismo y
   cada una lo resuelve a su manera: es una pieza de la base.

## 3. Sobre los tests

- **Ningún test ejecuta `practica.js`.** Los dos defectos más visibles de esta pasada (la opción
  «undefined» de la criba y los exponentes de propiedades) están ahí y pasan en verde. Una
  prueba de humo por práctica con un DOM mínimo, o con Chrome sin ventana, los habría visto.
- `tests/practicas-mental.test.js:255` lleva `|| true` y no comprueba nada.
- `tests/practicas-jerarquia.test.js:269` admite a propósito el rechazo de `a + b − b`.
- Tests que no fallarían con el código viejo: el de `[3]` en semaforo, el bucle final de criba,
  el de los contadores de reloj (tautológico).

## 4. Ejercicios que se contestan sin pensar (ya dichos el 8 de octubre, siguen igual)

- `fabrica` 3: el divisor pasa de n/2 en el 19 % de los ítems (la respuesta es «no»).
- `clasificador` 2: tres números → m.c.m.
- `reloj` 3 con dos datos: la respuesta es siempre el mayor.
- `criba` 3: la buena es siempre la lista de longitud intermedia.
- `distributiva` 1: en una suma de lado 3 todos los cortes valen.

## 5. Sobre la propia revisión

- **iCloud volvió a evacuar ficheros** (unos 390: prácticas, `hechos/` y el paquete de git) con
  la sesión abierta. La revisión se hizo sobre una copia de `HEAD` fuera de iCloud
  (`git archive`), que tardó 12 minutos en salir. «Mantener descargado» sobre la carpeta sigue
  sin estar puesto, o no basta.
- No se ha probado en un móvil de verdad: ni el arrastre con el dedo de la criba (que en la
  emulación no funciona) ni la voz del dictado.
- `npm test` da 648 en el árbol de trabajo y 647 en la copia de `8279d74`: el test de más es el
  del corrector que trajo `34b7d00`. Los 648 pasan.
- Mientras la revisión corría, otra sesión comiteó tres veces en el mismo árbol (`e885e9e`,
  `4197fef`, `34b7d00`). No hubo choque, pero el veredicto se escribió sin conocer las ocho
  reaperturas de decisiones y hubo que ponerlo al día al cerrar.
