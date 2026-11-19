# Entrega de la tarea 220 · «¿Qué porcentaje? ¿De cuánto?» (que-porcentaje)

Sesión `s-20261119T195948-6ddfa7ff`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`4fce2a4`**
(`practicas/que-porcentaje/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2673/2673.

## Qué hay

Práctica id 92, `disponible: false` (la publica la 229), cuatro ejercicios en ES y EN, con «No lo sé» en 1, 2 y 4:

1. **¿Qué porcentaje es?** «¿Qué porcentaje es 12 de 80?»: parte entre total y el decimal a porcentaje. El campo lleva el `%` ya puesto; vale «15» y «15 %». (U7-3A-02, 3A-04)
2. **¿De cuánto?** «El 20 % de una cantidad es 30»: el total. La explicación toma el camino corto (100 : p veces, o el 1 % si p no divide a 100), siempre con enteros. (U7-3A-07)
3. **¿Cuál de los tres?** Problema con contexto sin calcular: piden la parte, el porcentaje o el total (tres preguntas equilibradas ±5 %). Sin «No lo sé» (no hay cuenta). (U7-3C-06)
4. **Problemas** con contexto (clase, encuesta, club, tiros, test, ahorros): porcentaje (½), total (⅓) o parte (⅙), con su unidad. (U7-3C-06, 3C-07)

Los tres primeros aciertos de 1 y 2 usan porcentajes y totales fáciles. Errores con nombre (decimal sin pasar, dividir al revés, la parte como porcentaje, restar, multiplicar o sumar el porcentaje, dividir sin el cien, dividir entre el porcentaje, dar el resto…), explicados con los números del ítem. Ids de destreza provisionales (F0 sin firmar).

## Cotas de realismo

Todo exacto: p entero 1-99, parte natural y menor que el total, `parte·100 = p·total` (BigInt en el test); total de 10 a 500 en 1 y 2. En los contextos (3 y 4), p entre 5 y 90 %, personas, tiros y preguntas enteros, dinero a céntimos y dentro de `dentroDeCota`; ningún contexto de precio. Sin descuento, rebaja, aumento ni IVA.

## Lo provisional y lo no hecho

- **Acta**: la carpeta de la U7 no tiene acta, hojas ni exámenes el 19-11; no se ha excluido ningún caso.
- **Navegador**: no probada con clics ni a 375 px (sesión automática). La mira la 229.
- PROPUESTA: «hallar el total desde el porcentaje complementario» son dos pasos y no se incluye.

## Probarlo en 1 minuto

`npm test` (14 pruebas propias) o abrir `practicas/que-porcentaje/index.html` y tocar «No lo sé» en cada ejercicio.
