# Propuesta · Las cuatro tareas de la unidad 1 con las 15 prácticas de repaso

Tarea 46 del reparto PU2 · sesión `s-20261016T144913-715ee461` · 2026-10-16.
**APROBADA por Juan Luis el 2026-10-16** (respuestas a las seis preguntas al final de
`ENTREGA.md`): repaso visible desde ya, títulos con «U1 · », y las cinco ideas de prácticas
nuevas y los dos arreglos, todos. No toca `tareas.js` ni nada de `practicas/`:
el bloque de código de abajo se pega cuando exista el campo `unidad` (implementación
de la tarea 45).

## En una línea

Cuatro tareas, una por semana de la unidad 1 (ids **11, 12, 13 y 14**), con el mismo
formato que las de la U2: **6 ★ + 4 a elegir = 100 puntos**. De las 80 preguntas-destreza
que evaluaron los cuatro exámenes semanales de la U1, 73 tienen al menos un ejercicio (11 de
ellas solo en parte) y 7 ninguno; en total, **24 destrezas de examen se quedan sin
práctica**. Están al final, agrupadas en cinco ideas de prácticas nuevas para el curso que
viene. (Recuento hecho por máquina sobre las tablas de abajo y las claves de los exámenes.)

## Antes de nada: tres cosas que cambian lo que pedía la ficha

1. **El inventario de la U1 no marca destrezas nucleares.** Tiene 272 filas y ninguna
   columna «nuclear» (la marca se introdujo en la U2, lección 21 del documento maestro).
   Como no puedo dar por nuclear lo que el inventario no marca, uso como aproximación
   **las 20 destrezas que tú elegiste para cada examen semanal de la U1** (claves
   `exámenes-semanales/semana-N/clave-semanaN.json`). Los ★ de cada tarea son los
   ejercicios que cubren más de esas 20. **Pregunta 2, abajo.**
2. **Las semanas de la U1 no son las que suponía la ficha.** Según la secuenciación
   (copia de la carpeta de la unidad, la del 17-09):
   - Semana 1 · Los números naturales: representarlos, leerlos, aproximarlos (+ hilo de
     combinadas con 2 operaciones).
   - Semana 2 · Las operaciones: términos, división y propiedades (hilo: hasta 3).
   - Semana 3 · Potencias y raíces cuadradas (hilo: hasta 4, entra la raya de fracción).
   - Semana 4 · Jerarquía de las operaciones y resolución de problemas (hilo: hasta 5,
     anidados).
3. **Hay 47 ejercicios, no 49**: `mental` perdió su ejercicio 3 (el de elegir estrategia)
   el 9-10 y `errores1` ganó el 4 («¿Paso a paso?»). Repartidos por semana salen 12, 11,
   14 y 10 (contando que he pasado los problemas de raíces, `raiz` 3, a la semana 4, que es
   la de problemas y cuyo examen los evaluó). Por eso la semana 1 lleva 6 de elegir y la
   semana 2 lleva 7, en vez de 8: no hay más ejercicios de esas semanas sin repetir ★.

## Lo que se pega en `tareas.js`

```js
  {
    id: 11,
    unidad: 1,
    titulo: { es: 'U1 · Semana 1 · Valor posicional, lectura de números y redondeo', en: 'U1 · Week 1 · Place value, reading numbers and rounding' },
    estrella: [['constructor', 2], ['dictado', 1], ['redondeo', 1], ['redondeo', 3], ['jerarquia', 1], ['parentesis', 1]],
    elegir: [['constructor', 1], ['constructor', 3], ['dictado', 2], ['dictado', 3], ['potencias10', 2], ['redondeo', 2]],
    nElegir: 4,
  },
  {
    id: 12,
    unidad: 1,
    titulo: { es: 'U1 · Semana 2 · División entera y propiedades de las operaciones', en: 'U1 · Week 2 · Division with remainder and properties of operations' },
    estrella: [['division', 1], ['division', 2], ['division', 3], ['distributiva', 2], ['mental', 1], ['parentesis', 3]],
    elegir: [['division', 4], ['distributiva', 1], ['distributiva', 3], ['mental', 2], ['parentesis', 2], ['jerarquia', 1], ['redondeo', 2]],
    nElegir: 4,
  },
  {
    id: 13,
    unidad: 1,
    titulo: { es: 'U1 · Semana 3 · Potencias y raíces cuadradas', en: 'U1 · Week 3 · Powers and square roots' },
    estrella: [['exponente', 2], ['exponente', 1], ['potencias10', 1], ['raiz', 2], ['jerarquia', 2], ['jerarquia', 4]],
    elegir: [['especiales', 1], ['especiales', 2], ['potencias10', 3], ['exponente', 3], ['raiz', 1], ['propiedades', 1], ['propiedades', 2], ['propiedades', 3]],
    nElegir: 4,
  },
  {
    id: 14,
    unidad: 1,
    titulo: { es: 'U1 · Semana 4 · Jerarquía de las operaciones y problemas', en: 'U1 · Week 4 · Order of operations and word problems' },
    estrella: [['jerarquia', 3], ['expresion', 1], ['expresion', 2], ['expresion', 3], ['raiz', 3], ['errores1', 1]],
    elegir: [['parentesis', 4], ['errores1', 2], ['errores1', 3], ['errores1', 4], ['jerarquia', 4], ['exponente', 3], ['division', 3], ['redondeo', 3]],
    nElegir: 4,
  },
```

