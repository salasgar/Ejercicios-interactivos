# Hallazgos fuera de criterio — tarea 18 (PU2)

Sesión `s-20261008T051928-1cba9950` · 2026-10-08.

Lo que la revisión ha visto y no estaba entre sus tres criterios (regla de oro, reglas de
contenido, pantalla). Nada de esto impide entregar una práctica; casi todo pide una decisión.

## 1. Decisiones que solo puede tomar Juan Luis

1. **`errores1`: ¿«saltarse un resultado intermedio» es un error?** Cuatro plantillas
   (`30 − 5 · 5 + 5 / = 5 + 5 / = 10` y otras tres) dan por erróneo un desarrollo en el que
   todas las igualdades son verdaderas. Lo pedía la ficha (destrezas 4A-12 y 4A-13 de la
   unidad 1), pero quien contesta «Está bien» tiene razón aritmética y recibe +2, y otra
   plantilla del mismo banco, dada por correcta, hace el mismo salto (`7 + 3 · 5 = 22`).
   Opciones: (a) sacarlas de «¿Hay un error?» y preguntar aparte «¿está bien ESCRITO?»; (b)
   cambiar la pregunta a «¿está bien resuelto y bien escrito?» y corregir la plantilla que
   salta; (c) quitarlas. Recomendación: (a) o (c). La reabierta de la 32 no las toca hasta
   que decida.
2. **`mental`: «lápiz y papel» siempre acierta.** Pulsándolo siempre se termina el ejercicio 3
   con 10 aciertos y 0 fallos. Recomendación: que cuente como una ayuda (`pistas: 1`) cuando
   había un atajo. La reabierta de la 30 hace eso salvo que diga otra cosa.
3. **`jerarquia`: operación independiente de menor prioridad.** En `10 − 4 + 6 · 16`, tocar
   primero 10 − 4 no cambia el valor y hoy es fallo («· y : van antes que + y −»). Es la
   convención que se enseña. La reabierta de la 20 lo deja como fallo salvo que decida
   aceptarlo. (Lo otro, dos productos en términos distintos, sí se corrige: no es
   convención, es una regla falsa.)
4. **`baldosas`: «Suelo de 40 × 56 dm».** El «×» de las medidas no es un producto, pero la
   regla dice «nunca ×». Si lo quiere fuera: «de 40 dm por 56 dm».
5. **`leelo`: HCF como lectura obligada.** En el 8 % de los ítems de «¿Cómo se lee?» la
   notación dice GCD y las cuatro opciones dicen HCF. No hay dos lecturas enfrentadas, pero
   roza «HCF se acepta y no se enseña».
6. **`errores`: «2 es factor de 6. También puedo decir que 2 es divisor de 6»**, dado por
   correcto con «aquí factor y divisor quieren decir lo mismo». Es cierto y lo pedía la
   ficha; roza la regla «divisor, no factor». Y «el menor múltiplo común es 12», con listas
   que empiezan en el 4: con el 0 como múltiplo, el menor sería 0 (el resumen de la unidad
   define el LCM igual).
7. **`expresion`: «20 menos 5 multiplicado por 3»** se corrige como 20 − 5 · 3 y
   (20 − 5) · 3 es fallo. Es la convención de la unidad (sin «todo» no hay paréntesis), pero
   en el ejercicio 1 el alumno la conoce al fallar: se explica en la introducción del 2.
8. **`potencias10`: «five billion (US)» frente a «five trillion (US)», ¿el mismo número?**
   Con las dos etiquetas es inequívoco y no es el distractor 10¹² que vetó; se deja.
9. **`constructor`: «12.5 leído con las reglas del español sería 125».** No es una lectura
   real; como distractor es falso sin duda, lo discutible es la frase del feedback.
10. **`dictado`: «three hundreds»** como forma mal escrita de 300. Como numeral está mal,
    pero «3 hundreds» es inglés correcto en valor posicional (que la unidad 1 trabaja).
11. **`semaforo`: □72 divisible entre 9.** Solo se acepta el 9; el 0 cumple la cuenta, y la
    ficha manda que un número no empiece por 0. La reabierta pide que el feedback lo diga.
