# Veredicto de la segunda revisión — tarea 36 (PU2)

Sesión `s-20261009T082156-0a34d7a4` · 2026-10-09 · sobre el commit `8279d74`.

**De las 28 prácticas reabiertas, 14 SE ENTREGAN sin nada que corregir y 14 NO SE ENTREGAN
todavía.** De esas 14, una tiene un hallazgo grave y **se ha retirado de la portada** (la 05,
criba); las otras 13 tienen hallazgos menores y **siguen enlazadas**. Cada NO SE ENTREGA tiene
su reapertura en `hechos/reabiertas/NN--s-20261009T082156-0a34d7a4.md`.

Las correcciones de la tarde del 8 de octubre están bien hechas casi sin excepción: de los 121
puntos numerados que pedían las 28 reabiertas, 114 están COMPROBADOS, 6 HECHOS A MEDIAS
(cuatro valen así; no valen el 2 de mental y el 2 de expresion) y 1 NO HECHO en la práctica
(criba, punto 1). Lo que queda es, sobre todo, lo que la corrección
trajo de nuevo (una coma, una concordancia, un punto perdido) y tres defectos que no eran de
las reabiertas y que esta pasada ha encontrado: la lista corta de la criba, los exponentes que
no suben en propiedades y el redondeo de la frase de la coma en constructor.

## Cómo se ha revisado

| Punto de la ficha | Qué se hizo |
|---|---|
| 1-4. Cada punto hecho, sin defecto nuevo, «qué NO rehacer» y decisiones intactas | Seis revisores de solo lectura bajo este sid leyeron el diff entero de cada práctica (`git diff 6a0359e..8279d74`), su reabierta y el código de hoy, y reprodujeron los puntos graves con scripts propios (entre 2000 y 20 000 ítems por ejercicio, con aritmética independiente). **Esta sesión verificó después en el código cada hallazgo** y reprodujo con scripts suyos los de criba, mental, jerarquia y expresion. |
| 5. Contador por puntos | `grep` en las 31 prácticas: ninguna declara `inicial` ni `maximo`; ningún texto habla de «+2» ni de 20 como objetivo. `especiales` pinta su propia racha («3 aciertos seguidos»), que es un indicador y no el objetivo. |
| 6. Móvil | Chrome sin ventana, 375 × 667, español, inglés y modo alterno, en criba, fabrica, reloj, baldosas, factorizaciones, distributiva, potencias10, dictado, mental, propiedades, errores, errores1 y parentesis: 12 ítems por ejercicio e idioma (unos 6 fallados), midiendo contra 375 fijo y mirando las capturas. **Nada pasa de 375 px en ninguna.** Sí hay una fila que se sale de su tarjeta (reloj) y un defecto de pantalla que no es de anchura (propiedades). No se ha probado en un móvil de verdad. |
| 7. Autostash | `git diff 58bd3a4 8279d74` sobre las rutas de la incidencia: el código de jerarquia, reloj, fabrica, errores1, leelo y division coincide en `HEAD` con lo que se llevó el stash (o tiene más). **No se perdió nada de las prácticas.** `corrector/` (fuera del reparto) seguía solo en el stash al empezar esta revisión; lo recuperó el commit `34b7d00` mientras corría, y hoy coincide con el stash. |
| 8. Tests | `npm test`: 647 de 647 sobre `8279d74` y 648 de 648 en el árbol al cerrar. Los tests nuevos de las reaperturas fallarían con el código viejo, con las salvedades anotadas por práctica. Ningún test ejecuta `practica.js`, y por ahí se cuelan los dos defectos más visibles (criba y propiedades). |

## Las que se entregan (14)

