# Tarea 200 — «Coloca los paréntesis. Con enteros» (id 80, U3)

Sesión `s-20261115T000310-156b2801`. Código en el commit `df60e29` (origin/main).

## Qué hay
- `practicas/coloca-enteros/logica.js`: generadores de los 3 ejercicios sobre el motor común (199), con los casos del papel fuera.
- `papel.js` (nuevo): 248 cuentas de las hojas de la U3 en claro (`CASOS_HOJA`) y 850 huellas FNV-1a de exámenes semanales 3 y 4 y del final (`HUELLAS_EXAMEN`); ningún caso de examen en claro.
- `estilos.css`: a ≤ 400 px los huecos y la fuente se estrechan para que cuatro números con un negativo delante quepan en un renglón (medido a 375 px: 52 px de alto, con y sin paréntesis).
- Tests nuevos: `tests/practicas-coloca-enteros.test.js` (20) y `tests/practicas-ayuda-coloca-enteros.test.js` (5).

## Cotas
Todo valor, intermedio o final, entre −200 y 200.
- Ej. 1: a ∘ b ∘ c con + − ·; exactamente 2 resultados.
- Ej. 2: a ∘ b ∘ c², cubo en un 15 % (exponente fijado una vez fuera del reintento, si no el filtro lo dejaba en un 3 %); de 3 a 5 resultados; la mitad con una base negativa.
- Ej. 3: cuatro números con un «:» al menos; de 3 a 6 resultados y alguna agrupación que no se puede.

## Barrido (20 000 ítems por ejercicio)
- Ej. 1: 6 200 expresiones distintas, repetición máx. 0,055 %, siempre 2 resultados.
- Ej. 2: 1 880 distintas, máx. 0,170 %; resultados 3: 8 988, 4: 9 345, 5: 1 667; base negativa al agrupar 81,7 %; cubos 14,8 %.
- Ej. 3: 14 588 distintas, máx. 0,030 %; resultados 3: 15 309, 4: 4 691.
- Caídas en la reserva: 0 de 60 000.

## Navegador
Chrome headless por CDP, 375 y 1200 px, es y en, tres ejercicios: todos los chips se encienden con pistas, «Falta algún paréntesis» con un «(» abierto, borrar, «No lo sé» con todas las agrupaciones, «No se puede» con su motivo (es y en), consola limpia, sin desbordamiento horizontal.

## Para la coordinadora
- El 81,7 % de base negativa en el ej. 2 sale de pedir «alguna agrupación eleva un negativo» en la mitad de los ítems; el resto lo hace por azar.
- El ej. 3 solo da 3 o 4 resultados con estas cotas; no hay ítems con 5 o 6.
- La primera carga en frío tarda varios segundos.
