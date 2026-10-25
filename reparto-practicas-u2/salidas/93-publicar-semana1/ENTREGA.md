# Entrega de la tarea 93 · Revisión y publicación de la semana 1 de la unidad 3

Sesión `s-20261025T073054-518d0701`, 2026-10-25. Commit del código: **6677a4e**.

## En una línea

**Publicadas: `opuestos`, `situaciones` y `ortografia`.** **Reabiertas (sin publicar): `termometro` (80), `saltos` (83) y `leelo3` (91)**,
por un feedback falso y por realismo; las tres son arreglos cortos de banda MEDIO. Cuando estén cerradas, **la 94 las verifica otra vez y
las publica** (puede hacerlo en cuanto la 93 está LISTA, no tiene que esperar al 19-11). Para que la tarea de la semana 1 salga completa
el lunes 16-11, las tres tienen que estar publicadas antes del jueves 12-11.

## Ficheros (git show --stat 6677a4e)
- `practicas/_comun/catalogo.js`: `disponible: true` de `opuestos`, `situaciones` y `ortografia` (solo ese campo).
- `practicas/situaciones/textos.js`: errata de una línea, «habla de el nivel del mar, no de el dinero» → «del» (feedback de otro tema, ES).
- `tests/practicas-semana.test.js`: dos tests de la portada daban por hecho que en la U3 no había nada publicado; ahora comprueban
  «sin publicar» sobre una copia del catálogo y que la portada enseña justo las publicadas. **Este fichero no estaba en «Ficheros que
  toca» de la ficha**: sin tocarlo, publicar rompe `npm test`. Cambio mínimo (12 líneas), sin quitar ninguna comprobación.

`npm test`: 1147/1147.

## Portada
Hoy (25-10) no cambia nada para los alumnos: la U3 no sale en la portada hasta su `desde` (lun 16-11). Ese día, la sección «Unidad 3»
enseña «Semana 1 · Los enteros: recta, orden, sumas y restas» con `opuestos` y `situaciones`, y un bloque «Otras» con la ortografía
(comprobado con `bloquesPublicados`). Por URL directa las publicadas ya funcionan.

## Qué se ha revisado y cómo
- **Regla de oro**: lógica y textos de las cinco prácticas leídos enteros; 40-50 ítems por ejercicio de elegir generados con sus funciones
  (`leelo3` ej. 1-4, `situaciones` ej. 2, `saltos` ej. 3 y 5) y cada distractor leído. **Ninguno puede darse por bueno** en ninguna de las
  cinco (parejas válidas nunca enfrentadas; en `situaciones` ej. 2 los distractores llevan siempre el signo contrario).
- **Nada que no se haya dado**: cada ejercicio contra la columna `sesion` del inventario y la secuenciación. Fuera de la semana 1 (es normal,
  pero la tarea no los manda): `saltos` ej. 4 y 5 (sesión 5) y `leelo3` ej. 2, 3 y 4 (semanas 2, 3 y 4).
- **Realismo**: cotas leídas en el código y 10 enunciados por contexto leídos enteros (`situaciones` 6 + 3 contextos, `saltos` 4, `leelo3`
  temperaturas, saldo, buceo, ciudades). Medido a máquina lo que se sale (ver reabiertas).
- **Navegador** (Chrome headless por CDP, «Probar sin código», servidor propio en el puerto 8093): `opuestos` y `situaciones`, un acierto y un
  fallo de cada ejercicio a 375 px en español, y un fallo por ejercicio a 1000 px en inglés. Sin desbordes (scrollWidth = ancho), sin errores
  en consola, feedback con los números del ítem, «Comprobar» oculto al responder.

## Por qué se reabren tres (detalle en `hechos/reabiertas/NN--s-20261025T073054-518d0701-revision.md`)
- **80 `termometro`**: en «Mayor o menor», con dos positivos o con 0 y un positivo, el fallo dice «Un número negativo es siempre menor que uno
  positivo…: 3 está a la izquierda de 8», y registra `compara-valor-absoluto` (dato falso en «qué falla más»). Y el aviso del ej. 4 no usa los
  números del ítem.
- **83 `saltos`**: en el ej. 5, el 58 % de los ítems tiene alguna frase de respuesta fuera de la cota de su contexto («el ascensor acaba en el
  piso −12» con garaje hasta −3; «el buceador acaba en el nivel 8 m», fuera del agua; «−160 €»). Y «te faltan 1». Los ej. 1-3 están bien.
- **91 `leelo3`**: en el ej. 1, respuestas correctas de hasta −60 °C («negative fifty-one degrees») y distractores de hasta −95 °C; en el
  ej. 4, dos ciudades con temperaturas que no se dan el mismo día («Warsaw (−12 °C) … Athens (27 °C)»).

## Propuesta de la tarea de la semana 1 (para que Juan Luis la monte en el panel; no está creada)

