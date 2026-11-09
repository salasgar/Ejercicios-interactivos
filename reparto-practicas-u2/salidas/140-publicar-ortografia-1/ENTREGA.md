# ENTREGA · Tarea 140 · Revisión y publicación de la ortografía 1 («Las letras» y «Puntuación y mayúsculas»)

Sesión `s-20261109T095010-067ba651` (Opus 5.5), relevo de `s-20261108T112003-49cc4f20` (caducó el 8-11 a las 14:20Z sin cerrar;
leyó los dos bancos, dejó 5 recortes sin commitear en `ortografia-letras` y decidió no publicar la puntuación). Sus recortes se han
revisado uno a uno: 4 se quedan, 1 se deshace y se cambia por otro (abajo).

Commit del código: **`d7561ed`** (empujado a `main`). Ficheros (`git show --stat`):
- `practicas/_comun/catalogo.js`: `disponible: true` en la fila 65 (`ortografia-letras`). La 66 sigue en `false`.
- `practicas/ortografia-letras/logica.js`: los 5 recortes.
- `tests/practicas-ortografia-letras.test.js`: deja de buscar «vivir» (recortado) y «acción» pasa a «dirección» en un ejemplo de `idError`.
- `tests/practicas-ortografia-comun.test.js` (**fuera de la lista de la ficha, declarado**): el test de la 134 exigía `disponible: false`
  en todos los bloques «hasta su revisión (140-142)»; ahora lleva la lista `PUBLICADOS = ['ortografia-letras']`, que amplían la 141 y la 142.
- `docs/practicas-ortografia.md` §7 (tabla de qué hay publicado) y `README.md` (párrafo de la sección Ortografía: no hay tabla de filas).

`npm test`: 1699/1699. Tests propios (común + letras + puntuación): 104/104.

## Veredicto (contra los criterios de la ficha y solo contra ellos)

### `ortografia-letras` (65): SE PUBLICA, con 5 ítems quitados
Leídos todos: 360 ítems (ej. 1: 63 · ej. 2: 101 · ej. 3: 92 · ej. 4: 104, antes del recorte). Quitados (≤ 5, sin escribir ninguno):
1. Ej. 1, nivel 3: «Cuando llegué, mi hermano ya _ salido de casa.» (ha): con «Cuando llegué» el tiempo es «había salido»; la frase buena no es buena.
2. Ej. 1, nivel 3: «Lo que _ pasado ayer no se puede repetir.» (ha): «ha pasado ayer» no es la norma en España («pasó»).
3. Ej. 1, nivel 2: «Va a _ muchos alumnos en la excursión.» (haber): recorte de la sesión anterior, sin motivo escrito; no le veo fallo, pero
   este ejercicio es el ★ de la U6 y lo dejo fuera (no baja de los mínimos).
4. Ej. 4, nivel 2: «_ocina» (c/z/qu): el hueco es la c de «co», que suena /k/, y la explicación dice la regla de ce/ci («delante de e y de i…»).
5. Ej. 2, nivel 3: «_ivir» (vivir): el hueco es la primera v y la explicación habla de la terminación -vir («excepción a los verbos en -bir»).
   **Este lo quito yo**; para no pasar de 5, **vuelve «a_ión» (acción)**, que la sesión anterior había quitado sin motivo escrito y no tiene nada dudoso.
Quedan (1 / 2 / 3): ej. 1 18 / 19 / 23 · ej. 2 25 / 46 / 29 · ej. 3 20 / 37 / 35 · ej. 4 43 / 22 / 38. Todos ≥ 16 y equilibrados (test).
El resto: cada mala da una palabra que no existe o va en frase que fuerza una lectura (tubo/tuvo, perro/pero…); ningún par de la lista negra;
sin seseo (casa/caza no aparece); nombres: ninguno de persona salvo «Enrique» (genérico) y «Ana» e «Irene» en una frase.

Con clics (`npm run servir`, «Probar sin código», `?nivel=1|2|3`, Chrome): los 4 ejercicios en los 3 niveles, acertando y fallando; tras un
fallo la buena queda escrita en verde en el hueco, la mala en rojo, y el feedback dice la regla con esa palabra o frase; la etiqueta de nivel
se ve. A 375 px, dentro de un iframe de 375 px (la ventana de Chrome no se deja estrechar): sin scroll horizontal, botones y feedback en
columna. `error` y `respuesta`: la base no los escribe en la consola (la ficha decía que sí); los cubre el test de `idError` de la 136.

