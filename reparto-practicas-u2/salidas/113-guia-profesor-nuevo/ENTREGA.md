# Entrega de la tarea 113 · Guía para el profesor y prueba del circuito de un profesor nuevo

Sesión `s-20261105T221100-40dab58f` (PU2 T113, ALTO), del 5-11 22:11Z al 5-11 23:4xZ, con Juan Luis
delante. Releva a `s-20261102T121638-895cefb8` (caducada el 2-11 16:32Z), que había hecho con él los
pasos 1 y 2 de la 71 (copia de Firestore del 2-11).

Commit: **`38aafa2`**: `docs/practicas-guia-profesor.md` (nuevo) y `practicas/profesor.html` (enlace
«Guía» en la cabecera, junto a «Ver las prácticas», a la vista de GitHub de la guía: Pages sirve los
`.md` sin formato). `npm test` 1425/1425. Enlace probado en local, ancho y a 375 px.

**Juan Luis ha leído la guía y la da por buena** (6-11), y pidió el enlace en el panel.

## Antes del circuito: lo que quedaba de la tarea 71 (pasos 4-6), hecho con Juan Luis

Por este orden, el seguro de la entrega de la 71 (copia → borrar → comprobar → publicar):

1. **Comprobación otra vez** con la sesión de Juan Luis (REST desde su panel): las cinco colecciones
   viejas seguían con 60 / 9 / 3 / 438 / 1 = 511 documentos, como la copia del 2-11
   (`Curso 2026-2027/copias-firestore/2026-11-02/`, recuento propio y recuento por agregación iguales),
   y **ninguno con `updateTime` posterior a la copia** (2026-11-02T12:18:26Z).
2. **Borrado**: Juan Luis borró en la consola `practicas`, `practicas-tareas`, `practicas-asignaciones`,
   `fallos` y `divisores`. Comprobado por REST: las cinco, 200 con 0 documentos y recuento 0;
   `practicas-profesores` y su espacio, intactos.
3. **Reglas publicadas** por Juan Luis (`firestore.rules` de `bd7cb89`, igual que `origin/main`).
   Comprobado: las colecciones viejas dan 403 hasta con su cuenta; su espacio, 200.
4. **Banco REST** (Juan Luis en Terminal, contraseñas con `read -s`): **178 de 178**, incluidas las 30
   de «Colecciones del modo antiguo, cerradas».
5. **Panel de Juan Luis**: sin selector de sistema; «Mis alumnos» con sus 52 filas (51 + AJJN), todas
   con código de 4; secciones «Profesores» y «Cuenta lectora»; «Cargar fallos», 1838 fallos de 40
   alumnos desde el 29-10. El informe de las 21:30 no se ha podido mirar (la sesión fue después).

**Con esto la 71 queda completa** (nada de su lista de comprobación queda pendiente, salvo mirar que el
informe del 6-11 llega).

## El circuito de un profesor nuevo (5-11, de 23:00Z a 23:35Z aprox.; 0:00-0:35 peninsular del 6-11)

Las cuentas A y B son de correo y contraseña y el panel solo deja «Entrar con Google», así que con
ellas no se puede probar el alta. Juan Luis decidió hacer de compañero nuevo con su **Gmail personal**
en un perfil de invitado de Chrome; la separación entre A y B la prueba el banco REST (178/178), y la
separación entre profesores se ha visto además con ese Gmail frente a su cuenta del centro.

| Paso | Resultado |
|---|---|
| Entrar con Google sin alta | «Aún no tienes acceso…» y «Le ha llegado tu solicitud con tu correo (…)». La solicitud aparece en su panel al momento |
| Dar de alta (y «Rechazar» la solicitud basura del banco) | bien; «Volver a comprobar» abre el espacio vacío |
| 3 alumnos inventados, códigos de 8, lista cifrada | bien a la primera |
| Tarea de la U4 (3 ★ + 1 de 2), desde hoy, plazo 13-11 | «Tarea 1 guardada»; enlace `semana.html?t=1`; 🔒 al pasar su `desde` |
| Alumna con su enlace directo: 1 fallo (9/10 por 9/5) y 1 acierto | explicación del fallo con sus números, muy buena; «1 de 40 puntos» |
| «Hoy», «Tareas de la semana», «Retrasos», «Cargar fallos» | cuadran (1 de 3 ha entrado, ★ 0 de 3 · 1 pt, pendiente, el fallo con lo que contestó) |
| El administrador y el espacio del Gmail | 403 en el documento del espacio, la lista, el progreso, los fallos y las asignaciones; 200 solo en `config/tareas` (público por diseño) |
| Alumno con el enlace común, tecleando `A6PK-6LNX` con guion | entra y ve su tarea |
| «Otro ordenador» (perfil de invitado nuevo) | códigos con «(no está en la lista)»; «Descifrar» con la contraseña de prueba da los tres nombres |
| Dar de baja | «Tu acceso está desactivado. Habla con Juan Luis si crees que es un error.» |

El Gmail de Juan Luis **queda de baja**, con sus 3 códigos y su tarea de prueba en la nube (la baja no
borra; no molestan).