Sin `desde`, como pide la ficha: cuándo se ven lo decide el estado de la tarea (pregunta 1).
Comprobado contra `erroresTareas` de `tareas.js` (ids 1-1023, ningún repetido dentro de
una tarea, ★ ≤ 10, elegir ≤ 15, todo `[slug, n]` existe en el catálogo actual); el campo
`unidad` lo ignora hasta que la 45 lo implemente.

**Los ids 11-14** siguen la trampa conocida de la ficha (distintos de 1-4, menores que
1024): que los confirme la coordinadora o el diseño de la 45.

## Tarea 11 · Semana 1 · Valor posicional, lectura de números y redondeo

Las destrezas en **negrita** son de las que evaluó el examen de esa semana. ↺ = el ejercicio
ya sale en otra tarea (ver «Ejercicios repetidos»).

| | Ejercicio | Destrezas (inventario U1) |
|---|---|---|
| ★ | constructor 2 · Valor de las cifras | **1C-01**, 1C-02, 1C-03, **1C-04**, 1C-25, 1B-11 |
| ★ | dictado 1 · Dictado en inglés | **1B-01**, 1B-03, 1B-04, **1B-07**, 1B-10 |
| ★ | redondeo 1 · En la recta | 1C-09, **1C-10**, **1C-11**, 1C-13, 1B-12 |
| ★ | redondeo 3 · Estimar y cazar el error | **1C-14**, **1C-15**, 1C-16, 1C-17, 1C-18, 1C-19, 1C-21, 1C-22, 1B-13 (y 4C-16, 4C-17, 4C-20) |
| ★ | jerarquia 1 · Sin paréntesis | **1A-01**, **1A-02**, **1A-03**, **1A-04**, 1A-14 (y 2A-05, 2A-14, 2A-15) |
| ★ | parentesis 1 · Tres números | **1A-10**, 1A-12, 1A-14, 1A-15 |
| | constructor 1 · Construye el número | 1C-06, **1C-07**, 1C-08, **1B-16** |
| | constructor 3 · Comas, puntos y palabras | **1B-05**, 1C-05, 1C-24, 1B-25 |
| | dictado 2 · -teen o -ty, y cómo se escribe | **1B-06**, 1B-08, 1B-09, 1B-21, 1B-22 |
| | dictado 3 · Ortografía española | 1B-17, **1B-18**, **1B-19**, **1B-20**, 1B-23 |
| | potencias10 2 · El «and» y los ceros | 1B-14, **1B-15**, 1B-25, 1B-26, 1C-24 |
| | redondeo 2 · A tres órdenes | **1C-11**, 1C-12, 1C-13, 1B-24 |

Por qué estos ★: el hilo de combinadas (jerarquía y paréntesis con dos operaciones) es lo
que más práctica exige de la unidad según la secuenciación, y los otros cuatro cubren las
destrezas de contenido del examen (valor de una cifra y descomposición, dictado, recta y
redondeo, estimación). La estimación va de ★ porque fue lo que peor salió en el examen de
la semana 1 (42-62 %, lección 24).

