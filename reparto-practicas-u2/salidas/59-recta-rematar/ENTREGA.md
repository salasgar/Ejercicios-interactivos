# Entrega · tarea 59 · Recta: rematar
Sesión s-20261017T153707-d47ce0fe · commits 2776026 (cambios heredados, revisados sin cambios) y 45eef3a (lo propio).
- `recuento(item, respuesta, idioma)` pasa a `practicas/recta/logica.js` (exportada); `explicar` lo antepone, en su línea, cuando el ítem de múltiplos/divisores falla. Sus textos salen de `textos.js` (`TX.recuento` borrado) y viven en logica.js como el resto de frases de `explicar`.
- `practica.js`: llama solo a `explicar`; «Comprobar» se oculta al responder; quitado el comentario PENDIENTE.
- `tests/practicas-comprobar.test.js`: `EXCEPCIONES` vacío. `tests/practicas-recta.test.js`: recuento en es/en, falla/acierta; los tests con `^` ajustados porque ahora el recuento va delante.
- Probar: `npm run servir` → http://localhost:8080/practicas/recta/ (código 60, `7NPD`). **No probada en navegador** ni a 375 px.
- `npm test`: 799 de 799.