| Tarea | Práctica | Puntos de su reabierta | Notas (no obligan) |
|---|---|---|---|
| 02 | `semaforo` | 1-3 COMPROBADOS (20 000 ítems: 0 huecos iniciales donde el 0 cumpla) | El test de «`[3]`» no fallaría con el código viejo |
| 04 | `recta` | 1-4 COMPROBADOS (4000 respuestas simuladas: 0 frases falsas) | — |
| 07 | `divisiones` | 1-4 COMPROBADOS (20 000 escaleras: 0 primos; 33 % con 11 o 13) | Tras un fallo el mensaje habla del número anterior cuando ya se ve el siguiente (ya era así) |
| 08 | `fabrica` | 1-4 COMPROBADOS (20 000 ítems: 0 divisores ≥ n) | En el ejercicio 3 el divisor pasa de n/2 en el 19 % (se contesta «no» sin pensar) |
| 15 | `leelo` | 1-2 COMPROBADOS (20 000 frases: 0 «×», 0 «two times») | HCF como tercera lectura sigue (decisión de Juan Luis) |
| 21 | `exponente` | 1-6 COMPROBADOS | `4 · 4` contestado con 2⁴ sigue siendo fallo, con un mensaje que ya es cierto: era una de las dos salidas que daba la reabierta |
| 22 | `raiz` | 1-3 COMPROBADOS | — |
| 23 | `division` | 1-4 COMPROBADOS (las 12 combinaciones de género leídas) | — |
| 25 | `redondeo` | 1-3 COMPROBADOS (390 000 cadenas con separador: 0 mal agrupadas aceptadas; «12.00» no vale) | El aviso español de «no es un número natural» no dice qué está mal (el inglés sí) |
| 28 | `potencias10` | 1-2 COMPROBADOS; 0 distractores «N billion = N · 10¹²» en 6046 ítems | — |
| 29 | `dictado` | 1-4 COMPROBADOS; con voz simulada y sin voz, sin desbordes | — |
| 31 | `especiales` | 1, 2, 3 y 5 COMPROBADOS; 4 HECHO A MEDIAS (valía así) | 2⁴ = 4² sale en el 16-17 % de los ítems del ejercicio 2 (antes, 43 %). Nunca 0⁰. **Decidido por Juan Luis el 9-10**: fuera del ejercicio 2 (`31--…f75f5cdb-decisiones.md`) |
| 32 | `errores1` | 1-5 COMPROBADOS; móvil sin desbordes | Sin publicar hasta que cierre su reapertura de decisiones del 9-10 (`saltoPaso` pasa a un ejercicio 4 propio). Por lo que toca a la reabierta del 8-10, está lista |
| 19 | `parentesis` | 1-3 COMPROBADOS; móvil sin desbordes | «con otros paréntesis» es falso si el alumno deshace y rehace la misma colocación (raro); el detalle del ejercicio 2 sigue diciendo «el cuadrado» y hay cubos en el 4 % |

## La que no se entrega, con hallazgo grave (retirada de la portada)

| Tarea | Práctica | Puntos de su reabierta | Lo grave | Reabierta |
|---|---|---|---|---|
| 05 | `criba` | 2-5 COMPROBADOS; 1 NO HECHO en la práctica (el texto está bien, quien lo llama está roto) | Ejercicio 3: (a) con «la lista MÁS CORTA que basta probar», en el **28,8 % de los ítems** el número es compuesto y la lista corta que se da por falsa también basta (n = 100: buena «2, 3, 5, 7», falsa «2, 3, 5»); quien la elige pierde punto y vida. (b) La opción «hasta la mitad de…» se pinta «hasta la mitad de **undefined**» en todos los ítems. Además, una coma sin espacio («ni 7,y 11 · 11») y el arrastre con el dedo por confirmar | `05--…0a34d7a4.md` |

## Las que no se entregan, con hallazgos menores (siguen en la portada)

