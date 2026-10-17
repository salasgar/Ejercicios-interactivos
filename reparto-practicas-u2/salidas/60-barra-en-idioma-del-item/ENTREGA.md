# Entrega de la tarea 60 · barra del ejercicio y pie en el idioma del ítem

Commit: d620c04 · sesión s-20261017T154923-47e3fe45

Ficheros: practicas/_comun/base.js (idiomaBarra, cabeceraEjercicio, pintarContador, textoSalir con idioma), practicas/_comun/estilos.css (pie en inglés con html:lang(en)), tests/practicas-barra-idioma.test.js (nuevo, 5 pruebas).

Cómo verlo en 1 minuto: npm run servir, http://localhost:8080/practicas/semaforo/?codigo=7NPD (código de prueba 60), sin ?idioma=. En un ítem en inglés: «← Exercises», «Exercise 1 · …», «n/10 points», pie «All rights reserved»; en el siguiente en español, todo en español. Con «See in English» en un ítem en español la barra sigue en español. Desde semana.html?t=1, el botón de salir dice «← Weekly task» en un ítem en inglés. Recarga forzada tras publicar (GitHub Pages cachea los módulos).

NO probado en navegador (solo tests: 803 en verde). La introducción (sin ítem) y la pantalla de fin siguen en el idioma de la interfaz, como pide la ficha. Ninguna otra cadena de la pantalla del ítem estaba en el idioma de la interfaz (siguiente, error_item y el feedback ya usaban el del ítem).
