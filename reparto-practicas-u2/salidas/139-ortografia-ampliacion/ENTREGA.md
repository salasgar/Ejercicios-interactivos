# ENTREGA · Tarea 139 · Bloque «Ortografía: ampliación» (`ortografia-ampliacion`, id 68)

Sesión: `s-20261106T125545-5612b77b`. Commit del código: **`78cc428`** (5 ficheros). Fecha: 2026-11-06.
Sin publicar: sigue con `disponible: false`; la publica la 142 (o la tarea que dé de alta la coordinadora).

## Ficheros entregados

- `practicas/ortografia-ampliacion/logica.js`: los cuatro bancos (`PORQUES`, `VERBOS` sobre `ERRORES`, `SIGLAS`,
  `AVANZADA`), `LISTA_NEGRA`, `FUERA`, `MOTIVOS`, generadores, explicaciones e `idError`.
- `practicas/ortografia-ampliacion/practica.js`, `textos.js`, `estilos.css` (sustituyen el esqueleto de la 134;
  `index.html` sin tocar).
- `tests/practicas-ortografia-ampliacion.test.js` (nuevo, 11 tests).

## Cómo probarlo en 1 minuto

`npm run servir` → http://localhost:8080/practicas/ortografia-ampliacion/?nivel=3 → «Probar sin código» → cualquier
ejercicio. Con `?nivel=1` y `?nivel=2`, los otros niveles. Cada introducción empieza con el aviso «Ampliación: esto es
más de lo que se pide en 1.º de ESO».

Probado en Chrome el 2026-11-06: los cuatro ejercicios en los tres niveles, un acierto y un fallo en cada uno (12 × 2),
en ancha y a 375 px (dentro de un iframe de 375 px, como la 138).

## Qué hay en cada ejercicio (ítems por nivel 1/2/3)

| Ejercicio | Pieza | Ítems | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|---|---|---|
| 1 · porque, por qué, porqué, por que | `montarHueco`, cuatro botones fijos | 16/16/16 | porque dentro de una pregunta; por qué indirecto («Me pregunto _»); los porqué y por que más claros | más porqué; por qué al final («sin decir _»); «es _ confío» | más por que, también con indicativo («se caracteriza _ tiene»); porque tras un verbo de preguntar ya completo («Me lo preguntó _») |
| 2 · Formas verbales | `montarHueco`, buena y mala barajadas | 19/18/17 | -ste con «tú» (dijiste, fuiste…), anduve/anduvo/anduviste, haya, participios (escrito, abierto, vuelto, puesto, devuelto) | caber, -ducir, -jeron, apretar, fregar, soldar, sé, anduviera, resuelto | haber impersonal (hubo, había, habrá, ha habido, puede haber, va a haber, haya), prever, satisfacer, deshizo, cabrán, yendo, ve |
| 3 · Siglas, abreviaturas y prefijos | `montarElegir`, buena + 1-2 malas | 17/17/16 | siglas sin puntos, sin plural y en mayúsculas; abreviaturas con punto y tilde; «etc.» | prefijos pegados (exalumna, antivirus, semicírculo…) y separados ante dos palabras (ex primer ministro, pro derechos humanos) | guion ante cifra o mayúscula (sub-16, anti-OTAN), rr tras prefijo (autorretrato, semirrecta), currículums, cómics, álbumes, «exjugadora de la selección» |
| 4 · Puntuación avanzada | `montarElegir`, buena + 1-2 malas | 16/16/17 | raya de diálogo (guion, espacio, mayúscula, punto antes de la raya); punto fuera del paréntesis | punto y coma en enumeraciones con comas; punto y coma fuera de las comillas | inciso del narrador en medio (raya de cierre, «—Ya voy —dijo Marta—. Espérame»); dos puntos que anuncian; «; sin embargo,»; punto tras «¿…?» |

En el ejercicio 1, cada forma acierta entre el 18 % y el 31 % de su nivel (5/5/3/3, 4/4/5/3, 4/4/3/5).

## Cotejo con el DPD (2.ª ed., rae.es/dpd, desde Chrome) y lo descartado