12. **Qué se publica.** Esta tarea ha dejado fuera de la portada las 11 prácticas con
    hallazgo grave. Siguen abriéndose por su URL. Si prefiere tenerlas todas a la vista
    mientras se corrigen, es cambiar `disponible` en `practicas/_comun/catalogo.js`.

## 2. La base (`practicas/_comun/`): hace falta una tarea corta

Esta tarea no puede tocar la base. Cuatro cosas la piden, y las tres primeras se arreglan
una vez para todas las prácticas:

1. **`.cuenta` no se parte, y varias prácticas meten en él frases enteras**: en el móvil la
   página se ensancha y aparece desplazamiento horizontal en `dictado`, `potencias10`,
   `propiedades`, `errores`, `errores1`, `mental`, `distributiva` y `factorizaciones`. Cada
   reabierta lo corrige en su práctica, pero una red en la base (que `.cuenta` pueda partirse
   cuando no cabe: `max-width: 100%` y `white-space: normal` a partir de cierto ancho, o
   `overflow-wrap`) lo evitaría para siempre.
2. **`.comprobar { display: block }` anula el atributo `hidden`**: `boton.hidden = true` no
   esconde «Comprobar» después de responder. Lo dijeron las terminadas de la 09 y la 33, que
   lo arreglan en su CSS; en `criba`, `dictado`, `potencias10`, `factorizaciones` y `mental`
   el botón se sigue viendo debajo de la respuesta (capturas de la pasada). Una línea en la
   base: `.comprobar[hidden] { display: none; }`.
3. **Los campos numéricos son `<input type="number">`** en `redondeo`, `constructor`,
   `distributiva`, `division`, `reloj` y `baldosas`. Con respuestas de cuatro cifras, quien
   escribe el punto de millar («4.730», como se le enseña) falla; y el campo vacío cuenta
   como 0 y fallo (`baldosas`, `reloj`). Una pieza común de la base (campo de texto con
   teclado numérico, que limpie puntos y espacios y no deje comprobar vacío) lo resolvería
   igual en todas.
4. **`generar` no recibe el idioma** (propuesta de la 14): por eso no hay plantilla
   «divisible between», que solo es error en inglés. Pasarle el idioma del ítem permitiría
   plantillas de un solo idioma.

Y una nota para la app principal, que tampoco es de este reparto: `src/ejercicios/palabras.js`
escribe «cuatrocientos uno mil» (no apocopa «ciento uno», «doscientos uno»… delante de
«mil») y «veintiuno millones». `constructor` lo esquivará por su lado.

## 3. Ejercicios que se aprueban sin pensar

Funcionan y corrigen bien, pero la respuesta se deduce de la forma del ítem:

- `rectangulos`, ejercicio 3: la correcta es casi siempre la segunda opción más pequeña
  (2474 de 2491 ítems), y en el tipo «cuadrado», siempre «1». Ejercicio 1: se acierta
  pulsando «+» hasta el tope y «Ya están todas».
- `criba`, ejercicio 3: la correcta es siempre la lista de longitud intermedia, y «¿Y es
  primo?» solo aparece cuando la respuesta es No.
- `semaforo`, ejercicio 3: la trampa «divisible entre 4 y entre 6, ¿y entre 24?» tiene solo
  cinco números y siempre es No.
- `fabrica`, ejercicio 3: el divisor es mayor que el número en el 30 % de los ítems.
  `factorizaciones`, ejercicio 2: lo mismo en el 43 % de los «no». En su ejercicio 1, pulsar
  «+» hasta el tope en todos los contadores acierta siempre (lo pedía la ficha).
- `imposibles`, ejercicio 3: la correcta es la única opción con el nombre de su clase;
  ejercicio 2: basta comparar dos números impresos.
- `clasificador`, ejercicio 2: tres números → m.c.m.; «Tienes…» → m.c.d. Las doce trampas
  dicen MENOR y ninguna MAYOR.
- `reloj`, ejercicio 3 con dos datos: la respuesta es siempre el mayor.
- `divisores`, ejercicio 0: la palabra sola decide la preposición (es su objetivo, de
  vocabulario).
- `potencias10`, ejercicio 1: «¿Cuántos ceros tiene 10⁷? Mueve el deslizador hasta 10⁷».
- `leelo`, ejercicio 3: cuatro de las once frases son fijas, sin números (el 36 % de los
  ítems se repite literal).