| Tarea | Práctica | Puntos de su reabierta | Qué queda | Reabierta |
|---|---|---|---|---|
| 30 | `mental` | 1, 3, 4 COMPROBADOS; 2 HECHO A MEDIAS (no vale) | «La más corta es descomponer» en cuentas que ya son por 10 o por 20: «24 · 10 = 10 · 2 · 12 = 20 · 12», y dos circulares («30 · 3 = 3 · 10 · 3 = 30 · 3»). 683 de 5000 ítems llevan un factor múltiplo de 10; quien contesta «lápiz y papel» recibe ese mensaje y un fallo más. **Queda sin objeto en cuanto se cumpla la decisión del 9-10 de eliminar el ejercicio 3** (`30--…f75f5cdb-decisiones.md`); hasta entonces sigue saliendo | `30--…` |
| 33 | `propiedades` | 1-3 COMPROBADOS | **Los exponentes del enunciado no suben** en los ejercicios 1 y 2: «(6⁸)⁴ =» se ve «(68)4=» (CSS anterior a las reaperturas; la primera revisión no lo vio). Se lee con esfuerzo; en todos los ítems | `33--…` |
| 24 | `expresion` | 1, 3 COMPROBADOS; 2 HECHO, pero se pasa de ancho | La suma repetida acepta una ficha suelta con el resultado en casos raros (`30` en caramelos con 4, 30, 8, 2): 0,45 % de los ítems del ejercicio 1. No penaliza a nadie | `24--…` |
| 26 | `constructor` | 1-5 COMPROBADOS | Ejercicio 3: la frase de la trampa redondea y dice «836.369 sería 836.37» (10 % de los ítems; ya estaba). El campo de texto acepta «12.00» como 1200 | `26--…` |
| 20 | `jerarquia` | Los de las dos reabiertas, COMPROBADOS (104 000 estados: 0 pasos aceptados que cambien el valor; los cuatro casos de la decisión de Juan Luis, bien) | `9 + 8 − 8`: hacer antes `8 − 8` no cambia el valor y se penaliza (0,7 % del ejercicio 1). La introducción del ejercicio 1 pone un ejemplo con potencia | `20--…` |
| 27 | `distributiva` | 1-3 COMPROBADOS; 4 HECHO A MEDIAS (falta el separador de miles en un mensaje) | El feedback escribe un negativo: «(3 − 12) · 5 vale -45». «1 celdas» | `27--…` |
| 12 | `reloj` | 1-7 COMPROBADOS | Móvil: la fila de los minutos del ejercicio 2 se sale 14 px por cada lado de su tarjeta (no llega a 375) | `12--…` |
| 14 | `errores` | 1-6 COMPROBADOS; móvil sin desbordes | «Está bien: no hay ningún error. Está bien: …» repetido (30 % del ejercicio 1); se arregló en la 32 y aquí no | `14--…` |
| 16 | `factorizaciones` | 1-4 COMPROBADOS | Falta un punto antes de «Compruébalo:» y hay frases en minúscula tras punto | `16--…` |
| 10 | `imposibles` | 1, 2, 4, 5, 6 COMPROBADOS; 3 HECHO A MEDIAS (vale, con el menor) | «¿Pueden salir 1 bolsa?»; el feedback dice «grupos» donde el enunciado dice bolsas | `10--…` |
| 13 | `baldosas` | 1-7 COMPROBADOS; móvil sin desbordes | «sobran 1 dm» | `13--…` |
| 11 | `clasificador` | 1-4 COMPROBADOS; 5 HECHO A MEDIAS (vale, con el menor) | «(todas llevan lo mismo…)» con sobres | `11--…` |
| 03 | `rectangulos` | 1-4 COMPROBADOS | «falta 1 celda (las tachadas)» | `03--…` |

## Sobre la gravedad

Se ha aplicado la definición de la ficha: grave es que se penalice una respuesta correcta, que
haya dos respuestas defendibles o que no se pueda contestar. Tres casos son de juicio y se
dejan dichos:

- **jerarquia** (`a + b − b`): por la letra es grave, pero sale en el 0,7 % de los ítems y solo
  si el alumno elige ese paso. No se retira.
- **mental**: no quita puntos ni vidas (cuenta como ayuda), pero suma un fallo a quien contesta
  bien. No se retira; el ejercicio afectado desaparece con la decisión del 9 de octubre.
- **propiedades**: se puede contestar, pero el enunciado se ve mal en todos los ítems de dos
  ejercicios. No se retira; si Juan Luis prefiere retirarla, basta `disponible: false` en la
  fila id 30.

## Lo que cambió mientras se revisaba

A las 09:37Z la coordinadora registró ocho reaperturas con decisiones de Juan Luis del 9 de
octubre (13, 14, 15, 24, 26, 30, 31 y 32: `hechos/reabiertas/NN--s-20261008T174225-f75f5cdb-decisiones.md`).
No contradicen este veredicto, pero hay que leerlas juntas:

- La **15**, la **31** y la **32** se entregaban según esta revisión y quedan reabiertas por
  decisión suya, no por un defecto.
- La **13**, la **14**, la **24**, la **26** y la **30** tienen dos reabiertas: la de decisiones
  y la de esta revisión. Se corrigen en el mismo reclamo.
- En total hay 17 tareas reabiertas: 03 05 10 11 12 13 14 15 16 20 24 26 27 30 31 32 33.
