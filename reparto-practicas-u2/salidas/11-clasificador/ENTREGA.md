# Entrega — Tarea 11: ¿m.c.d. o m.c.m.? Clasificador de enunciados

Sesión: `s-20261007T203059-03e5af6d` · Commit: `47b0494`

## Ficheros entregados

- `practicas/clasificador/index.html`
- `practicas/clasificador/practica.js`
- `practicas/clasificador/logica.js`
- `practicas/clasificador/textos.js` (banco de 36 enunciados: 24 limpios + 12 con trampa)
- `practicas/clasificador/estilos.css`
- `tests/practicas-clasificador.test.js`

## Qué tiene

Tres ejercicios sobre el mismo banco de 36 enunciados:

1. **Limpios** (botones GCD azul / LCM naranja): 12 enunciados de m.c.d. (agrupar o
   cortar en partes iguales, lo más grande posible, sin que sobre nada) y 12 de m.c.m.
   (dos cosas que se repiten y acaban de coincidir: ¿cuándo volverán a coincidir?).
2. **Con trampa**: 6 enunciados de m.c.d. que preguntan por el MENOR número de piezas
   (la trampa: menos piezas = piezas más grandes = m.c.d.) y 6 de m.c.m. que piden
   repartir en grupos de tres tamaños distintos sin que sobre nada (la trampa:
   "repartir sin que sobre" suena a m.c.d., pero es un múltiplo común → m.c.m.).
3. **Justificar**: la clase ya está puesta; cuatro justificaciones (la razón correcta de
   la clase del ítem, la razón correcta de la clase contraria —incorrecta aquí—, y dos
   distractores al azar entre «dice "mayor"», «dice "menor"», «los datos son pequeños»,
   «hay dos datos»).

No se calcula ningún m.c.d. ni m.c.m.: solo se clasifica el enunciado (así lo pide la
ficha). El feedback de cada ítem usa los números concretos de ese enunciado.

Destrezas: U2-1A-01, U2-4A-01, U2-4B-01, U2-4B-02, U2-1A-04.

## Revisión a mano (regla de oro)

Impresas las 36 plantillas con cinco semillas distintas (180 enunciados en total) y
leídas una a una: ningún enunciado admite las dos clases. Se corrigieron tres erratas
encontradas en esta revisión antes de cerrar: «iguales iguales» duplicado en 5 de las 6
plantillas de la trampa A, un doble «y»/«and and» en la plantilla del rosal, y un
problema de género («una cable», y «pocas montones/ramos/lotes/cajones» en vez de
«pocos»).

## Cómo probarlo en 1 minuto

```
npm run servir
```

Abrir `http://localhost:8080/practicas/clasificador/` → «Probar sin código» → elegir
cualquiera de los tres ejercicios → responder un ítem (botones GCD/LCM o las cuatro
justificaciones) → se ve el feedback verde/rojo con la explicación.

Probado con Chrome vía `puppeteer-core` (instalado fuera del repositorio, en una carpeta
temporal, cortando las peticiones a `firestore.googleapis.com`): la página carga sin
errores de consola en 375 px y en 1024 px, sin desbordamiento horizontal, en español y en
inglés, con acierto y con fallo en los tres ejercicios.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-clasificador.test.js`: 42
pruebas en verde, 7 propias:

- el banco tiene 36 plantillas (24 limpias 12+12, 12 con trampa 6+6);
- cada plantilla da texto en los dos idiomas con sus números, sin «×», «HCF» ni
  «factor of»;
- en los ejercicios 1 y 2, las dos clases salen entre el 40 % y el 60 % en 3000 ítems
  (regla de oro: ninguna opción domina);
- el ítem de cada ejercicio referencia una plantilla real de su tipo con sus números;
- en el ejercicio 3, exactamente una de las cuatro opciones es la correcta (comprobado
  contra la regla independiente «va» si m.c.d., «contiene» si m.c.m.), sin repetidos,
  y las clases están equilibradas;
- los textos de justificación existen en los dos idiomas y no usan «factor».

`npm test` completo: 257 pruebas en verde (incluye las de otras sesiones en curso).

## Propuestas pendientes para la tarea 18

- Poner `disponible: true` para `clasificador` en `practicas/_comun/catalogo.js`.
- Ninguna propuesta de cambio del contrato de la base.