| Lo descartado o cambiado | Por qué | Fuente |
|---|---|---|
| «por que» tras **preocuparse, esforzarse, luchar, votar, rogar, abogar** (la ficha proponía varios) | con subjuntivo y sentido final valen **las dos** grafías, porque y por que | DPD «porque», 1b y 3 |
| «por que» relativo («la razón por que») | admite «por la que»: la ficha ya lo dejaba fuera | DPD «porque», 2a |
| «ansioso / impaciente por que» | el DPD escribe «alegrarme porque se haya…» (causal con subjuntivo): con adjetivos de emoción, dudoso | DPD «porque», 1a |
| la coma de menos detrás de «sin embargo» como mala | «se recomienda» aislarlo entre comas: es recomendación | DPD «sin embargo» |
| la coma en lugar del punto y coma delante de «sin embargo» como mala | la lista de la ficha la deja fuera en frase corta, y el DPD no la condena | DPD «coma», 2.2.4 |
| dos puntos frente a punto y coma entre oraciones sin anuncio | «también se podrían usar los dos puntos» | DPD «punto y coma» |
| «álbums», «pósters», «Srs.», «a.m.», «súper bien», «rompido», «contrarreloj» | no constan como incorrectos, o son dobles grafías o dudosos | DPD |
| «ovni/OVNI», «posguerra», «clubs», extranjerismos, «iros», «freído», «imprimido», «callaros» | los de la ficha | ficha |

Confirmado como incorrecto: ⊗frega/frego (DPD «fregar»), ⊗solda (DPD «soldar»), ⊗apreta (DPD «apretar»), ⊗satisfació
y ⊗satisfaceré (DPD «satisfacer»), ⊗preveer/⊗prevee/⊗preveyó (DPD «prever»), ⊗andé/⊗andaste/⊗andara (DPD «andar»),
⊗conducí/⊗condució (DPD «conducir»), ⊗dijieron (DPD «decir»), ⊗haiga y ⊗hubieron/⊗habían impersonales, también en
perífrasis «podía haber», «va a haber» (DPD «haber»), ⊗llendo (DPD «ir»), siglas «sin puntos» y ⊗ONGs/⊗CD's (DPD
«sigla»), ⊗currícula como plural (DPD «currículo»), ⊗álbunes (DPD «álbum»), la raya de cierre del inciso y la
minúscula tras ella (DPD «raya», 2.3), el punto tras las comillas «incluso si estas van precedidas de […] un signo de
cierre de interrogación o exclamación» (DPD «comillas», 2d).

Las formas en -stes (dijistes) son el voseo etimológico «con valoración negativa» (DPD «voseo»): en el ejercicio 2
salen siempre con «tú» delante, y el test lo comprueba.

## Hallazgos fuera de criterio (decisión de Juan Luis o de la 140)

1. **La 137 da por buenas dos frases que el DPD da por malas.** En `practicas/ortografia-puntuacion/logica.js`
   (DOS_PUNTOS, nivel 2), `El profesor gritó: «¡Silencio!»` y `Mi madre me preguntó: «¿Has comido?»` son la buena del
   ítem **sin punto final**; el DPD («comillas», 2d) pide el punto detrás de las comillas aunque dentro haya ? o !
   («¡Silencio!».). Este bloque enseña la regla del DPD en el nivel 3 del ejercicio 4, así que la app se contradice
   hasta que se arregle la 137. Lo natural es que lo corrija la 140 al revisar la 137 (añadir el punto a la buena de
   esos dos ítems y revisar sus malas); no lo he tocado porque no es mío.
2. **«porque / por que» con sentido final** debería ir a la lista de `docs/practicas-ortografia.md`, §6 (lo que nunca
   es distractor), junto con lo que añadió la 138.

## Propuesta: cómo ofrecer el bloque (para la 142, que se la pasa a Juan Luis)

1. **Libre en la portada** (recomendada): sale en la sección «Ortografía» como los demás bloques, con su aviso de
   ampliación en cada ejercicio; quien quiera, entra. No cuesta nada y no presiona a nadie.
2. **«A elegir» en las tareas de la U8**, como alternativa a la ★ de ortografía de esa semana para quien ya la tenga
   hecha (no en lugar de ella).
3. **Asignada** solo a los alumnos que Juan Luis marque (los que van muy bien en ortografía), nunca como ★.

## Propuestas (no hechas)

- Lo del hallazgo 1 (arreglar la 137) y lo del 2 (la lista del §6).
