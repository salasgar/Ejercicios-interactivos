# Entrega de la tarea 126 · Multiplica y divide decimales (`multiplica-divide-decimales`, id 60)

Sesión `s-20261108T093918-bbe4ef97` (relevo de `s-20261106T155752-15b57d55`, que dejó `logica.js` sin comitear y sin test: se heredó, se corrigió y se probó), 2026-11-08. Commit del código: **ad08814**.

## Ficheros

`practicas/multiplica-divide-decimales/{index.html, practica.js, logica.js, textos.js, estilos.css}`, `tests/practicas-multiplica-divide-decimales.test.js` (13 tests, 3000 ítems por ejercicio con semillas fijas, comprobados con BigInt/fracciones aparte del generador), `practicas/_comun/catalogo.js` (id 60: `nEjercicios` 5 → 6) y `tests/practicas-comun.test.js` (6 ejercicios; U5 «29 en total»).

## Ejercicios

| Ej. | Nombre | Qué hace |
|---|---|---|
| 1 | Coloca la coma | producto de decimales (cuenta de cifras) y ·/: por 0,1; 0,01; 0,001; escribir o elegir |
| 2 | Divide hasta el final | decimal o natural entre un natural, cociente exacto (≤ 3 cifras) |
| 3 | Entre un decimal | divisor con coma; escribir o elegir la división equivalente |
| 4 | ¿Está bien hecha? | división con dos decimales y resto: ¿cuadra la prueba? Errores: resto sin deshacer, coma corrida, redondeado |
| 5 | Problemas | fruta al peso, gasolina (litros por importe, redondeo a la décima), gasolina de un viaje entre personas |
| 6 | Combinadas | 2-3 operaciones con decimales, con y sin paréntesis; distinto de izquierda a derecha |

## Cotas de realismo (las comprueba el test)

Fruta 0,80-6,00 €/kg y 0,5-5 kg; gasolina 1,20-2,00 €/L y 5-70 L; viaje 15-60 L entre 2 y 5 personas; el redondeo solo aparece si la división no es exacta.

## Casos excluidos

- **Hoja de la semana 2, en claro** (cálculos, ejemplos del recuadro y del inventario).
- **Examen de la semana 2, por huella FNV-1a**: 42 casos (productos 2C-02, divisiones 2C-04 y 2C-06, pruebas 2B-01, combinadas 2C-14 y 2C-15, precios por cantidad 2A-01) de `casos-examen-semana2.tsv`, ya metidos en `HUELLAS_EXAMEN`.
- **Examen final de la U5: no existe aún**: la 130 o quien lo haga coteja y rellena.

## Probado

Chrome headless dirigido por el protocolo de depuración, a 375 px, ES y EN, «Probar sin código»: los seis ejercicios, tres ítems cada uno con fallo; sin errores de JavaScript ni desplazamiento horizontal. Ver el ej. 4: dos botones «Está bien / Está mal». El acierto se probó con el ej. 1 (avanza solo).

## Propuestas (no decididas aquí)

1. Potencias y raíces decimales (reto 2C-13) como ítems: no incluidos.
2. Que el ej. 5 incluya cambios de unidad: no incluido.