## Tropiezos y propuestas (para la coordinadora)

Ninguno rompe el circuito; por eso no se abre ninguna reabierta. Por orden de importancia:

1. **APROBADA por Juan Luis el 6-11 (dar de alta antes del 14-12): enlace «probar» junto a cada
   ejercicio en el editor de tareas**, que abra ese ejercicio en otra pestaña en modo de prueba (sin
   guardar nada y sin usar el código de alumno recordado). Hoy el editor solo da el nombre de la
   práctica y del ejercicio, y el profesor no sabe qué pide cada uno sin ir a buscarlo a la portada.
   MEDIO, corta: `practicas/profesor-tareas.js` y, para el modo de prueba, `_comun/base.js`.
2. **APROBADA por Juan Luis el 6-11: `docs/practicas-como-empezar.md` (de la 69) se queda en una línea
   que remite a `docs/practicas-guia-profesor.md`** y los enlaces que apunten a ella (§9 de
   `docs/practicas-unidad2.md`, README) pasan a la guía. Ahora dirían casi lo mismo en dos sitios.
3. **Título de la tarea antes del código** (`practicas/semana.js`, `pintarEntrada`): sin código,
   `tarea` es la de Juan Luis (`tareasSinCodigo`, commit 118fb32), así que el alumno de un compañero ve
   «U2 · Semana 1 · Múltiplos, divisores y criterios» encima de la casilla del código. El propio
   comentario dice «antes, el título es genérico»: debería ser «Tarea de la semana» hasta resolver el
   código cuando la tarea venga de la dirección. La guía lo avisa mientras tanto.
4. **«Fallos, uno a uno» con cosas internas**: el ítem como JSON
   (`{"ejercicio":1,"tipo":"barra",…}`), el tipo de error como identificador
   (`cuenta-todas-las-partes`), las destrezas como ids del inventario (`U4-1B-02…`) y la nota final
   remite a `docs/practicas-unidad2.md, §7`. Para un compañero, ruido.
5. **«Hoy» → «Ejercicios de la tarea»** nombra los ejercicios por slug (`que-fraccion ej. 1 ★`), no
   con el nombre que el profesor eligió en el editor («¿Qué fracción es? · Lee la figura»).
6. **«Hoy» no se actualiza al crear la primera tarea** (sigue «Aún no tienes tareas» hasta recargar).
7. **«Resumen de todas las prácticas»**: 51 columnas de todo el curso, y «Caza el error» y «Léelo en
   inglés» salen tres veces sin decir de qué unidad. Proponer: columnas de la unidad elegida, o el
   prefijo de la unidad en el título.
8. **Textos**: «cuentan los 1 que lleves mejor» (con 1 a elegir: «cuenta el que lleves mejor»);
   «Correct! Correct: …» repetido en inglés en `que-fraccion`; «1 pedidos», «1 fallos», «1 alumnos»
   en los recuentos del panel; el «(0:09:03)» del final de «Cargar de la nube» es la hora y parece una
   duración.
9. **Puntos de una tarea**: 10 por ejercicio, así que una tarea de 4 ejercicios son 40 puntos y no se
   normaliza a 100 (Juan Luis sube las notas sobre 100). La guía lo explica; si se quiere sobre 100
   siempre, es una decisión suya.
10. **El banco REST borra datos reales de la cuenta A**: su limpieza borra `config/tareas`,
    `privado/nombres` y el documento del espacio de A, también lo que había antes (tras esta ejecución,
    `config/tareas` de A da 404; los códigos de prueba 62 y 63 siguen registrados en A, pero ya sin
    tareas). Proponer: que el banco guarde y restaure lo que encuentra, o que A sea una cuenta solo
    para el banco. Mientras tanto, quien use los códigos 62/63 para probar tareas tiene que volver a
    ponerle tareas a A.
11. A y B salen en «Profesores → Dados de alta» con el uid en vez de nombre y fecha 1/1/1970 (se dieron
    de alta a mano en la consola). Cosmético; con un compañero real sale bien.

## Lo que tiene que hacer Juan Luis antes del lunes 14-12

1. **Semana del 30-11 al 4-12**: mandar a los tres compañeros el enlace del panel y el de la guía
   (https://github.com/salasgar/Ejercicios-interactivos/blob/main/docs/practicas-guia-profesor.md), y
   pedirles que entren con Google para dejar su solicitud.
2. **Cuando aparezcan sus solicitudes**: comprobar el correo de cada una y «Dar de alta» (las que no
   conozca, «Rechazar»). Dar de alta a compañeros reales lo hace él, no ninguna sesión.
3. **Antes del 14-12**: que la coordinadora dé de alta las propuestas 1 y 2 (aprobadas) y, si las
   quiere, la 3 a la 8.
4. **Semana del 14-12**: mirar cada día el uso de Firestore (§9.9 de `docs/practicas-unidad2.md`,
   umbral 70 %).
5. Mirar que el informe diario del 6-11 (21:30) le llega con las reglas nuevas.
