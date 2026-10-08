# Entrega tarea 32 · Caza el error (unidad 1)

Sesión s-20261007T214541-bbfb1e44 · commit de3094f

Ficheros: practicas/errores1/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-errores1.test.js.
URL local: `npm run servir` → http://localhost:8080/practicas/errores1/ (`?idioma=es|en`).

Ejercicios: 1. ¿Hay un error? (50 %/50 %) · 2. Señala el paso (línea tocable) · 3. Nombra el error (4 nombres; los 3 falsos nunca excluidos ni confundibles).

Banco: 33 plantillas (21 con error, 12 sin error), 11 nombres en NOMBRES (los de la ficha). Errores en la línea 1 (13 plantillas) o en la 2 (8), para que ninguna posición pase del 70 % en el ejercicio 2.
Con error: suma antes que el producto (×3), resta antes del paréntesis, resta de derecha a izquierda (4 números), potencia como producto (×3), exponente en la suma, exponente al producto entero, raíz como la mitad, resto mayor que el divisor (×2), saltarse un resultado intermedio (×4), redondeo por defecto (×2), olvidar el paréntesis al traducir (×2).
Sin error: paréntesis redundante, 7 + (3·2) junto a 7 + 3·2, dos productos independientes en un paso, dos potencias independientes, brackets/parentheses, times/multiplied by, potencias bien hechas (×2), resta de izquierda a derecha, raíz, resto, redondeo, traducción con paréntesis.
Destrezas: 4A-10 a 4A-13, 4B-16, 2C-03, 2C-05, 3C-11, 3C-01, 1A-12, 1A-05, 1A-03, 1A-04, 3A-06, 4C-22 (las de la ficha; no he podido leer el inventario de la U1 para casar cada una plantilla a plantilla).

Pruebas en 1 minuto: `node --test tests/practicas-errores1.test.js` (19 tests). Un evaluador de expresiones propio (árbol con precedencia) comprueba cada línea de cada desarrollo: un paso es válido solo si resuelve operaciones cuyos operandos ya son números (independientes en un paso: bien; dependientes: «saltoPaso»). En los sin error, cada línea vale lo mismo que la anterior; en los con error, la única línea falsa es la declarada.

Revisión a mano (regla de oro) hecha sobre la salida de las 33 plantillas: se corrigió «1 cajas» (q ≥ 3). Pares confundibles en CONFUNDIBLES (sumaAntes/saltoPaso, sumaAntes/olvidaParentesis, restaAntes/olvidaParentesis, restaAntes/restaDerIzq, expSuma/expProducto, potencia/expProducto) más `excluidos` por plantilla.
Navegador (Chrome, EN): menú y ejercicio 1 probados, fallo con feedback y penalización +2; sin errores de consola. No probados: 375 px, ejercicios 2 y 3 en pantalla (la conexión del navegador se cayó); su código es el de la tarea 14.

Propuestas:
- Catálogo: poner disponible: true para errores1 (tarea 18).
- Decisión de Juan Luis: «saltarse un resultado intermedio» marca como error combinar operaciones dependientes en un paso (p. ej. 50 − 3·4 + 4 = 38 + 4); si prefiere tolerarlo en algún nivel, basta quitar esas 4 plantillas.
