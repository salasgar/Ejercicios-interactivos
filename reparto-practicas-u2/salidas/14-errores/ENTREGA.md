# Entrega tarea 14 · Caza el error

Sesión s-20261007T212631-9f1904c0 · commit f682746

Ficheros: practicas/errores/{index.html,practica.js,logica.js,textos.js,estilos.css}, tests/practicas-errores.test.js.
URL local: `npm run servir` → http://localhost:8080/practicas/errores/ (`?idioma=es|en`).

Ejercicios (destrezas U2-4C-01, U2-4C-02, U2-4C-03 y repaso de las que aparecen):
1. ¿Hay un error? (Está bien / Hay un error, 50 %/50 %).
2. Señala el paso (solo con error; cada línea es un botón).
3. Nombra el error (4 nombres de NOMBRES; los 3 falsos nunca son excluidos ni confundibles con el bueno).

Banco: 29 plantillas (14 con error, 15 sin error) y 12 nombres de error; cada nombre es el error de al menos una plantilla.
Las 14 con error cubren: cruzado, mcm con primos comunes, potencia como producto, última cifra del 3, 3 con 9, sin terminar, múltiplo/divisor (×2), m.c.d. 0, olvida el 1 / el propio número (×2), minutos de cien en cien, impar primo, m.c.d. como nº de trozos.
Los «no errores» de U2-4C-02: orden de factores, dos árboles, factor/divisor, GCD/HCF, lowest/least, divisible por/entre, 11 y 13.

Pruebas en 1 minuto: `node --test tests/practicas-errores.test.js` (15 tests; cada línea de cada plantilla se verifica por fuerza bruta con definiciones propias: con error, la única línea falsa es la declarada; sin error, todas válidas).

Revisión a mano (regla de oro): para cada plantilla con error solo un nombre la describe; los pares que podrían confundirse (cruzado/mcmComunes, cruzado/trozos, mcdCero/olvida1, potencia/sinTerminar, tres9/ultimaCifra3) están en CONFUNDIBLES y no salen como distractores uno del otro. Las plantillas sin error se han comprobado a mano.
Navegador: probados ejercicio 1 y 3 (es/en), acertando y fallando; la ventana del navegador no bajó de 784 px, así que los 375 px no se pudieron verificar (diseño con flex y overflow-wrap).

Propuestas:
- Catálogo: poner disponible: true para errores (tarea 18).
- NO hay plantilla «divisible between» (ficha, «Trampas»): generar(rng, sesion) no sabe el idioma del ítem (la base lo sortea después y deja ver el otro idioma al responder), así que en español sería «divisible entre», correcto. Propuesta de contrato: pasar el idioma a generar o un campo opcional soloEn en el ítem.
- La ficha pide «6 es factor de 24» como no-error, en tensión con la regla «divisor, no factor»: se hizo como pide la ficha (plantilla b-factor-divisor), por si Juan Luis prefiere quitarla.
Commit: aa28e29 (reabiertas del 9-10): fuera b-factor-divisor; m.c.m. distinto de cero; sin «Está bien» repetido.
