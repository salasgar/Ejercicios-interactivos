# ENTREGA · Tarea 136 · Ortografía: las letras (`ortografia-letras`, id 65)

Sesión `s-20261105T234336-4fc4e6d3` (Sonnet 5.5). Commit del código: **`df71445`** (4 ficheros).

## Ficheros
`practicas/ortografia-letras/{logica,textos,practica}.js` (sustituyen el esqueleto) y `tests/practicas-ortografia-letras.test.js` (26 tests).
`disponible: false` sigue como estaba: lo pone la 140.

## Ejercicios (ítems por nivel 1 / 2 / 3)
1. **hay, ahí, ay; a ver, haber**: 18 / 20 / 25. N1 hay/ahí/ay (6 frases cada una); N2 a ver/haber (10 + 10); N3 a/ha, e/he, echo/hecho (frases nuevas, ninguna de `ortografia`) y habría/abría.
2. **b o v**: 25 / 46 / 30. N1 -aba, bu-, mb, bl/br, nv, presente de ir y ver, llave/llevar; N2 adjetivos en -ava…-ivo, -bir, -bilidad, iba, tuve/estuve/anduve, vice-, adv-, ev-, bien-, bi-, sub-, -buir; N3 excepciones (árabe, sílaba, hervir, servir, vivir, movilidad, civilidad, obvio) y 11 pares en frase (tubo/tuvo … botar/votar), con las dos lecturas.
3. **g o j y la diéresis**: 20 / 37 / 35. N1 -aje, ej-, -jero, -gen, gue/gui, geo-; N2 -ger/-gir, -gia/-gio/-gión, -logía, -gésimo, -geno, pretéritos con j, -jear, -jar; N3 gü/gu (8 + 8), excepciones (tejer, crujir, ligero, ingeniero) y palabras «de memoria» con j y con g.
4. **Otras letras**: 43 / 23 / 38. N1 ll/y, m/n, r/rr (con los pares perro/pero y carro/caro en frase); N2 c/z/qu (tres botones) y plurales en -ces; N3 -d/-z final (con el plural como truco), cc/c (con la familia con «ct»), x/s.

Cada ítem de 2-4 lleva su REGLA (tabla `REGLAS`), y el test comprueba que la palabra cumple el patrón o es una excepción declarada. Equilibrio por nivel: ningún botón pasa del 60 % (el máximo es 53 %).

## Regla de oro
Si la letra mala da una palabra que existe, el ítem va en frase y las dos palabras están en `EXISTEN` con su significado (el test lo exige). Verificadas a mano todas las formas malas (no existen). Descartados: cinco/zinco, «cena» (quena), «queso» (ceso), «quitar» (citar), «quien» (cien), «barrio» (bario), «pollo» (poyo), «grave» (grabe), «boy», «viage», casa/caza y demás de la lista negra.

## Decisiones
- El hueco de «ay» nunca empieza frase (saldría en minúscula donde va mayúscula): «soltó un ¡_! enorme».
- «Madrid» e «Israel» son topónimos; ningún nombre de persona.
- Nota de proceso: una tanda de correcciones a `logica.js` se hizo con un script de Python y no con Edit (el fichero era solo de esta tarea, así que no hubo contienda).

## Cómo probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/ortografia-letras/?nivel=3 → «Probar sin código». Probado con clics en los 4 ejercicios (niveles 1 y 3, acertando y fallando), sin errores en consola. **No verificado a 375 px**: el redimensionado de la ventana no tuvo efecto; el diseño es el mismo de las piezas comunes (columna única). El nivel 2 se probó por tests, no con clics.