### `ortografia-puntuacion` (66): NO SE PUBLICA
Leídos todos: 48 + 50 + 50 + 48 correos + 16 asunto/cuerpo (212). **29 dudosos o mal**: 10 en el ej. 1 (cargos con mayúscula de respeto, «El
Principito», «instituto Salvador Sandoval», «universidad de Murcia», saludo con dos puntos en la misma línea), 2 en el ej. 2 («Marta, mi prima
vive en Lorca» vale con vocativo; «Sí voy contigo» vale enfático), 4 en el ej. 3 (a «¡Silencio!» y «¿Has comido?» les falta el punto tras las
comillas; los puntos suspensivos con minúscula valen si el enunciado sigue) y 13 correos del nivel 3 (la coma de la despedida no la regula el
DPD). Lista exacta, fuentes y arreglos: **`hechos/reabiertas/137--s-20261109T095010-067ba651.md`**. Comprobado y bien: la coma ante «sino» y ante
«pero» con oraciones. Fuentes: DPD 2.ª ed. (rae.es/dpd, 9-11-2026): «mayúsculas» 5.1.3, 5.4.2-5.4.3; «dos puntos» 2.9; «comillas» 2.d;
«puntos suspensivos» 1; «coma» 2.4.6; «sino» 2.1; «punto» 2.2c.
Con clics: ej. 4, nivel 3, visto: dos opciones que solo se diferencian por la coma tras «Muchas gracias».

## Propuesta de ★ de la U6 (para la tarea del panel de la unidad)

El plan de `proyecto.md` ponía «Mayúsculas» en la U6 · 3 y «hay, ahí…» en la U6 · 4. Como «Mayúsculas» no se publica, **se cambian de orden**:

| Semana | ★ | Ejercicio | Bloque publicado | Título sugerido de la semana |
|---|---|---|---|---|
| U6 · 3 (lun 15-2) | `['ortografia-letras', 1]` | hay, ahí, ay; a ver, haber | **sí** (9-11) | Ortografía: hay, ahí, ay; a ver, haber |
| U6 · 4 (lun 22-2) | `['ortografia-puntuacion', 1]` | Mayúsculas | **no** (reabierta la 137; la publica la 141) | Ortografía: las mayúsculas |
| U6 · 4, si la 141 no la ha publicado el jue 18-2 | `['ortografia-letras', 2]` | ¿b o v? | **sí** (9-11) | Ortografía: b o v |

Líneas literales para el editor: `['ortografia-letras', 1]` (U6 · 3) y `['ortografia-puntuacion', 1]` o, si no, `['ortografia-letras', 2]` (U6 · 4).
Si la U6 · 4 usa «b o v», «Mayúsculas» ocupa el hueco que deja «b o v» (U8 · 1, lun 26-4). El editor lista las transversales al final: se
marcan por `['slug', n]`, no por posición.

Del resto del plan, ya publicados y sin cambio: `['ortografia-letras', 2]` b o v (U8 · 1), `3` g o j (U8 · 2), `4` Otras letras (U8 · 3).
Siguen sin publicar los de puntuación: `['ortografia-puntuacion', 2]` (U8 · 4), `3` (U8 · 5) y `4` (junio · 2), que publicará la 141 con la reabierta.

**La tabla de ★ del calendario del curso** (`apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md`, «Ortografía en las tareas
semanales de la app») no se edita desde este reparto: la actualiza Juan Luis o una sesión de los apuntes con esta tabla.

## Hallazgos fuera de criterio (decide Juan Luis)
1. **El ★ de la U6 · 3 cambia de ejercicio** (de «Mayúsculas» a «hay, ahí…»), porque la puntuación no está lista. Si prefiere esperar a la
   puntuación, la reabierta tiene que cerrarse antes del jue 4-2 y la 141 publicarla antes del jue 11-2.
2. **El tipo «cargo» del ej. 1 no tiene arreglo dentro de la regla**: cualquier cargo admite la mayúscula de respeto (desaconsejada, no
   prohibida). La reabierta propone cambiarlo por profesiones («Mi tía es Enfermera»), que tienen regla sin excepciones.
3. **El nivel 1 de «El correo al profesor» casi no son correos al profesor**: «¿Qué tal estás?», «¡Qué guapo es tu perro!», «Te llamo luego
   porque ahora no puedo», «Quiero que me ayudes…» son mensajes a un amigo, de tú. Valen para practicar abreviaturas y signos, pero el título
   no les va. Se puede renombrar el ejercicio («Del chat al correo») o cambiar las frases.
4. En letras, «sílaba» está marcada como excepción (`exc-bv`) y no lo es: lleva b como «cantaba», y su explicación («en cambio «cantaba»
   es de un verbo») confunde. No es un ítem dudoso (la respuesta es una sola); es un retoque de explicación para cuando se toque el bloque.
5. En letras, al forzar `?nivel=3` también salen ítems de niveles 1 y 2. Es como está diseñado (`elegirDeNivel` nunca da uno de nivel
   superior, sí inferiores); lo apunto porque la ficha decía «cada ejercicio en los tres niveles».

## Cómo probarlo en 1 minuto
https://salasgar.github.io/Ejercicios-interactivos/practicas/ → sección «Ortografía» → «Ortografía: las letras» → «Probar sin código».
En local, `npm run servir` → http://localhost:8080/practicas/ortografia-letras/?nivel=3.
