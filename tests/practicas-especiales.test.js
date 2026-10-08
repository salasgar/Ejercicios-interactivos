// Potencias especiales, verdadero o falso (practicas/especiales/):
// generadores y comprobaciones por fuerza bruta, con definiciones
// independientes de las de logica.js (nunca se declara a mano si una
// plantilla es verdadera o falsa).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarVF, generarFalsa, evaluar, IDS_VERDADERAS, IDS_FALSAS } from '../practicas/especiales/logica.js';

const N = 3000;

// --- Definición independiente de cada plantilla, por fuerza bruta --------------

function potencia(base, exp) {
  let r = 1;
  for (let i = 0; i < exp; i++) r *= base;
  return r;
}

function ladosBrutos(id, { a, n }) {
  switch (id) {
    case 1: return [potencia(a, 0), 1];
    case 2: return [potencia(a, 0), 0];
    case 3: return [potencia(a, 0), a];
    case 4: return [potencia(0, n), 0];
    case 5: return [potencia(1, n), 1];
    case 6: return [potencia(1, n), n];
    case 7: return [potencia(a, 1), a];
    case 8: return [potencia(a, 1), 1];
    case 9: return [potencia(10, n), Number(`1${'0'.repeat(n)}`)];
    case 10: return [potencia(10, n), 10 * n];
    case 11: return [potencia(a, n), a * n];
    case 12: return [potencia(a, 3), potencia(a + 1, 2)];
    case 13: return [potencia(2, 4), potencia(4, 2)];
    case 14: return [potencia(a, n), potencia(a, n)]; // la propia definición
    default: throw new Error(`id desconocido: ${id}`);
  }
}

test('IDS_VERDADERAS e IDS_FALSAS: siete y siete, sin solapar, catorce en total', () => {
  assert.equal(IDS_VERDADERAS.length, 7);
  assert.equal(IDS_FALSAS.length, 7);
  assert.equal(new Set([...IDS_VERDADERAS, ...IDS_FALSAS]).size, 14);
});

test('ejercicio 1: la verdad de cada ítem coincide con la fuerza bruta, nunca aparece 0^0', () => {
  const rng = crearRng(1001);
  let verdaderos = 0;
  const vecesPorId = {};
  for (let i = 0; i < N; i++) {
    const item = generarVF(rng);
    vecesPorId[item.id] = (vecesPorId[item.id] || 0) + 1;
    const [l1, l2] = ladosBrutos(item.id, item.vars);
    assert.equal(item.verdad, l1 === l2, `id ${item.id}, vars ${JSON.stringify(item.vars)}`);
    if (item.verdad) verdaderos++;
    // 0^0 nunca aparece: solo la plantilla 4 usa base 0, y ahí el exponente es n >= 1.
    if (item.id === 4) assert.ok(item.vars.n >= 1);
    if ([1, 2, 3].includes(item.id)) assert.ok(item.vars.a >= 2, 'la base de a^0 nunca es 0');
  }
  assert.ok(verdaderos > N * 0.4 && verdaderos < N * 0.6, `${verdaderos} verdaderos de ${N} (se espera 40-60 %)`);
  // La plantilla 13 (2^4 = 4^2) pesa poco: no debe salir más de un 5 %.
  assert.ok((vecesPorId[13] || 0) < N * 0.05, `id 13 salió ${vecesPorId[13] || 0} veces de ${N}`);
  // Aparecen las catorce plantillas (con N=3000 ninguna debería faltar).
  assert.equal(Object.keys(vecesPorId).length, 14);
});

test('ejercicio 1: las plantillas pensadas como falsas no se vuelven verdaderas por casualidad', () => {
  const rng = crearRng(2002);
  for (let i = 0; i < N; i++) {
    const item = generarVF(rng);
    if (IDS_FALSAS.includes(item.id)) assert.equal(item.verdad, false, `id ${item.id} debería ser siempre falsa`);
    if (IDS_VERDADERAS.includes(item.id)) assert.equal(item.verdad, true, `id ${item.id} debería ser siempre verdadera`);
  }
});

test('ejercicio 2: de las cuatro, exactamente una es falsa, y es la de la solución', () => {
  const rng = crearRng(3003);
  for (let i = 0; i < N; i++) {
    const item = generarFalsa(rng);
    assert.equal(item.items.length, 4);
    const ids = item.items.map(it => it.id);
    assert.equal(new Set(ids).size, 4, 'las cuatro plantillas son distintas');
    const falsas = item.items.filter(it => !it.verdad);
    assert.equal(falsas.length, 1, 'exactamente una es falsa');
    assert.equal(item.items[item.solucion].verdad, false);
    item.items.forEach((it, i) => {
      const [l1, l2] = ladosBrutos(it.id, it.vars);
      assert.equal(it.verdad, l1 === l2);
      assert.equal(it.verdad, i !== item.solucion);
    });
  }
});

test('ejercicio 2: la posición de la falsa varía (no gana quien pulsa siempre lo mismo)', () => {
  const rng = crearRng(4004);
  const cuenta = [0, 0, 0, 0];
  for (let i = 0; i < N; i++) cuenta[generarFalsa(rng).solucion]++;
  for (const c of cuenta) assert.ok(c < N * 0.7, `una posición salió ${c} de ${N}`);
});

test('evaluar: coincide con la fuerza bruta para las catorce plantillas y varios valores', () => {
  for (let id = 1; id <= 14; id++) {
    for (const a of [2, 3, 5, 9, 20]) {
      for (const n of [1, 2, 3, 6]) {
        const { lado1, lado2, verdad } = evaluar(id, { a, n });
        const [l1, l2] = ladosBrutos(id, { a, n });
        assert.equal(lado1, l1);
        assert.equal(lado2, l2);
        assert.equal(verdad, l1 === l2);
      }
    }
  }
});

// ─── Reabierta de la tarea 31 ───────────────────────────────────────────────────

test('ejercicio 2: nunca dos igualdades pintadas idénticas, y 2⁴ = 4² pesa poco', async () => {
  const { renderPlantilla } = await import('../practicas/especiales/textos.js');
  const rng = crearRng(31);
  let con13 = 0;
  const M = 4000;
  for (let i = 0; i < M; i++) {
    const it = generarFalsa(rng);
    const textos = it.items.map(x => renderPlantilla(x.id, x.vars));
    assert.equal(new Set(textos).size, 4, textos.join(' | '));
    if (it.items.some(x => x.id === 13)) con13++;
  }
  console.log('2⁴ = 4² en ejercicio 2:', (con13 / M * 100).toFixed(1), '%');
  assert.ok(con13 / M < 0.2, `2⁴ = 4² sale en ${con13} de ${M}`);
});

test('textos: sin × en el feedback inglés, sin «exponente 0 vale 1», y los millares separados', async () => {
  const { explicarPlantilla, renderPlantilla } = await import('../practicas/especiales/textos.js');
  for (let id = 1; id <= 14; id++) {
    for (const vars of [{ a: 3, n: 4 }, { a: 7, n: 6 }]) {
      const { es, en } = explicarPlantilla(id, vars, 10 ** vars.n, 10 * vars.n);
      assert.doesNotMatch(en, /×/, `id ${id}`);
      assert.doesNotMatch(es + en, /sea cual sea la base|whatever the base/, `id ${id}`);
      for (const t of [renderPlantilla(id, vars), es, en]) assert.doesNotMatch(t, /\d{5,}/, `id ${id} sin separar millares`);
    }
  }
});
