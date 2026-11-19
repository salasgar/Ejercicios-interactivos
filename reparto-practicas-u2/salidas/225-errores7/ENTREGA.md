# Entrega de la tarea 225 · «Caza el error» (errores7)

Sesión `s-20261119T200941-230fa4ec`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`755644d`**
(`practicas/errores7/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos).
`npm test`: los 13 tests propios en verde; el único fallo del conjunto es ajeno (ver abajo).

## Qué hay

Práctica id 97, tres ejercicios en ES y EN; el 3 lleva «No lo sé»:

1. **¿Dónde está el error?** Cuenta resuelta en 3 líneas, una con error (un tercio de los ítems sin error). Se señala la línea.
2. **¿Qué error es?** El error verdadero más 3 distractores (1 de su clase y el resto de otras clases), barajados.
3. **Corrígelo.** Campo numérico con la unidad ya puesta; se escribe el resultado bueno.

Siete plantillas de error: razonar-sumando, porcentaje-entre-mil, porcentaje-entre-diez, dividir-entre-el-porcentaje, restar-el-porcentaje-como-número, descuento-por-precio-final, escala-sin-cambio-de-unidad. Ids de destreza provisionales (U7-1A-01, 2A-01, 3A-05, 3C-01, 4A-01, 5A-06).

## Cotas de realismo

Precios de 30 a 150 € (≠100) con artículos creíbles; p entre 2 y 80 %; cantidades múltiplos de 20 o de 100 para que todo salga exacto; escalas 1:10 000 a 1:200 000 con plano de 2 a 15 cm y real en km. Un test las comprueba con 1200 ítems por ejercicio e idioma.

## Lo provisional y lo no hecho

- **Acta, hojas y exámenes de la U7**: no existen el 19-11. `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero conectados (`esReservado`); los cotejará la 231.
- `disponible: true`: lo pone la 231.
- **Navegador**: no probada con clics ni a 375 px (sesión automática).
- PROPUESTAS sin hacer: inversa-como-directa, superficie-por-10, reparto-a-partes-iguales.
- **Fallo ajeno**: `tests/practicas-comun.test.js` («catálogo… 59 !== 61») rompe por cambios sin comitear de otra sesión (224, `catalogo.js`); no es de esta tarea.

## Probarlo en 1 minuto

`node --test tests/practicas-errores7.test.js tests/practicas-ayuda-errores7.test.js` o abrir `practicas/errores7/index.html`.
