# Entrega de la tarea 226 · «Léelo en inglés» (leelo7)

Sesión `s-20261119T194934-df0865c7`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`e191919`**
(`practicas/leelo7/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2647/2647.

## Qué hay

Práctica id 98, `disponible: false` (la publica la 227), cuatro ejercicios, en ES y EN:

1. **Palabra**: término de la unidad en inglés ↔ castellano (22 términos; 4 opciones de familias distintas, con el contrario siempre presente si ya se ha dado).
2. **Léelo**: razón (a/b y a : b), porcentaje y escala, de la cifra a la lectura en inglés y al revés; las falsas son errores con nombre (cero de más, cifras cambiadas, teen/ty, razón al revés, coma de más…).
3. **Consigna**: 22 consignas de ejercicio entendidas en inglés, una por familia, sin que una opción contenga a otra.
4. **Completa**: 19 frases con un hueco (a/an, per cent, unit rate, scale…).

Con «No lo sé» en los cuatro (`explicacion` en `textos.js`) y variedad ≤ 10 % por clave en 3000 ítems.

## Filtro por fechas (PROPUESTA de la montadora, sin acta)

`PAQUETES_DESDE = {1: 2027-03-01, 2: 2027-03-08, 3: 2027-03-15, 4: 2027-04-12, 5: 2027-04-19}`; la parte de abril del paquete 3 (descuento, aumento, disminución, precio de venta, IVA) desde 2027-04-05.
Paquetes 1-2: nada de %, per cent, discount, VAT ni escalas; paquete 3: sin escalas. El paquete 1 está siempre disponible (también antes del 1-3).
Se cambia en una sola constante de `logica.js`.

## Lo provisional y lo no hecho

- **Acta**: la carpeta de la U7 no tiene acta, hojas ni exámenes el 19-11. No se ha excluido ningún caso: `HUELLAS_EXAMEN` y `RESERVADOS_HOJA` existen vacíos y todos los generadores con números los consultan (test); la 227 los rellena con `claveCaso`.
- **Paquete 5** (speed, exchange rate, best buy…): fuera del vocabulario hasta que haya acta. PROPUESTA: añadirlo entonces con `paquete: 5`.
- Ids de destreza de la propuesta (U7-1B-01, 1B-02, 2B-01, 3B-01, 3B-02, 4B-01, 4B-02, 5B-01): provisionales.
- **Navegador**: no probada con clics ni a 375 px (la sesión automática no puede abrir Chrome). La mira la 227; en especial la altura de las razones con raya y la consigna más larga en un botón.
- Revisión de realismo y de la regla de oro: tests sobre 3000 ítems por ejercicio y fecha, con un lector de inglés escrito aparte que confirma cada opción de «Léelo» por valor.

## Tests

`tests/practicas-leelo7.test.js` (33 pruebas) y `tests/practicas-ayuda-leelo7.test.js` (5).