- `errores1`, ejercicio 2: el error nunca está en la primera línea.

## 4. Desvíos de la ficha que nadie había anotado

- `divisiones`: la escalera (n | p) no se ve mientras se hace, solo en el feedback final.
  El 13 nunca sale en el ejercicio 2.
- `fabrica`: en el ejercicio 1 el objetivo es 1 o el propio número en el 39 % de los ítems
  (la ficha: 20 %) y no se enseña la factorización del número.
- `rectangulos`: «Sin dibujo: las parejas» no enseña parejas en ningún momento.
- `venn`: el 80 % de las parejas tiene los dos números por debajo de 150 (la entrega: seis
  de cada diez).
- `division`: la «división hecha (a veces mal)» del ejercicio 2 está siempre bien hecha. En
  el ejercicio 1, quien teclea cociente y resto correctos sin haber llenado todas las cajas
  recibe fallo (lo manda la ficha, pero penaliza una respuesta correcta).
- `exponente`: «¿Cuánto vale?» llega a 9⁴ = 6561 (la ficha: no pasar de 1296).
- `especiales`: la entrega declara cubiertas «comprobar con la inversa» (3C-29) y la
  lectura en inglés (3B-01 a 3B-03), y no hay ningún ítem de eso.
- `leelo`: los ejercicios 1 y 2 no generan las clases «primo» y «compuesto» de la ficha (lo
  avisa su entrega).
- `redondeo`: la recta exige tocar a ±5 % del tramo, unos 15 px en el móvil (lo pide la
  ficha); «estimar» obliga además a la suma exacta de tres o cuatro sumandos de cuatro
  cifras, mucho más largo que el resto del ejercicio.

## 5. Solapes

- `errores` y `errores1` son la misma aplicación con otro banco (mismo `logica.js`, mismo
  `practica.js`). Un arreglo en una (la instrucción «la primera línea», las líneas que se
  salen en el móvil) hay que hacerlo en las dos; convendría que compartieran el código.
- `jerarquia` y `parentesis` trabajan lo mismo desde los dos lados (qué se hace primero / qué
  cambia el paréntesis) con dos evaluadores distintos. No se pisan; lo anota la terminada de
  la 20.
- `potencias10`, `dictado` y `constructor` escriben números en palabras, y `dictado` importa
  la lógica de `potencias10`: es la única dependencia entre prácticas.
- `factorizaciones` y `fabrica` terminan las dos en «¿es divisible/múltiplo mirando los
  exponentes?» (destreza U2-2C-14).
- `mental` (ejercicio 1) y `distributiva` (ejercicio 3) hacen la misma compensación con 99.

## 6. Lo que falta por cubrir

Cinco destrezas **nucleares** de la unidad 2 no tienen práctica (la tabla completa está en
`docs/practicas-unidad2.md`, apartado 7): problema de grupos iguales con listas de divisores
(U2-1A-03), vocabulario de los criterios (U2-1B-03), m.c.d. y m.c.m. con listas
(U2-1C-16), problemas con dos datos hasta 100 (U2-2A-01) y problema de m.c.m. por
factorización (U2-3A-02). El catálogo está lleno (32 de 32 ids), así que cubrirlas pasa por
añadir un ejercicio a una práctica existente (caben hasta seis por práctica).

## 7. Sobre la propia revisión

- El primer detector de desbordes de la pasada de pantalla estaba ciego en móvil (la
  emulación ensancha la ventana cuando algo no cabe): dio «sin desbordes» en las 31. Se vio
  en las capturas y se repitió midiendo contra 375 px fijos. Las ocho prácticas con
  desborde salieron de la segunda pasada.
- No se ha usado un móvil de verdad. El arrastre con el dedo (`venn`, `divisores`,
  `expresion`) y la voz (`leelo`, `dictado`) están sin probar en un teléfono.
- Las pruebas de 375 px que declaran las entregas de las tareas 14, 16, 22, 25, 30 y 32 no
  se hicieron o se hicieron a otro ancho (lo dicen ellas mismas); cuatro de esas seis tienen
  desbordes.
