# Reservas del paquete 1 contra la semana 2 (tarea 228; s-20261126T215433-a6fda056)

El examen 2 de la U7 lleva cuatro preguntas de repaso del paquete 1 (acta, «Qué evalúa cada examen»: el término que falta y un problema de
directa, más el precio por unidad y las horas y minutos), y la hoja 2 tres problemas de directa (ej. 7 a, 8 a y 8 c). Barrido de 20 000 ítems
por ejercicio sobre una copia de HEAD 54747b6, con las reservas de a304d9d, a3e6277 y 4e99a28 ya puestas (/tmp/pu2-228-a6fd/reservas.mjs):

| Práctica | Hoja 2 | Examen 2 |
|---|---|---|
| `razones` ej. 4 | 0 | 32 ítems (los cuatro casos de U7-1C-04) |
| `regla-de-tres` ej. 1 | 0 | 67 ítems (U7-1C-10: «¿cuánto cuesta 1?» con los mismos dos datos) |
| `regla-de-tres` ej. 2, 3 y 4 | 55, 14 y 22 ítems (un caso) | 0 |
| `tabla-proporcional` ej. 1 y 2 | 22 y 130 ítems (un caso) | 0 |
| `tabla-proporcional` ej. 3 | 13 ítems (dos casos) | 365 ítems (U7-1C-10: una columna con el mismo dato y el mismo precio por unidad) |

Las huellas se calculan con la `huellasDe` que ya tiene cada práctica (probado: son las que salen en el barrido), salvo dos añadidos:

- **`regla-de-tres`, ej. 1**: además de la terna «a ⟶ b; c ⟶ ?», la de «a ⟶ b; 1 ⟶ ?» (`huellaCaso('directa', [a, b, 1])`, tal como se
  escribe y en la unidad base, como las otras dos): es la pregunta del precio por unidad.
- **`tabla-proporcional`**: las huellas de **una sola columna** del examen (`huellaCaso('tabla-directa', [k, x])`, el precio por unidad con
  el mismo dato) van en el mismo `HUELLAS_RESERVADAS`, como ya van las de la hoja 1 (el aceite, el aparcamiento y las patatas). Así quitan
  también un 6 % de los ítems del ej. 1 (1225 de 20 000, tablas de números con esa columna), sin tocar la variedad (máximo 0,06 %); si se
  prefiere no perderlos, un segundo conjunto que solo mire `generarConstante`.

## `razones` (ej. 4): examen 2, solo huellas
'18gi1cp', '19mumif', '40nk0w', '1dbrlwm', 'q2dgpv', '45en41', 'a836ux', '5lhot5'

## `regla-de-tres`
Hoja 2 (en claro):
- ej. 7 a) 12 caballos, 36,00 € al día → 15 → 18uhyb7
- ej. 8 a) 3 kg, 4,80 € → 7 kg → mxlyyx
- ej. 8 c) 4 personas, 2 huevos → 10 → 1lrf0l6

Examen 2, solo huellas (los cuatro ejercicios): '55de24', '11gnldz', '1ta45az', '6kox7b', '1jzatvw', '730mzi'

Examen 2, solo huellas, «a ⟶ b; 1 ⟶ ?» (ej. 1): '1tk9794', '1frg6kr', '87ylu3', '1m5jzl2'

## `tabla-proporcional`
Hoja 2 (en claro; dos columnas):
- ej. 7 a) 12 caballos, 36,00 € al día → 15 → 9sh9fc
- ej. 8 a) 3 kg, 4,80 € → 7 kg → 6ev2c6
- ej. 8 c) 4 personas, 2 huevos → 10 → q5op8l

Examen 2, solo huellas, dos columnas (los tres ejercicios): 'mtr036', 'pkhdnq', '78qvoz', '2hwwcc', 'bppisu', '21sl89'

Examen 2, solo huellas, una columna: '12jtyyf', 'xo55lw', '1w4qy6u', '1bumml2'
