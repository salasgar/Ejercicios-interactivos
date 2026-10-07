// Azar con semilla, idéntico al de `divisores/logica.js`: con la misma semilla
// salen los mismos números, y así los generadores se pueden probar.

/** Generador con semilla (mulberry32). */
export function crearRng(semilla) {
  let s = semilla >>> 0;
  const azar = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const entero = (min, max) => min + Math.floor(azar() * (max - min + 1));
  const elegir = lista => lista[Math.floor(azar() * lista.length)];
  const barajar = lista => {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };
  return { azar, entero, elegir, barajar };
}