**Examen de la semana 1 sin práctica en esta tarea:** 1A-05 (está en `errores1`, semana 4),
1A-06/1A-07 y 1A-08/1A-09 (la potencia y la raíz antes que la suma y que el producto: solo
de refilón aquí, con el cuadrado de `parentesis` 1; enteras en `jerarquia` 2, semana 3),
**1B-02** (escribir con palabras en inglés un número de cuatro o cinco cifras con cero
interior: ninguna práctica lo pide) y **1C-20** (estimar el total de un problema antes de
calcularlo: `redondeo` 3 estima operaciones sueltas, no problemas).

## Tarea 12 · Semana 2 · División entera y propiedades de las operaciones

| | Ejercicio | Destrezas (inventario U1) |
|---|---|---|
| ★ | division 1 · Reparte en cajas | **2C-01**, 2C-02, **2B-04**, 2B-05 (y de refilón **2B-17**: *exact division* en el feedback) |
| ★ | division 2 · La prueba de la división | **2C-04**, **2C-05**, **2C-06** (y de refilón **2B-15**: *dividend, divisor* en la introducción y el feedback) |
| ★ | division 3 · ¿Qué significa el resto? | **2C-07**, **2C-08**, 2C-09 (y 4C-11, 4C-12) |
| ★ | distributiva 2 · Saca factor común | 2A-03, **2A-04**, **2C-18**, **2B-20** |
| ★ | mental 1 · Compensar | **2C-20**, **2C-21** |
| ★ | parentesis 3 · Con resta y división | 1A-11, **2A-07**, **2A-08** |
| | division 4 · ¿Puede ser? | **2C-03**, **2B-25** |
| | distributiva 1 · Parte el rectángulo | 2A-01, 2A-02, 2C-17 |
| | distributiva 3 · Compensa con 99 | **2C-20**, **2C-21** |
| | mental 2 · Descomponer | 2C-22 |
| | parentesis 2 · Con una potencia | 1A-12, 2A-13 (y de refilón **2A-11**) |
| | jerarquia 1 · Sin paréntesis ↺ (★ de la semana 1) | **2A-05**, **2A-09**, **2A-10**, 2A-14, 2A-15 |
| | redondeo 2 · A tres órdenes ↺ (semana 1) | 1C-11, 1C-12, 1C-13 |

`mental` 1 y `distributiva` 3 practican lo mismo (compensación con 98 y 99), una de
cabeza y otra con el dibujo del rectángulo: por eso una es ★ y la otra de elegir.
`jerarquia` 1 es aquí repaso y a la vez contenido de la semana: tiene dos y tres
operaciones, y el examen de la semana 2 evaluó 2A-05 y 2A-09/2A-10 con tres.

**Examen de la semana 2 sin práctica:** 2A-11/2A-12 (una potencia o una raíz entre tres
operaciones: solo de refilón en `parentesis` 2; enteras en `jerarquia` 2, semana 3), y
**todo el vocabulario de las operaciones y las propiedades**: 2B-01, 2B-02, 2B-06 (nombre del
resultado: *sum*, *difference*; solo *quotient* y *remainder* salen en `division`), 2B-07
(pares inglés-español), 2B-10 y 2B-19 (leer una división en inglés), 2B-12 (*commutative,
associative, distributive*: no aparecen en ninguna práctica), 2B-14 (*minuend,
subtrahend*; *dividend* y *divisor* sí salen, de refilón, en `division` 2); y **2C-10** (comprobar una resta con la operación inversa) y
**2C-13/2C-14** (contraejemplos de que la resta y la división no son conmutativas ni
asociativas).

## Tarea 13 · Semana 3 · Potencias y raíces cuadradas