`U3 · Semana 1 · Los enteros: recta, orden, sumas y restas` / `U3 · Week 1 · Integers: number line, order, adding and subtracting`
· `unidad: 3` · `desde: '2026-11-16'` · `hasta: '2026-11-19'` (como las de la U2: de lunes a jueves; el examen es el vie 20-11).
**6 ★ + 4 a elegir = 100 puntos** (la ortografía es uno de los ★: el resto suma 90).

| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 1]` «¿a o ha?» | — (decisión del 23-10) | sí |
| ★ | `['termometro', 1]` Coloca el entero | U3-1C-03 nuclear (1) | tras la reabierta |
| ★ | `['termometro', 3]` Mayor o menor | U3-1C-05 nuclear (1) | tras la reabierta |
| ★ | `['opuestos', 2]` Distancia al cero | U3-1C-08 nuclear (1) | sí |
| ★ | `['saltos', 1]` Salta en la recta | U3-1C-11, 12 y 13 nucleares (2-3) | tras la reabierta |
| ★ | `['situaciones', 3]` Un paso | U3-1C-16 nuclear (2-3) | sí |
| elegir | `['termometro', 4]` Ordena | U3-1C-06 nuclear (1) | tras la reabierta |
| elegir | `['opuestos', 1]` El opuesto | U3-1C-07 nuclear (1) | sí |
| elegir | `['situaciones', 1]` ¿Qué entero es? | U3-1C-01 nuclear (1), 1B-04 | sí |
| elegir | `['situaciones', 2]` ¿Qué situación es? | U3-1C-01 nuclear (1) | sí |
| elegir | `['saltos', 3]` De izquierda a derecha | U3-1A-01 nuclear, 1A-02 (3) | tras la reabierta |
| elegir | `['leelo3', 1]` Los enteros (en inglés) | U3-1B-01 y 1B-03 nucleares, 1B-02 (1) | tras la reabierta |
| elegir | `['saltos', 2]` ¿Qué signo tendrá? | U3-1C-14 (2-3) | tras la reabierta |
| elegir | `['termometro', 2]` ¿Qué temperatura marca? | U3-1C-04 (1) | tras la reabierta |
| elegir | `['termometro', 5]` ¿Positivo, negativo o ninguno? | U3-1C-02 (1) | tras la reabierta |
| elegir | `['opuestos', 3]` Opuesto y valor absoluto | U3-1C-09 (1) | sí |
| elegir | `['opuestos', 4]` ¿Quiénes están a esa distancia? | U3-1C-10 (1) | sí |

`nElegir: 4` (11 en la lista).

```js
  estrella: [['ortografia', 1], ['termometro', 1], ['termometro', 3], ['opuestos', 2], ['saltos', 1], ['situaciones', 3]],
  elegir: [['termometro', 4], ['opuestos', 1], ['situaciones', 1], ['situaciones', 2], ['saltos', 3], ['leelo3', 1], ['saltos', 2], ['termometro', 2], ['termometro', 5], ['opuestos', 3], ['opuestos', 4]],
  nElegir: 4,
```

Criterio: los ★ son la recta (colocar y comparar), el valor absoluto y las dos primeras formas de sumar y restar (en la recta y en un
problema), lo que más pesa en la prueba del viernes. `saltos` 3 va en «a elegir» porque es de la sesión 3, el jueves 19-11, el mismo día
del plazo. Los de las sesiones 2-3 (`saltos` 1, `situaciones` 3) se pueden hacer desde el martes 17-11.

- **Destrezas nucleares de la semana sin práctica: ninguna.** Las 13 (1A-01, 1B-01, 1B-03, 1C-01, 03, 05, 06, 07, 08, 11, 12, 13 y 16) tienen
  al menos un ejercicio en la lista. No nuclear y sin ejercicio de la semana: U3-1C-15 (un número y su opuesto dan 0; cambiar el orden),
  que solo sale en `saltos` 4, de la sesión 5.
- **Si el jueves 12-11 alguna de las tres reabiertas no estuviera publicada**, sus ejercicios no se pueden poner. Con solo lo publicado hoy
  hay 7 ejercicios de la U3 más la ortografía (80 puntos): harían falta 2 de repaso de la U2 para llegar a 100.

## Observaciones para Juan Luis (no son fallos; no se ha cambiado nada)
1. `situaciones` ej. 3 es muy guiado: la escala del termómetro o la recta termina justo en el resultado (se ve escrito antes del salto), y las
   dos frases dan el número sin signo. Así lo diseñó la ficha 82 (ver el salto y elegir el signo); vale para la sesión 2, pero no mide si
   el alumno sabe restar. Si lo quieres más exigente, sería una tarea nueva.
2. `situaciones`, feedback del ej. 1 y 2: «"tengo" es por encima de cero: positivo», «"d. C." es por encima de cero». Se entiende, pero suena raro.
3. `opuestos` ej. 3: tras responder, «Opuesto de 7 = −7 |7| = 7» va sin separador entre las dos cuentas.
4. La ortografía sale en la portada de la U3 en un bloque titulado «Otras». Si prefieres otro título («Ortografía»), es un cambio de `portada.js`.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/opuestos/ y …/situaciones/ («Probar sin código»). `npm test`. La portada enseña la U3
desde el 16-11.
