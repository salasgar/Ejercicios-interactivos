// Textos de la práctica, en español y en inglés, y las frases que se montan
// con los números de cada ejercicio.

export const T = {
  es: {
    titulo: 'Divisor, múltiplo, divisible',
    entrada_titulo: 'Escribe tu código',
    entrada_ayuda: 'Es el código de 4 caracteres que te ha dado tu profesor.',
    entrada_boton: 'Entrar',
    entrada_error: 'Ese código no es correcto. Revísalo: son 4 letras o números.',
    probar: 'Probar sin código',
    probar_aviso: 'Sin código puedes practicar, pero no se guarda nada.',
    menu_titulo: 'Ejercicios',
    menu_regla: 'En cada ejercicio tienes que acertar 20 veces. ¡Ojo! Cada fallo añade 2 más (hasta un máximo de 40). Piénsalo bien antes de contestar.',
    animos: [
      '¡Ánimo! Lo importante es seguir intentándolo.',
      'No pasa nada: de los errores también se aprende.',
      'Casi. Lee la explicación y a por el siguiente.',
      'Con calma: esto cuesta al principio. ¡Tú puedes!',
    ],
    sin_codigo: 'Estás practicando sin código: no se guarda nada.',
    empezar: 'Empezar',
    seguir: 'Seguir',
    repetir: 'Practicar otra vez',
    hecho: 'Hecho',
    quedan: n => `Te quedan ${n}`,
    fallos: n => (n === 1 ? '1 fallo' : `${n} fallos`),
    ejercicios: [
      { nombre: 'Ejercicio 0', detalle: '¿«de» o «entre»?' },
      { nombre: 'Ejercicio 1', detalle: 'Con multiplicaciones' },
      { nombre: 'Ejercicio 2', detalle: 'Con divisiones' },
      { nombre: 'Ejercicio 3', detalle: 'Multiplicaciones y divisiones' },
      { nombre: 'Ejercicio 4', detalle: 'Arrastra los números' },
    ],
    instruccion: {
      eleccion: 'Elige lo que va en el hueco.',
      preposicion: 'Elige la palabra que falta.',
      arrastrar: 'Arrastra dos números a los huecos para que la frase sea verdad.',
    },
    resto: 'resto',
    es: 'es',
    comprobar: 'Comprobar',
    siguiente: 'Siguiente',
    salir: '← Ejercicios',
    bien: '¡Bien!',
    tambien: 'También vale:',
    mal: 'No es correcto.',
    penalizacion: n => (n > 0 ? `+${n} · ${n === 1 ? 'Se añade 1 más' : `Se añaden ${n} más`}.` : 'Ya tienes el máximo: no se añaden más.'),
    fijate: 'Fíjate:',
    por_eso: 'Por eso',
    por_ejemplo: 'Por ejemplo:',
    y: 'y',
    se_dice: 'Se dice «múltiplo de», «divisor de» y «divisible entre».',
    fin_titulo: '¡Ejercicio terminado!',
    fin_resumen: (a, f) => `Aciertos: ${a} · Fallos: ${f}`,
    fin_practica: 'Era una repetición para practicar: tu resultado guardado no cambia.',
    resultado_titulo: 'Tu código de resultado',
    resultado_parcial: n => `Has terminado ${n} de 5 ejercicios. Cuando los termines todos, envía este código a tu profesor.`,
    resultado_completo: '¡Has terminado los 5 ejercicios! Copia este código y envíaselo a tu profesor.',
    copiar: 'Copiar',
    copiado: '¡Copiado!',
    cambiar_codigo: 'Salir',
    relacion: { divisor: 'divisor de', multiplo: 'múltiplo de', divisible: 'divisible entre' },
    palabra: { divisor: 'divisor', multiplo: 'múltiplo', divisible: 'divisible' },
    preposicion: { de: 'de', entre: 'entre' },
    no_es: 'no es',
  },
  en: {
    titulo: 'Divisor, multiple, divisible',
    entrada_titulo: 'Type your code',
    entrada_ayuda: 'It is the 4-character code your teacher gave you.',
    entrada_boton: 'Enter',
    entrada_error: 'That code is not correct. Check it: it has 4 letters or numbers.',
    probar: 'Try without a code',
    probar_aviso: 'Without a code you can practise, but nothing is saved.',
    menu_titulo: 'Exercises',
    menu_regla: 'In each exercise you need 20 correct answers. Careful! Each mistake adds 2 more (up to a maximum of 40). Think carefully before you answer.',
    animos: [
      'Keep going! The important thing is to keep trying.',
      'No problem: we also learn from mistakes.',
      'Almost. Read the explanation and try the next one.',
      'Don’t worry, this is hard at first. You can do it!',
    ],
    sin_codigo: 'You are practising without a code: nothing is saved.',
    empezar: 'Start',
    seguir: 'Continue',
    repetir: 'Practise again',
    hecho: 'Done',
    quedan: n => `${n} to go`,
    fallos: n => (n === 1 ? '1 mistake' : `${n} mistakes`),
    ejercicios: [
      { nombre: 'Exercise 0', detalle: '“of” or “by”?' },
      { nombre: 'Exercise 1', detalle: 'With multiplications' },
      { nombre: 'Exercise 2', detalle: 'With divisions' },
      { nombre: 'Exercise 3', detalle: 'Multiplications and divisions' },
      { nombre: 'Exercise 4', detalle: 'Drag the numbers' },
    ],
    instruccion: {
      eleccion: 'Choose what goes in the gap.',
      preposicion: 'Choose the missing word.',
      arrastrar: 'Drag two numbers to the gaps to make the sentence true.',
    },
    resto: 'remainder',
    es: 'is',
    comprobar: 'Check',
    siguiente: 'Next',
    salir: '← Exercises',
    bien: 'Correct!',
    tambien: 'Also correct:',
    mal: 'That is not correct.',
    penalizacion: n => (n > 0 ? `+${n} · ${n === 1 ? '1 more is added' : `${n} more are added`}.` : 'You already have the maximum: no more are added.'),
    fijate: 'Look:',
    por_eso: 'So',
    por_ejemplo: 'For example:',
    y: 'and',
    se_dice: 'We say “a multiple of”, “a divisor of” and “divisible by”.',
    fin_titulo: 'Exercise finished!',
    fin_resumen: (a, f) => `Correct: ${a} · Mistakes: ${f}`,
    fin_practica: 'This was extra practice: your saved result does not change.',
    resultado_titulo: 'Your result code',
    resultado_parcial: n => `You have finished ${n} of 5 exercises. When you finish them all, send this code to your teacher.`,
    resultado_completo: 'You have finished the 5 exercises! Copy this code and send it to your teacher.',
    copiar: 'Copy',
    copiado: 'Copied!',
    cambiar_codigo: 'Log out',
    relacion: { divisor: 'a divisor of', multiplo: 'a multiple of', divisible: 'divisible by' },
    palabra: { divisor: 'a divisor', multiplo: 'a multiple', divisible: 'divisible' },
    preposicion: { de: 'of', entre: 'by' },
    no_es: 'is not',
  },
};