| | Ejercicio | Destrezas (inventario U1) |
|---|---|---|
| ★ | exponente 2 · Multiplicación repetida | **3C-01**, 3C-04, **3C-05**, **3B-01**, **3B-02**, 3B-03, **3B-05**, **3B-11** |
| ★ | exponente 1 · ¿A qué afecta el exponente? | **3A-05**, **3A-06** (y 4A-04) |
| ★ | potencias10 1 · El deslizador de ceros | **3C-10**, **3B-13**, **3B-14**, 3B-15 |
| ★ | raiz 2 · Sin dibujo | **3C-11**, **3C-12**, 3C-13, **3C-14**, **3C-20**, **3C-21**, 3C-22, 3C-29, 3B-09 |
| ★ | jerarquia 2 · Potencias y raíces | **3A-01**, **3A-02**, **3A-03**, **3A-04**, 3A-13 (y 1A-06, 1A-07, 1A-08, 1A-09, 2A-11, 2A-12) |
| ★ | jerarquia 4 · Agrupadores invisibles | **3A-07**, **3A-08**, **3A-09**, **3A-10**, 3A-14, 1A-13, **3C-24** (y 4A-09, 4A-10, 4A-15) |
| | especiales 1 · ¿Verdadero o falso? | **3C-06**, **3C-07**, **3C-08**, **3C-09**, 3C-01, 3C-05, 3C-10 |
| | especiales 2 · ¿Cuál es la falsa? | **3C-30** |
| | potencias10 3 · Billion, million y trillion | **3B-16**, 3B-17, **3B-18** |
| | exponente 3 · El cuadrado de la suma, con áreas | **3A-12**, 3A-05, 1A-12 (y 4A-05) |
| | raiz 1 · Forma el cuadrado | **3C-11**, **3C-12**, **3C-14**, **3C-21**, **3C-23** |
| | propiedades 1 · Junta las potencias (ampliación) | **3C-15**, 3C-16 |
| | propiedades 2 · Potencia de potencia y cadenas (ampliación) | 3C-17, 3C-18, **3B-06** |
| | propiedades 3 · ★ La última cifra (reto) | 3C-19 |

Aquí sobran ejercicios: entran los 14 de la semana y ninguno de repaso. Las tres de
`propiedades` van de elegir porque son ampliación (catálogo: «ampliación de la unidad 1»;
tu decisión de septiembre: pesan poco), aunque el examen evaluara 3C-15. Quien elija
`especiales` hace las potencias especiales en un minuto cada una; quien no, las ve dentro
de `exponente` 2 (el «¿cuánto vale?» con distractores 3 · 4 y 4³).

**Examen de la semana 3 sin práctica:** **3B-10** (*radicand* y *radical sign*: no aparecen
en ninguna práctica) y **3A-11** (el exponente sobre el paréntesis con cuatro operaciones:
`parentesis` 2 lo hace con tres, y `exponente` 3 solo con una suma). 3B-07, 3B-12 y 3C-28 (leer una raíz en inglés, nombrar el resultado,
problema de raíz entera con resto) están en `raiz` 3, que he pasado a la semana 4.

## Tarea 14 · Semana 4 · Jerarquía de las operaciones y problemas

| | Ejercicio | Destrezas (inventario U1) |
|---|---|---|
| ★ | jerarquia 3 · Con paréntesis | **4A-01**, **4A-02**, **4A-14** |
| ★ | expresion 1 · Dos operaciones | **4C-01**, **4C-04**, **4C-05**, 4C-06, 4C-07, **4C-08**, 4B-17, 1A-17, 2C-25 |
| ★ | expresion 2 · ¿Hace falta el paréntesis? | **4C-02**, 4C-03, **4C-09**, **4B-01**, **4B-02**, 4A-17, 2A-16 |
| ★ | expresion 3 · Cuadrados y raíces | **4B-03**, **4B-04**, 4C-10, 4C-24, 4A-16, 3A-16 |
| ★ | raiz 3 · Problemas | **4C-14**, 4C-15, 3C-27, 3C-28, 3B-07, 3B-12, 3B-22 |
| ★ | errores1 1 · ¿Hay un error? | **4A-10**, **4A-11**, 4B-16, 4C-22 y la lista de errores típicos de la unidad (1A-03, 1A-04, 1A-05, 1A-12, 2C-03, 3A-06, 3C-01, 3C-11, 1C-13) |
| | parentesis 4 · Una sola diana | 1A-10, 1A-11, 2A-07, 2A-08 (con cuatro números) |
| | errores1 2 · Señala el paso | las mismas que `errores1` 1 |
| | errores1 3 · Nombra el error | las mismas que `errores1` 1 |
| | errores1 4 · ¿Paso a paso? | 4A-12, 4A-13 |
| | jerarquia 4 · Agrupadores invisibles ↺ (★ de la semana 3) | **4A-07**, **4A-08**, 4A-09, 4A-15 |
| | exponente 3 · El cuadrado de la suma ↺ (semana 3) | **4A-05** |
| | division 3 · ¿Qué significa el resto? ↺ (★ de la semana 2) | **4C-11**, 4C-12 |
| | redondeo 3 · Estimar y cazar el error ↺ (★ de la semana 1) | **4C-16**, **4C-17**, 4C-20 |

