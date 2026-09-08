// Renderizado de fórmulas con KaTeX. Si la biblioteca no ha cargado (sin red),
// se muestra el TeX como texto para no dejar la pantalla vacía.

export function renderTex(el, tex, opciones = {}) {
  el.textContent = '';
  if (window.katex) {
    try {
      window.katex.render(tex, el, { throwOnError: false, displayMode: false, ...opciones });
      return;
    } catch (e) {
      console.warn('KaTeX no pudo renderizar', tex, e);
    }
  }
  el.textContent = texAPlano(tex);
}

/** Crea un elemento con la fórmula ya renderizada. */
export function elementoTex(tex, clase = '') {
  const span = document.createElement('span');
  if (clase) span.className = clase;
  renderTex(span, tex);
  return span;
}

/** Conversión aproximada de TeX a texto legible (para CSV y para el fallback). */
export function texAPlano(tex) {
  return String(tex)
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\^\{([^}]*)\}/g, '^$1')
    .replace(/\\cdot/g, '·')
    .replace(/\{,\}/g, ',')
    .replace(/\\,/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
