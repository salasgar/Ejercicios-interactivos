# Entrega de la tarea 218 · «Porcentaje, fracción y decimal» (tres-escrituras)

Sesión `s-20261119T194007-40bbd0c8`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`90814c4`**
(`practicas/tres-escrituras/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2609/2609.

## Qué hay

Práctica id 90, `disponible: false` (la publica la 229), cuatro ejercicios, en ES y EN:

1. **Los porcentajes fáciles.** 50, 25, 10, 20, 75 y 1 %: de porcentaje a fracción irreducible y de fracción a porcentaje, eligiendo entre cuatro
   (siempre de la misma escritura y de cuatro valores distintos; el pool se baraja antes de tomar tres). Sin «No lo sé».
2. **Escríbelo de otra forma.** 35 % → 0,35 | 7/20; 0,08 → 8 %; 3/5 → 60 %. Un tercio de los ítems con un porcentaje de una cifra. «No lo sé» (solo aquí).
   Acepta 0,350 / 35 % / 35% / 35 y rechaza con nombre: coma de más, unidades como décimas, ×10, decimal con %, cifras pegadas, etc.
   Una fracción que vale lo mismo pero no es irreducible (35/100) cuenta como fallo, con su mensaje.
3. **Une las tres.** Tres fracciones, cuatro decimales y cuatro porcentajes (sobra un señuelo de cada clase, de un error con nombre: coma de más, unidades como décimas
   o cifras pegadas). La mitad de los ítems lleva una pareja que se confunde (1/5 y 1/20, 1/4 y 1/25, 1/2 y 1/20, 1/10 y 1/100). Se toca el hueco y la ficha (o la ficha y se coloca sola).
4. **Ordena.** Cuatro números en escrituras mezcladas, cuatro valores distintos, al menos dos escrituras; en la mitad, una pareja con trampa (5 % y 0,5; 20 % y 0,02; 1/4 y 4 %).

Ids de destreza (tabla de la 211, F0 sin firmar): U7-3C-01, 3C-02 y 3C-14.

## Reglas de contenido cumplidas

Porcentajes enteros de 1 a 99 (nada por encima del 100 %, tampoco en los señuelos); denominadores que dividen a 100; ningún periódico; `·` y `:`, nunca `×`;
«75 %» con espacio duro en español y «75%» en inglés; coma en ES y punto en EN; nada del tanto por ciento **de** una cantidad (sesión 10).
Equivalentes (3/4, 0,75, 75 %) son siempre la respuesta, nunca un distractor: opciones y señuelos son valores distintos (lo comprueba el test por una segunda vía con BigInt).
Variedad: ninguna `clave` pasa del 10 % de su ejercicio (3000 ítems por ejercicio).

## Tests

`tests/practicas-tres-escrituras.test.js` (10 pruebas) y `tests/practicas-ayuda-tres-escrituras.test.js` (6): valores por dos vías, opciones distintas y de la misma escritura,
cada motivo de error, parejas confusas (>1/3) y trampas (≈ mitad), variedad, textos ES/EN y «%» bien escrito en cada idioma, y explicaciones («No lo sé») con la respuesta calculada con enteros propios.

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado la página con clics ni a 375 px (la sesión automática no puede abrir servidor ni Chrome). Lo mira la 229 al publicar; en especial la interfaz del ej. 3 (huecos y fichas) y la del ej. 4 (casillas).
- **Hoja, examen y acta**: el 19-11 no existían la hoja 3, el examen 3 ni `inventario-unidad7-revision.md`. No se ha podido excluir ningún caso de examen: la tarea 229 tiene que hacerlo
  con `claveDe` (3|p,p,p en el ej. 3; 4|orden|valores en el ej. 4; 1|sentido|p y 2|tipo|p), y el método (pasar a denominador 100) es PROPUESTA hasta que haya acta.
- Revisión de realismo y de la regla de oro hecha con una muestra a mano de 12 ítems en español e inglés y con los tests sobre 3000 por ejercicio.

## Propuestas

- Si en la 229 se ve el ej. 4 demasiado fácil con porcentajes enteros, subir una parte de los ítems a décimas (7,5 %); `pctE(m, k)` ya lo admite.
- `escrituraComoPorcentaje` solo vale con porcentajes enteros: si se añaden décimas hay que ampliarla.