La semana 4 es la del «repaso integrador» de la secuenciación, y su examen evaluó en
contexto cosas de las semanas 1 a 3 (4A-05, 4A-07/08, 4C-11, 4C-16, 4C-17). Por eso lleva
cuatro de repaso entre los de elegir, en vez de los «1 o 2 de la semana anterior» que decía
la ficha: dos de la semana 3 y dos de las semanas 1 y 2. Si prefieres la regla de la
ficha, quita `division` 3 y `redondeo` 3 y quedan 6 de elegir (**pregunta 4**).

**Examen de la semana 4 sin práctica:** **4A-03** (una multiplicación dentro del paréntesis
no es lo mismo que fuera), **4B-07/4B-08** (*brackets, square brackets, radical sign,
fraction bar*), **4B-09/4B-10** (BIDMAS y PEMDAS: no aparecen en ninguna práctica), **4B-19**
(decir en inglés qué se hace primero; `jerarquia` 3 lo practica tocando, no diciéndolo),
**4C-23** (problema con una potencia y una división con resto), **4C-26** (problema de dos
pasos en el que el orden cambia el resultado) y **4C-18** (resolver el problema con la
distributiva o la compensación como atajo: ni `distributiva` ni `mental` tienen problemas).

## Ejercicios repetidos (↺)

Seis ejercicios salen en dos tareas de la U1: `jerarquia` 1 y `redondeo` 2 en la 11 y la
12; `jerarquia` 4 y `exponente` 3 en la 13 y la 14; `division` 3 en la 12 y la 14;
`redondeo` 3 en la 11 y la 14. Los otros 41 salen una sola vez, y los 47 están en alguna
tarea. Lo permite tu decisión del 16-10 (un ejercicio puede
ir en varias semanas), pero **hasta que la 45 esté implementada** el progreso es por
ejercicio, y quien lo haya hecho en una tarea lo verá ya terminado en la otra (y le cuenta
sin hacer nada). Con el progreso por tarea de la 45 eso desaparece.

Lo mismo pasa **con las tareas de la U2 de este curso**, que ya llevan ocho ejercicios de la
U1 como repaso: `jerarquia` 1 y `division` 2 (tarea 1), `exponente` 2 y `especiales` 1
(tarea 2), `parentesis` 1 y `raiz` 2 (tarea 3), `expresion` 1 y `errores1` 1 (tarea 4). Un
alumno de este curso que los haya hecho los verá terminados en las tareas 11-14. Para el
curso que viene no importa: empieza de cero.

Y al revés no se puede: las tareas de la U1 **no llevan prácticas de la U2** (por ejemplo
`leelo`, que lee potencias en inglés), porque en el curso que viene se harían antes de dar
divisibilidad (regla «nada que no se haya dado»).

## Destrezas sin práctica: candidatas a prácticas nuevas (propuesta aparte, sin montar)

Las 24 destrezas de examen que ninguna práctica cubre (arriba, semana a semana) se agrupan
en cinco ideas de prácticas nuevas y dos arreglos de prácticas que ya existen. Son para el curso que viene;
ninguna está montada ni reclamada.

| Idea | Destrezas | Cómo podría ser |
|---|---|---|
| **A · Los nombres de las operaciones** | 2B-01, 2B-02, 2B-06, 2B-07, 2B-14, 2B-10, 2B-19 | Una operación escrita grande; tocar el minuendo, el sustraendo, el cociente…; y leerla en inglés con el patrón de voz de `dictado` |
| **B · ¿Se puede cambiar el orden?** | 2B-12, 2C-13, 2C-14 (y 2C-12, 2C-15, 2C-16, que el examen no evaluó) | Igualdades con dos tarjetas que se intercambian: la app las calcula y el alumno decide si la propiedad vale; con la resta y la división, buscar el contraejemplo |
| **C · La operación inversa** | 2C-10 (y 2C-11, 4C-19) | Una cuenta hecha (a veces mal) y elegir o escribir la comprobación con la inversa |
| **D · BIDMAS y los agrupadores en inglés** | 4B-07, 4B-08, 4B-09, 4B-10, 4B-19, 3B-10 | Tocar en la expresión el agrupador que se nombra; cada letra de BIDMAS con su operación; «what do you do first?» con respuesta en inglés de lista cerrada |
| **E · Problemas de dos contenidos** | 4C-23, 4C-26, 4C-18, 4A-03, 1C-20 (y 2C-19, 2C-30, 2C-31, que el examen no evaluó) | Problemas cortos que piden una potencia y una división con resto, o en los que el orden de dos pasos cambia el resultado; los de distributiva y compensación en contexto; y «estima antes de calcular» con el enunciado delante |

