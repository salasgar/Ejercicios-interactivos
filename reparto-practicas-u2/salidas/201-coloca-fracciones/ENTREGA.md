# Tarea 201 — «Coloca los paréntesis. Con fracciones» (`coloca-fracciones`, U4)

Commit `5998650` (sesión s-20261115T074415-6799eafd).

## Qué hay
- `practicas/coloca-fracciones/{logica,papel,textos}.js` sobre el motor común (`aritmeticaFracciones({topeNum: 60, topeDen: 36})`). Tres ejercicios: 1 y 2 «encuentra todos», 3 diana.
- `papel.js`: 27 claves de hoja en claro y 699 huellas FNV-1a de examen (ningún caso de examen en claro). `esCasoDelPapel` también compara con el filtro de `combinadas-fracciones` (cualquier orden de sumandos y factores; uso de solo lectura).
- Tests: `tests/practicas-coloca-fracciones.test.js` (9) y `tests/practicas-ayuda-coloca-fracciones.test.js` (3).

## Cotas
- Operandos: fracciones irreducibles (den. 2-6, a veces 8, 10, 12) y naturales 2-5 (ej. 1 ≤ 1 natural; ej. 2 y 3 ≤ 2); al menos dos fracciones; solo el primero negativo (~30 %).
- Ej. 1: tres operandos con + − ·, un · al menos; exactamente 2 resultados. Ej. 2: cuatro con + − · :, un «:» al menos; 3 a 5 resultados. Ej. 3: diana, ≥ 3 resultados, objetivo distinto del de sin paréntesis.
- Todo valor, intermedio o final: irreducible, den. ≤ 36, |num.| ≤ 60; ninguna agrupación imposible. Equivalentes = un mismo chip.

## Barrido (20 000 ítems por ejercicio)
Limpio: ningún caso del papel, sin repetir el anterior, caídas en la reserva < 1 %.

## Navegador
**No se probó con clics** (sesión automática sin navegador). Queda para la 204: 375 y 1200 px es/en, cuatro fracciones con ocho huecos en un renglón a 375 px (si no caben, solo `coloca-fracciones/estilos.css`), pista, borrar, paréntesis sin cerrar, diana acierto y fallo, «No lo sé» en cada ejercicio.

## Nota de proceso
`papel.js` se generó con un script de node desde el shell, no con Write (archivo nuevo propio, sin contienda). Script y extracción fuera del repo.

## Tests
`npm test` 2405/2405.
