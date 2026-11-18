# ENTREGA tarea 148 — práctica «¿Es solución?» (es-solucion, unidad 6)

Commit: 3327fcd. Ficheros: `practicas/es-solucion/{practica.js,logica.js,textos.js,estilos.css}` (el `index.html` ya existía) y `tests/practicas-es-solucion.test.js`. `disponible` sigue en `false` (lo cambia la 157).
Probar: `npm run servir` → http://localhost:8080/practicas/es-solucion/?probar=1 (sin código) → Empezar.

## Ejercicios
1. **Compruébalo**: «¿Es x = 4 solución de 3x + 2 = 14?», Sí / No. La mitad de los ítems lo son; las que no, usan un valor que sale de un error típico de resolver (transponer sin signo, pasar el factor restando, multiplicar en vez de dividir, dividir al revés, perder el signo). El feedback hace la cuenta de cada miembro con ese x y compara.
2. **¿Qué ecuación?**: dado x = s, cuatro ecuaciones y solo una se cumple. Cada falsa es una ecuación a la que un error típico le da justo s; las cuatro tienen soluciones distintas.
3. **¿Identidad o ecuación?**: `2x + 3x = 5x` frente a `x + 5 = 9`. El feedback prueba dos valores y lo ve. **Ver «Decisiones a revisar».**
4. **Inventa una**: «escribe una ecuación cuya solución sea x = 5» (a veces con «que tenga un número delante de la x»). Se corrige resolviendo lo que escribe, no comparando con una respuesta; `x = 5` tal cual y las erratas de escritura se avisan sin contar como fallo.

Destrezas: U6-2C-02 (1, 2), 2C-03 (3), 2C-04 (4); ids provisionales: F0 sin firmar.

## Decisiones a revisar
- **Ejercicio 3 (identidad)** depende del punto (f) de F0, que no está firmado. Si F0 lo rechaza: quitar el ejercicio (basta sacarlo de `ejercicios` en `practica.js`) o cambiarlo por un segundo ítem del 1.
- **«Nada que no se haya dado»**: la ficha pedía incluir paréntesis y x en los dos miembros; en los ejercicios 1, 2 y 4-ejemplos las ecuaciones llevan la x en UN miembro y sin paréntesis (los dos aún no se han dado en la semana 2). Solo el ejercicio 3 pone la x en los dos miembros, porque no se despeja: se sustituye.
- **Papel reservado (reabierta 148 de la 157)**: `reserva.js` lleva por huella (`huellaEcuacion`) las 124 ecuaciones de la hoja 2, sus recuadros, las hojas 1 y 3 y los exámenes, también cuando la misma ecuación sale en otra tarea del papel (el feedback enseña su solución). Los cuestionarios Forms no se reservan (sin decisión de Juan Luis). Los casos no están en claro.
- Ejercicio 4: **los paréntesis se rechazan** con el aviso «Escríbelo sin paréntesis» (no gasta intento; son de la semana 3). La x en los dos miembros sí se acepta; se corrige igual (solo importa la solución).
- Ejercicio 4: `x = s` (la solución pedida, escrita tal cual) es el aviso «ya es la solución»; `x = otro número` es un fallo con su explicación.

## Cotas de realismo (no hay contexto de la vida real)
|c| ≤ 60 y |valor probado| ≤ 60 en todos los ítems; coeficientes 2-9 (−2…−5 si negativo), constantes 1-12 (hasta 20 en `b − ax`); soluciones −6…12, nunca 0.

## Pruebas
12 tests propios (3000 ítems por ejercicio, evaluador propio con BigInt que lee el texto mostrado): lo que se ve se cumple o no según dice; las falsas nacen de un error nombrado; en el 2 solo una se cumple y las cuatro tienen soluciones distintas; el 3, identidades se cumplen con 51 de 51 valores y las ecuaciones con exactamente uno; el 4, 15 casos de escritura; cuentas del feedback evaluadas; sin ×, %, 1x, «+ −», x², guion por menos ni separador decimal del otro idioma. `npm test` 1727/1727.
**No probada en navegador** (sesión lanzada sin supervisión): la reviso la 157 con clics, a 375 px y ancho, ES y EN, acierto y fallo en los cuatro ejercicios. Especialmente: el aviso rojo bajo el campo del ejercicio 4 y los botones Sí/No.

## Reabierta de la 157 (sesión s-20261118T003437-6d4c097c)
Hecho: reserva por huella (A + B, 124); `cuentaMiembro` con coeficientes y constantes exactos (decimales como «0,5 · 5», fracciones como «5 : 5»); `index.html` enlaza `./estilos.css`; `talcual` solo si es la solución pedida; «pasar restando el factor» excluido con coeficiente ±1; feedback sin dos «:» seguidos, causas del error redactadas para el alumno (no el nombre del registro), ej. 2 sin repetir la ecuación, «La respuesta es sí/no» en minúscula, «No lo sé» del ej. 4 dice primero qué ecuación; ejemplo de ayuda del ej. 4 no reservado. Tests nuevos (reserva en 20000 ítems con huella inventada, cuentas con x/5, 0,5x, x + 0,5, talcual, ±1, redacción). Variedad tras reservar: ej. 3, 1467 ítems distintos en 20000; ej. 1, 11061.
Pendiente menor: el ej. 2 con s = 7 nunca sale (no hay tres errores para esa solución; la lista lo incluye sin efecto). **Sin probar en navegador** en esta sesión (sin supervisión); la 157/158 repite los clics a 375 px, sobre todo ej. 4 con «x/5 = 1» y «0,5x = 2,5».
