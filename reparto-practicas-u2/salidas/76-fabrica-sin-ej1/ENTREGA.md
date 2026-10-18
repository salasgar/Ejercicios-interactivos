# Entrega de la tarea 76 — Fábrica de divisores sin el ejercicio 1

Sesión `s-20261017T224938-945993c9` · 2026-10-17/18

## Commits

- **f726ec1** — el código (14 ficheros, `git show --stat f726ec1`): `practicas/fabrica/{practica,logica,textos}.js` y `estilos.css`,
  `practicas/_comun/{catalogo,base,nube,tareas}.js`, `practicas/portada.js`, `practicas/resultados.js`,
  `tests/practicas-{fabrica,comun,semana,renumerar}.test.js` (el último, nuevo).
- **2436e08** — nota para la 70 (`hechos/notas/s-20261017T224938-945993c9-para-la-70.md`).
- **dd09dc5** — la fila `fabrica` de `DESTREZAS` (`registro.js`) sin U2-3C-01 y el §7 de
  `docs/practicas-unidad2.md` a juego (el test de `practicas-registro` exige que coincidan).

## Qué queda

La Fábrica tiene **2 ejercicios**: 1 = «¿Cuántos divisores tiene?» (el 2 de antes) y
2 = «Sin dividir» (el 3 de antes), sin ningún otro cambio. Destrezas: U2-3C-02 y U2-2C-14
(U2-3C-01, «obtener todos los divisores», se queda sin práctica hasta la 77).
Portada: «Cuenta los divisores de un número con su factorización y decide sin dividir si uno
es divisor de otro.» y su versión inglesa.

## Cómo se adapta el progreso guardado, y dónde

En `catalogo.js`, la fila de la Fábrica declara `quitados: { antes: 3, posiciones: [1] }`
(documentado en la cabecera), y `adaptarProgreso(slug, ej)` quita esas posiciones de toda
lista que tenga exactamente 3 elementos; lo demás lo devuelve tal cual (la misma lista).
Se aplica en **todo** lo que lee un `ej` guardado, antes de fusionar o contar:

| Dónde | Qué lee |
|---|---|
| `nube.js`, `leerNube` | la nube en el modo antiguo, `practicas-tareas` y el espacio (`progreso-libre`, `progreso-tareas`): el slug viaja aparte. Si adapta, devuelve `adaptado: true` |
| `nube.js`, `subirFusionado` | reescribe el documento si venía adaptado (aunque la fusión no cambie nada) |
| `base.js`, `progresoGuardado` | el navegador (portada y página de la tarea) |
| `base.js`, `cargarProgreso` | el navegador al abrir la práctica; si adaptó, lo vuelve a guardar con 2 |
| `base.js`, `sincronizarGuardado` y `leerYFusionar` | suben a la nube si lo leído venía adaptado |
| `resultados.js`, `leerDocumentos` | el panel (todas las colecciones; `profesor.js` no lee `ej` por su cuenta) |

No toca: `herramientas/informe-actividad.mjs` (lee `ej` crudo; con la Fábrica fuera de la
tarea 1 no le afecta hasta la tarea 2, y para entonces los documentos se habrán reescrito al
abrirlos) ni `practicas/profesor-migracion.js` (de la 70; ver la nota).

OJO para el futuro (escrito en `catalogo.js` y comprobado por test): si la Fábrica vuelve a
tener 3 ejercicios, las listas nuevas se confundirían con las viejas.

## Tareas

- Tarea 2: ★ = criba 2, semáforo 3, árbol 1, **árbol 2**, divisiones 1, divisiones 2;
  elegir 4 de 7 = criba 1, árbol 3, divisiones 3, **fabrica 1** («¿Cuántos divisores?»),
  factorizaciones 2, exponente 2, especiales 1. 100 puntos.
- Tarea 3: fabrica 3 → **fabrica 2** («Sin dividir»).
- En Classroom, la descripción de la tarea 2 («of the other 8» → «of the other 7») la cambia la coordinadora.

## Recuento de la nube

- **Progreso** (`practicas/fabrica--<código>` y `practicas-tareas/t2|t3--fabrica--<código>`,
  códigos 1-64 y AJJN, lectura REST sin autenticación, solo `get`): **un único documento, el de
  AJJN (n.º 1000, alumno ficticio de Juan Luis)**, con 3 posiciones (construir terminado; contar
  con 1 fallo; sin dividir sin empezar). **Ningún alumno de 1-51 ha abierto la Fábrica con código.**
  Durante la prueba se creó el del código 60 (7NPD), ya con 2.
- **Fallos** (`fallos/`): no se pueden leer sin la cuenta del profesor (ni el informe los lee).
  Como ningún alumno tiene progreso de la Fábrica en la nube, lo esperable es que los únicos
  fallos de la Fábrica sean los de AJJN (1 en el ejercicio 2 de antes, el de contar) y el que
  dejó la prueba con 7NPD (ejercicio 1 nuevo). Comprobación en 1 minuto: panel → «Fallos» →
  práctica «Fábrica de divisores». **No se ha escrito nada en la nube salvo con el código 60.**
  Propuesta si aparece alguno de un alumno: renumerar 2→1 y 3→2, y apartar los del 1 (con su visto bueno).

## Paso 6 (paso de Juan Luis, tarea 70)

Al cerrar, la 70 seguía EN CURSO preparando el paso «de verdad» con él. f726ec1 está en main
desde las ~23:05Z: si el paso se hizo con el panel publicado **antes** de esa hora, **la
configuración de tareas copiada a su espacio lleva las tareas 2 y 3 viejas y hay que corregirlas
en el editor de tareas del panel antes del lunes 26-10**. Ver la nota para la 70.

## Cómo probarlo en 1 minuto

`npm run servir` → http://localhost:8080/practicas/fabrica/?c=7NPD (código de prueba 60).
En la consola, antes: `localStorage.setItem('practicas.v1.fabrica.7NPD', JSON.stringify({ ej: [{puntos:10,objetivo:10,vidas:5,racha:0,aciertos:10,fallos:0,reinicios:0,terminado:true,dia:1}, {puntos:6,objetivo:10,vidas:5,racha:0,aciertos:6,fallos:2,reinicios:0,terminado:false,dia:0}, null] }))`
y recargar: el ejercicio 1 lleva 6/10. `semana.html?t=2` enseña 6 ★ y 7 para elegir 4.

Probado en Chrome (2026-10-17, ~23:00Z): menú con 2 ejercicios y lo de antes en su sitio
nuevo; fusión con la nube; acierto y fallo en el 1; fallo en el 2; inglés; portada «1 de 2
ejercicios»; tarea 2; a 375 px (en un iframe: la ventana no bajaba de 1358) sin desbordar.
