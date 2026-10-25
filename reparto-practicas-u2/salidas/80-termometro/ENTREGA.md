# Entrega de la tarea 80 · «La recta y el termómetro» (termometro)

Sesión `s-20261024T235904-7d83dc11`. Commit del código: **c4474f3**. URL local: http://localhost:8080/practicas/termometro/ (código de prueba 60, `7NPD`, o «Probar sin código»). `disponible: false` hasta la tarea 93.

## Ficheros
`practicas/termometro/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza el css) y `tests/practicas-termometro.test.js` (15 tests, 3000 ítems por ejercicio).

## Ejercicios y destrezas
1. **Coloca el entero** (U3-1C-03): recta de −10 a 10 de 1 en 1, o de −20 a 20 **de 2 en 2** (41 marcas de 1 en 1 son poco tocables; decisión con lo que avisó la 79). Escritos: 0, extremos y múltiplos de 5 (o 10); el pedido nunca lleva número. Toca y «Comprobar». Errores: signo-cambiado, marca-vecina, otra-marca.
2. **¿Qué temperatura marca?** (U3-1C-04): termómetro con `campoEntero`; 2/3 de 1 en 1 (±10, ±15), 1/3 de 2 en 2 (±20) o de 5 en 5 (±30, ±40). Solo van escritos el 0 y los extremos. Errores: signo-cambiado, cuenta-marcas, lectura-incorrecta.
3. **Mayor o menor** (U3-1C-05): −10 a 10; 40 % dos negativos, 15 % con 0, 30 % positivo contra negativo de mayor valor absoluto. Tras fallar, recta con los dos puntos. Errores: compara-como-naturales, compara-valor-absoluto.
4. **Ordena** (U3-1C-06): 4-6 números entre −15 y 15, se tocan en orden, «Borrar» y «Comprobar». Errores: ordena-como-naturales, orden-al-reves, orden-incorrecto.
5. **¿Positivo, negativo o ninguno?** (U3-1C-02): 8 números (0 siempre, ≥2 de cada signo, ±1..20); en la mitad de los ítems 1-2 positivos van como `+5`. Se toca el número y su caja. Errores: cero-con-signo, mas-no-es-positivo, caja-equivocada.

## Cotas de realismo
Temperatura: ciudad −30..45 °C y pueblo de montaña −30..20 °C (el test las comprueba contra cada ítem). Sin otro contexto con unidades.

## Probado
Headless Chrome a 375 px (CDP, sin la extensión de Chrome, no conectada): cada ejercicio con un fallo, ES y EN, sin errores de consola. Un acierto por ejercicio no se probó a mano; lo cubren los tests de lógica.

## Propuestas
- `campoEntero` de la base va bien; ningún cambio en `_comun/`.
- La 93 debe citar los ejercicios con los nombres del catálogo: «Coloca el entero», «¿Qué temperatura marca?», «Mayor o menor», «Ordena», «¿Positivo, negativo o ninguno?».
