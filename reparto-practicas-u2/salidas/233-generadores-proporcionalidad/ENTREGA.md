# ENTREGA tarea 233 — generadores `proporcionalidad` y `porcentajes` al día con la U7

Sesión: s-20261125T182455-502ba2e3 (relevo de s-20261125T152515-2ccb90b0, que dejó el código sin comitear). Commit: `568fd85`.

## Ficheros
- `src/ejercicios/proporcionalidad.js`, `src/ejercicios/porcentajes.js` (reescritos con `SUBTIPOS` e `items`; dinero en céntimos enteros; pool de errores barajado)
- `src/ejercicios/contextos_proporcionalidad.js` (nuevo: banco de contextos con su cota)
- `tests/proporcionalidad-items.test.js` (nuevo: 23 tests, 3000 ítems por subtipo)

## Subtipos e ids de la U7
| Generador | Subtipo | Ids |
|---|---|---|
| proporcionalidad | directa_unidad | U7-1A-02, U7-1C-10 |
| | directa_receta | U7-1A-01 |
| | inversa | U7-2A-01 |
| | escala_a_real / escala_a_plano | U7-4A-01 / U7-4A-02 |
| | reparto_razon / reparto_aportaciones | U7-2C-04 / U7-2A-05 |
| porcentajes | porcentaje_facil | U7-3C-02, U7-3C-04 |
| | grupo_parte / grupo_resto | U7-3A-01 (+3C-04 la parte) |
| | grupo_total / grupo_cual | U7-3A-02, 3C-07 / U7-3A-04, 3C-06 |
| | descuento / subida | U7-3A-05 |
| | iva / precio_original | U7-3C-11 / U7-3A-06 |
| | interes_simple / interes_compuesto | U7-5A-08 / U7-5A-09 |

## Contextos con cota
Compra al peso (0,80-9 €/kg (según producto)), recetas, obreros/pintores/grifos/voluntarios (2-12), escalas de mapa y plano, repartos de 2-4 personas, grupos (instituto, fábrica, pueblo, club), rebajas, subidas (1-20 %), IVA (4, 10, 21 %) e interés (1-5 %). Cotas exactas en `contextos_proporcionalidad.js`; el test comprueba que todos los datos y resultados caen dentro.

## Fuera, por el acta de la U7
Interés simple de varios años y aumentos/descuentos sucesivos (salen de los generadores).

## Cómo probarlo
`node --test tests/proporcionalidad-items.test.js` (23/23) y `npm test` (2830/2830). Sin prueba en navegador (la sesión no es atendida; la app principal no cambia de interfaz).

## Propuestas
- El término que falta en una proporción (`3/4 = x/20`) no se ha hecho subtipo: propuesta para una tarea futura si Juan Luis lo quiere.
- Las filas de `README.md` de estos dos generadores no se han tocado (prohibido en la ficha): revisar su texto sobre interés compuesto y encadenados.
