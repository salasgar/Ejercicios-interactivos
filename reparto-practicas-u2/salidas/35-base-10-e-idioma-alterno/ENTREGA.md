# Tarea 35 — Entrega

Sesión `s-20261007T205921-9d74da56` · commit `6cfc713`

## Ficheros entregados

- `practicas/_comun/contador.js`: `INICIAL = 10`, `PENALIZACION = 2`, `MAXIMO = 20`.
- `practicas/_comun/base.js`: idioma por ítem (modo alterno equilibrado por
  bloques de 4, o fijo por `?idioma=es|en` guardado por alumno), recorte de
  progreso guardado con parámetros antiguos, botón de traducción tras
  responder, cabecera sin selector (con la etiqueta no pulsable del idioma
  del ítem).
- `practicas/_comun/textos.js`: `TRADUCCION` (textos del botón «Ver en
  español» / «See in English»).
- `practicas/_comun/estilos.css`: `.etiqueta-idioma`, `.traducir`, `.traduccion`.
- `practicas/plantilla/practica.js`: comentarios del contrato actualizados
  (10/2/20, `api.idioma` por ítem, traducción).
- `practicas/profesor.js` y `practicas/profesor.html`: selector «Idioma de
  los enlaces» (alterno/español/inglés) que añade `&idioma=` a todos los
  enlaces de la tabla 1; columna de detalle con «EN: aciertos/fallos» cuando
  la nube trae esos contadores.
- `tests/practicas-comun.test.js`: valores nuevos del contador, recorte de
  progreso, `modoIdioma`, `crearSecuenciaIdiomas` (equilibrio y racha máxima
  4), `TRADUCCION`.
- `README.md`: apartado «Prácticas de la unidad 2» con la regla nueva.

## Cómo probarlo en 1 minuto

1. `npm run servir` y abre `http://localhost:8080/practicas/plantilla/`.
2. «Probar sin código»: el menú dice «acertar 10 veces… máximo de 20»; no hay
   botones ES/EN en la cabecera.
3. Abre el ejercicio 1: cada ítem lleva una etiqueta «ES»/«EN» no pulsable en
   la cabecera, según le toque; tras responder sale «Ver en español» / «See
   in English», que despliega el mismo ítem traducido y de solo lectura.
4. `http://localhost:8080/practicas/plantilla/?idioma=es`: sin etiqueta, todo
   en español.
5. `http://localhost:8080/practicas/profesor.html`: el selector «Idioma de
   los enlaces» añade `&idioma=es` (o `en`) a la tabla de enlaces.

## Qué cubre

Afecta a la base común (contador e idioma), heredada por las 30 prácticas de
aplicación y por `divisores/` cuando lo migre la tarea 17.

## Tests

`node --test tests/practicas-comun.test.js`: 39/39 en verde. `npm test`
completo (incluye ficheros de otras sesiones en curso): 351/351 en verde en
el momento de cerrar.

## Comprobado en el navegador

Chrome, 386×563 (móvil), `practicas/plantilla/` (probando sin código):
acierto y fallo en el ejercicio 1, traducción ES↔EN tras responder, idioma
fijado por `?idioma=es` sin etiqueta ni selector. Regresión en
`practicas/semaforo/` (ya LISTA): sigue funcionando con los parámetros e
idioma nuevos. Panel del profesor: selector de idioma de los enlaces añade
el parámetro a la tabla.

## Propuestas pendientes

Ninguna.
