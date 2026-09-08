// Conversores puros de número a palabras, en inglés y en español.
// Rango soportado: 0..999999 (y también 1000000). Sin dependencias de rng:
// dado el mismo número siempre devuelven el mismo texto.

// ---------------------------------------------------------------------------
// Inglés.

const EN_UNIDADES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const EN_DECENAS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 0..99 en palabras: "twenty-one", "sixteen", "forty". */
export function enDosDigitos(n) {
  if (n < 20) return EN_UNIDADES[n];
  const d = Math.floor(n / 10), u = n % 10;
  return u === 0 ? EN_DECENAS[d] : `${EN_DECENAS[d]}-${EN_UNIDADES[u]}`;
}

/** 1..999 en palabras: "one hundred", "two hundred and thirty-four" (o sin "and"). */
export function enGrupoDeTres(n, conAnd) {
  const c = Math.floor(n / 100), r = n % 100;
  if (c === 0) return enDosDigitos(r);
  let s = `${EN_UNIDADES[c]} hundred`;
  if (r > 0) s += (conAnd ? ' and ' : ' ') + enDosDigitos(r);
  return s;
}

function numeroAInglesInterno(n, conAnd) {
  if (n === 0) return 'zero';
  const millones = Math.floor(n / 1000000);
  const restoM = n % 1000000;
  const miles = Math.floor(restoM / 1000);
  const resto3 = restoM % 1000;
  const partes = [];
  if (millones > 0) partes.push(`${enGrupoDeTres(millones, conAnd)} million`);
  if (miles > 0) partes.push(`${enGrupoDeTres(miles, conAnd)} thousand`);
  if (resto3 > 0) {
    const centenas = Math.floor(resto3 / 100);
    if (centenas > 0) {
      partes.push(enGrupoDeTres(resto3, conAnd));
    } else if (partes.length > 0 && conAnd) {
      partes.push(`and ${enDosDigitos(resto3)}`);
    } else {
      partes.push(enDosDigitos(resto3));
    }
  }
  return partes.join(' ');
}

/** "one hundred and seventy-three", "two thousand and five" (forma con "and"). */
export function numeroAIngles(n) {
  return numeroAInglesInterno(n, true);
}

/** "one hundred seventy-three", "two thousand five" (forma sin "and", también válida). */
export function numeroAInglesSinAnd(n) {
  return numeroAInglesInterno(n, false);
}

// ---------------------------------------------------------------------------
// Español.

const ES_UNIDADES = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
  'diecisiete', 'dieciocho', 'diecinueve',
];
const ES_VEINTI = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const ES_DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const ES_CIENTOS = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

/** 0..99 en palabras: "veintiuno", "treinta y uno", "dieciséis". */
export function esDosDigitos(n) {
  if (n < 20) return ES_UNIDADES[n];
  if (n < 30) return ES_VEINTI[n - 20];
  const d = Math.floor(n / 10), u = n % 10;
  return u === 0 ? ES_DECENAS[d] : `${ES_DECENAS[d]} y ${ES_UNIDADES[u]}`;
}

/** 1..999 en palabras: "ciento setenta y tres", "quinientos", "doscientos treinta". */
export function esGrupoDeTres(n) {
  const c = Math.floor(n / 100), r = n % 100;
  if (c === 0) return esDosDigitos(r);
  if (r === 0) return ES_CIENTOS[c];
  const prefijo = c === 1 ? 'ciento' : ES_CIENTOS[c];
  return `${prefijo} ${esDosDigitos(r)}`;
}

/** Apocope de "uno" delante de "mil": "un mil", "veintiún mil", "treinta y un mil". */
function esAnteMil(s) {
  if (s === 'uno') return 'un';
  if (s.endsWith('veintiuno')) return `${s.slice(0, -'veintiuno'.length)}veintiún`;
  if (s.endsWith(' y uno')) return `${s.slice(0, -'y uno'.length)}y un`;
  return s;
}

/** "ciento setenta y tres", "mil", "dos mil trescientos", "un millón". */
export function numeroAEspanol(n) {
  if (n === 0) return 'cero';
  const millones = Math.floor(n / 1000000);
  const restoM = n % 1000000;
  const miles = Math.floor(restoM / 1000);
  const resto3 = restoM % 1000;
  const partes = [];
  if (millones > 0) partes.push(millones === 1 ? 'un millón' : `${esGrupoDeTres(millones)} millones`);
  if (miles > 0) partes.push(miles === 1 ? 'mil' : `${esAnteMil(esGrupoDeTres(miles))} mil`);
  if (resto3 > 0) partes.push(esGrupoDeTres(resto3));
  return partes.join(' ');
}
