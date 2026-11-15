# Tarea 202 — «Coloca los paréntesis. Con decimales» (id 82, U5)

Sesión `s-20261115T000307-d5931620`. Código en el commit `0cf70ac`.

## Qué hay
- `practicas/coloca-decimales/logica.js`: generadores de los 3 ejercicios sobre el motor común (199). Dos «encuentra todos» (`objetivo: 5`, `penalizacion: 0`) y una diana.
- `textos.js`: introducciones y consejos (es/en); se quitó la nota de esqueleto.
- Tests nuevos: `tests/practicas-coloca-decimales.test.js` (10) y `tests/practicas-ayuda-coloca-decimales.test.js` (3).

## Cotas
Todo valor, intermedio o final: ≥ 0, ≤ 3 cifras decimales, divisiones exactas, ≤ 500. Divisores de la U5 (2, 4, 5, 8, 0,5, 0,25, 0,2) en TODAS las agrupaciones, no solo en la cuenta sin paréntesis (decisión mía; no causó caídas). Al menos un decimal por cuenta.
- Ej. 1: a ∘ b ∘ c con una operación de +/− y otra de ·/:; exactamente 2 resultados.
- Ej. 2: con exponente 2 o 3; 3 a 5 resultados. El cubo se pide a un número que lo permita.
- Ej. 3: diana, 4 números, ≥ 3 resultados; el objetivo nunca es el de sin paréntesis.

## Casos del papel excluidos
38 cuentas de las hojas (en claro, en `CASOS_HOJA`) y 184 huellas FNV-1a de exámenes semanales, modelos del final y cuestionarios (calculadas fuera del repo; ningún caso de examen en claro). Un test comprueba ítems, reservas y el ejemplo de la introducción.

## Barrido (20 000 ítems por ejercicio)
Caídas 0 en los tres. Máxima repetición 0,02 %. Distintos: 19 663 / 19 022 / 19 989. Resultados: ej. 2 con 3 (16 020), 4 (2 561), 5 (1 419). 0 valores fuera de cota.

## Navegador
Chrome headless por CDP, `?probar=1&ejercicio=k&idioma=es|en`, 375 y 1200 px: 12 páginas. Consola limpia en todas; «(» sin cerrar da su aviso; pistas hasta encender todos los chips y el resumen; diana sin paréntesis da su diagnóstico; «No lo sé» en las 12. A 375 px la expresión no se sale (324 px; 2-4 renglones). No probado con clic el ACIERTO de la diana (lo cubre el test de alcanzables).

## Para el coordinador
- Con estas cotas el `³` es raro de forma natural (~2-3 %); el generador lo fuerza a ~15 %.
- La diana a 375 px parte la cuenta tras «·» (igual que en 199).
