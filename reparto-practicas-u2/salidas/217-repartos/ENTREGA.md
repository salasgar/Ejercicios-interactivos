# Entrega de la tarea 217 · «Repartos proporcionales» (repartos)

Sesión `s-20261119T194012-e876f220`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`e15e28e`**
(`practicas/repartos/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2609/2609.

## Qué hay

Práctica id 89, `disponible: false` (la publica la 228), tres contextos (paga por horas, refresco con dos ingredientes, cromos por sobres),
razón a : b irreducible y a ≠ b entre dos dueños, siempre con la parte `u` elegida primero (T = u · (a + b), todo entero: céntimos, mL, cromos):

1. **Cuenta las partes**: dos campos (partes en total, lo que vale una). Errores: `partes-multiplicadas`, `contar-personas`, `partes-iguales`, `dividir-entre-un-termino`. «No lo sé».
2. **Reparte**: dos campos con el nombre de su dueño. Errores: `partes-iguales`, `intercambiadas`, `dividir-entre-cada-termino`, `quedarse-en-una-parte`; si no es ninguno, dice cuánto suman las partes escritas. «No lo sé».
3. **¿Está bien repartido?**: tres casillas (bien / no suman / suman pero no en la razón), un tercio de cada tipo; los malos salen de `dividir-entre-cada-termino`, `partes-multiplicadas`, `partes-iguales`, `intercambiadas`, `razonar-sumando`.
4. **Caza el error**: tres líneas con una mala (`partes-iguales` ≈ 40 %, `partes-multiplicadas`, `dividir-entre-un-termino`, `sumar-en-vez-de-multiplicar`).

Decisiones: la división se escribe «÷» y «:» queda solo para la razón (así ninguna línea mezcla las dos); cromos con 4-8 por sobre (dentro de la cota 2-12 de la ficha, más creíble); `razonar-sumando` no sale en el refresco.
Cuando dos errores dan el mismo número gana el primero de la lista de la ficha (p. ej. con 1 : 2, `a · b` = 2 = `contar-personas`).
Ids de destreza (PROPUESTA de la 211, sin F0): U7-2A-05, 2C-04, 2C-05.

## Tests (`tests/practicas-repartos.test.js` y `tests/practicas-ayuda-repartos.test.js`)

3000 ítems por ejercicio dentro de la cota de su contexto, T = u · (a + b) y razón por BigInt; cada error reconocido por valor y con unidad o sin ella;
ej. 3 con su tercio y cada tipo comprobado (suma, razón); ej. 4 con una sola línea mala; variedad ≤ 10 %; textos sin `×`, `%`, NaN ni undefined,
sin razón y división en el mismo párrafo, nombres inventados; explicaciones («No lo sé») con la solución, 1000 ítems por ejercicio e idioma.

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado la página con clics ni a 375 px (la sesión automática no puede abrir servidor ni Chrome). Lo mira la 228 al publicar.
- No había hoja ni examen del paquete 2 de la U7 ni acta de la 02 al escribirla: contextos y errores siguen la ficha; la 228 coteja casos.
