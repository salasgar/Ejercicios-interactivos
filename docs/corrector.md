# Corrector de los exámenes semanales

Página web (`corrector/`) con la que el profesor registra, corrige y guarda cada respuesta
de cada alumno en los exámenes semanales tipo test en papel. Escrita el 2026-09-18.

- Publicada con la app: https://salasgar.github.io/Ejercicios-interactivos/corrector/
- En local: `npm run servir` y abrir http://localhost:8080/corrector/ (son módulos ES:
  no funciona abriendo el archivo directamente).
- Los datos se guardan en el navegador (`localStorage`) y **no salen del ordenador**: no
  hay Firebase ni servidor. Por eso hay que descargar una copia de seguridad (pestaña
  *Datos*) después de cada sesión de corrección.

## Por qué así

La idea (conversación del 2026-09-18) es registrar la **letra** que marca cada alumno, no
solo si acierta, porque cada distractor del examen encarna un error concreto. Con eso se
puede seguir el progreso de cada alumno por destreza, informar a las familias, preparar
refuerzo personalizado y evaluar el propio material. Teclear las 20 letras de un alumno
sustituye a la corrección a mano (con la penalización de −1/3, calcular la nota a mano
es más lento), así que no añade trabajo.

Alternativas descartadas por ahora: escaneo (ZipGrade, AMC: horas de montaje y obliga a
cambiar la franja de respuestas), examen digital (se pierde el papel) y hoja de cálculo
(se rompe con cuatro versiones barajadas y destrezas). El modelo de datos permite añadir
el escaneo más adelante como otra forma de entrada.

## Archivos

| Archivo | Qué es |
|---|---|
| `corrector/index.html`, `estilos.css` | La página |
| `corrector/app.js` | Interfaz y almacenamiento |
| `corrector/logica.js` | Lógica pura: lectura de lo tecleado, corrección, estadísticas, CSV. Importa de `src/altas.js` la forma de construir el identificador del alumno, para que sea el mismo que en la app |
| `tests/corrector.test.js` | Tests de la lógica (`npm test`) |
| `comun/exportar_clave.py` (carpeta de exámenes en iCloud) | Produce `semana-N/clave-semanaN.json` a partir de los datos y el sorteo de la semana |

## La clave de cada semana (`clave-semanaN.json`)

Se genera en la carpeta de los exámenes:

```
cd ".../1. Natural numbers, powers and roots/examenes-en-clase"
/usr/bin/python3 comun/exportar_clave.py semana-2
```

Lee los mismos datos y el mismo `sorteo.json` que el examen impreso, así que las claves
son idénticas a las del PDF (se comprueba con `assert`). Contenido: `formato` (1),
`semana`, `fecha`, `n_preguntas`, `opciones` (4), `destrezas` (id del inventario de cada
posición) y `versiones`: por código, las preguntas **en el orden impreso**, cada una con
`n` (número impreso), `pos` (posición en los datos: la destreza), `item`, `correcta`,
`enunciado` y las cuatro `opciones` con `texto` y `expl` (la explicación del resuelto
explicado: en un distractor, qué error lleva a él).

Para la semana 1 (generador antiguo) el exportador usa el adaptador de
`comun/prueba_semana1.py`; desde la semana 2 usa el objeto `S` de `semana-N/generar.py`.
El exportador no escribe nada más que el JSON.

## Uso semanal

1. **Una vez**: pestaña *Alumnos*, pegar la lista con el mismo formato que el alta por
   lotes de la app (`Nombre Apellidos; Grupo` o `Nombre Apellidos; usuario o email; Grupo`).
   Poner el mismo usuario o email que tienen en la app para poder cruzar los datos.
   Grupos actuales: 1.ºA (29 alumnos) y el grupo mixto de 1.ºC y 1.ºD (23).
2. **Cada semana**: generar `clave-semanaN.json` y cargarlo en *Claves*.
3. **Corregir**, con una franja recortada delante: elegir el alumno en el desplegable
   (se puede teclear el principio del nombre), teclear el código de 4 cifras (salta solo
   a la casilla de respuestas si es válido), teclear las 20 letras en orden e Intro.
   `-` (o espacio) es en blanco, `?` es nula (ilegible, dos cruces). Se escribe la
   respuesta **que vale**: si el alumno tachó una fila y contestó detrás, la de detrás.
   También se puede hacer clic en las casillas. Mientras se teclea, la tabla de pantalla
   reproduce la de la franja y marca en rojo los fallos, y el marcador da la nota.
   Con **Teclado posicional** marcado, las cuatro opciones caen en cuatro teclas seguidas
   —`U I O P` valen por `A B C D`—, que es como están impresas en la franja: se teclea sin
   mover la mano ni buscar las letras. Las letras `A`-`D` siguen valiendo igual, y `-` y `?`
   no cambian. La cabecera de la tabla recuerda la tecla de cada opción y el modo se guarda
   de una sesión a otra.
   Los alumnos ya tecleados desaparecen del desplegable (al lado dice cuántos faltan);
   **Ver también los ya corregidos** los devuelve para rectificar alguno. El código de la
   versión **se conserva** al pasar al siguiente alumno, porque los exámenes se corrigen en
   montones ordenados por grupo y versión; se borra al cambiar de semana o con *Limpiar*.
   Al guardar se pasa al siguiente. Un alumno ya registrado aparece con ✓ y su nota; al
   elegirlo se carga su registro para editarlo.
4. **Resultados**: notas de la semana por grupo, acierto por posición (destreza) con el
   reparto de letras por versión, y ficha de un alumno con todas sus semanas y, en cada
   fallo, la explicación de la opción que eligió.
5. **Datos**: CSV resumen (una fila por alumno y semana) y CSV detalle (una fila por
   respuesta), copia de seguridad JSON y restauración.

Puntuación: la impresa en el examen. Acierto +1, fallo −1/(opciones−1) = −1/3, blanco y
nula 0, nota mínima 0. Puntos sobre 20; nota = puntos / 20 × 10, con dos decimales.

## Lo que no hace todavía

- Informes más elaborados (evolución por destreza a lo largo de las semanas, comparación
  entre grupos): esperar a tener tres o cuatro semanas de datos y diseñarlos con casos
  reales.
- Cruzar con los resultados de la app: los identificadores ya coinciden, pero el cruce
  se haría fuera (los dos CSV).
- Entrada por escaneo.