/** «12 · 5 = 60» o «75 : 3 = 25, resto = 0». */
export function textoOperacion(op, idioma) {
  return op.clase === 'producto'
    ? `${op.a} · ${op.b} = ${op.c}`
    : `${op.a} : ${op.b} = ${op.c}, ${T[idioma].resto} = 0`;
}

/** «5 es divisor de 60». */
export function frase(relacion, x, y, idioma) {
  return `${x} ${T[idioma].es} ${T[idioma].relacion[relacion]} ${y}`;
}

/** «3 no es múltiplo de 5». */
export function fraseNegada(relacion, x, y, idioma) {
  return `${x} ${T[idioma].no_es} ${T[idioma].relacion[relacion]} ${y}`;
}

/** La cuenta que justifica la relación entre x e y: «60 = 5 · 12» o «60 : 5 = 12, resto 0». */
export function razon(relacion, x, y, idioma) {
  return relacion === 'divisor'
    ? `${y} : ${x} = ${y / x}, ${T[idioma].resto} 0`
    : `${x} = ${y} · ${x / y}`;
}

/** Une frases con «y»: «a, b y c». */
export function unir(frases, idioma) {
  if (frases.length < 2) return frases.join('');
  return `${frases.slice(0, -1).join(', ')} ${T[idioma].y} ${frases.at(-1)}`;
}
