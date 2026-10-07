# Entrega de la tarea 06 · Árbol de factores libre

Sesión: s-20261007T212058-817d27db · Commit del código: 5ad984c

## Ficheros entregados
- `practicas/arbol/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
- `tests/practicas-arbol.test.js` (10 tests)

## Qué tiene
URL local: `npm run servir` y http://localhost:8080/practicas/arbol/ (publicada: `…/practicas/arbol/`).

1. **Construye el árbol** (U2-2C-08, U2-2C-13, U2-2C-11, U2-2B-02). De cada número de las
   puntas el alumno dice «Sí, es primo» (se rodea) o «No, se puede partir» (y elige él el
   producto entre todas las parejas de divisores propias). Decir primo a un compuesto, o
   querer partir un primo, se corrige en el acto con sus números («121 no es primo:
   121 = 11 · 11») y cuenta como fallo del ítem, pero el árbol se termina. 6 aciertos, +1 por
   fallo, tope 12 (un árbol son entre 8 y 16 pulsaciones).
2. **¿Está terminada?** (U2-2C-09). Igualdad siempre verdadera; «Sí, terminada» / «No», y si
   dice No tiene que tocar el factor compuesto. 40 % con un compuesto disfrazado (49, 91, 121,
   143, 169, 187, 209, 221), 15 % a medias evidentes (24 = 2 · 4 · 3), 15 % terminadas con un
   primo grande (7 · 67), 30 % terminadas normales. 10 aciertos, +2.
3. **Completa el árbol** (U2-2C-08, U2-2C-13). Dos o tres huecos y un banco con los que faltan
   más dos que no encajan; se arrastra o se toca (ficha → hueco resaltado). Se corrige por el
   producto de cada rama; tras el acierto, en la mitad de los ítems, otro árbol del mismo
   número. 10 aciertos, +2.

## Cómo probarlo en un minuto
Entrar con «Probar sin código». Ejercicio 1: decir «Sí, es primo» al primer número (error en el
acto), partirlo y terminar. Ejercicio 2: decir «No» y tocar un factor. Ejercicio 3: arrastrar
una ficha a un hueco, tocar otra, «Comprobar».

## Comprobado
`node --test tests/practicas-comun.test.js tests/practicas-arbol.test.js`: 49 de 49. En Chrome
sin ventana, a 375 y 1024 px, en español, en inglés y en modo alterno (con la caja de
traducción): 360 construido entero por el camino más ancho y por el más hondo sin que ningún
nodo se salga ni haya desplazamiento horizontal; 242 fallando en todo; ejercicio 2 por sus
cuatro caminos; ejercicio 3 tocando, arrastrando con el ratón y fallando. Sin escrituras en
Firestore (modo sin código).