Las dos que quedan no necesitan práctica nueva, sino un ejercicio más en una que ya existe:

- **1B-02** (escribir con palabras en inglés un número de cuatro o cinco cifras): ejercicio 4
  de `dictado`, al revés que el 1: se da el número y se ordenan fichas de palabras
  inglesas, como el 3 hace en español.
- **3A-11** (el exponente sobre el paréntesis, con cuatro operaciones): una variante de
  `parentesis` 2 con cinco números, o de `jerarquia` 3 con la potencia fuera del paréntesis.

Dos huecos que dejaron decisiones anteriores, para que no se olviden: `mental` perdió el 9-10
el ejercicio 3, y con él 2C-23, 2C-24, 2B-21, 2B-22 (elegir estrategia o herramienta), 2C-30 y
2C-31 (problemas donde conviene compensar o descomponer); y la ficha de `distributiva` citaba
2C-19 y 4C-18 (la distributiva en problemas), pero sus tres ejercicios no tienen problemas.
Todos ellos caben en la idea E.

Si se hacen, todas cumplen las reglas de `proyecto.md` (en particular la 9, el repaso de
realismo de los enunciados, en la E).

## Lo que tienes que decidir

1. **Cómo se usan.** (a) Como repaso sin plazo: las cuatro visibles desde ya en la portada,
   para quien quiera. (b) Solo las que tú actives, cuando y para quien quieras (obligatoria
   para todos o asignada a algunos alumnos, con el modelo de la 45). La propuesta no lo
   decide.
2. **¿Valen como «nucleares» las destrezas de los exámenes semanales?** Si hay otras que
   consideras nucleares de la U1, los ★ pueden cambiar.
3. **La semana 1 con 6 de elegir y la semana 2 con 7**, en vez de 8, porque no hay más
   ejercicios de esas semanas. La alternativa sería repetir más ejercicios ↺.
4. **La semana 4 con cuatro de repaso** entre los de elegir (o seis de elegir, sin
   `division` 3 ni `redondeo` 3).
5. **Los títulos.** Siguen el estilo de las de la U2 («Semana 1 · …»). Si la portada va a
   mezclar tareas de dos unidades, quizá convenga «U1 · Semana 1 · …»; depende de cómo
   las agrupe la 45.
6. **Qué prácticas nuevas** de la lista A-E quieres para el curso que viene, si alguna.

## Fuentes (todas leídas, ninguna modificada)

- Inventario de la U1: `apuntes-1eso-bilingue/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv` (272 destrezas, sin columna de nucleares).
- Secuenciación: `apuntes-1eso-bilingue/1. Natural numbers, powers and roots/secuenciación-unidad1.tex` (17-09). La copia de `apuntes-1eso-bilingue/secuenciación-unidad1.tex` que cita la ficha es **más antigua** (13-09) y difiere, aunque el `LEEME.md` de la unidad las llama «copia idéntica».
- Destrezas de cada examen: `exámenes-semanales/semana-N/clave-semanaN.json` (`destrezas`, 20 por semana) y `destrezas-semanaN.md` (semanas 2-4).
- Ejercicios de cada práctica: `practicas/<slug>/textos.js` y `practica.js` en `HEAD` (commit 60acb73); destrezas por ejercicio: fichas `reparto-practicas-u2/tareas/tarea-19-…` a `tarea-33-…`, con el reparto entre ejercicios hecho a partir de la descripción de cada uno cuando la ficha da la lista para toda la práctica (`parentesis`, `jerarquia`, `errores1`). Comprobado en el código: `mental` ya no tiene problemas ni elección de estrategia; `distributiva` no tiene problemas; `expresion` 1 tiene las familias de cadena (4C-07) y «por, entre, por» (4C-08); el vocabulario *minuend, subtrahend, commutative, associative, distributive, radicand, BIDMAS* no aparece en ninguna práctica.
- Formato: `practicas/_comun/tareas.js` (tareas 1-4 de la U2).
