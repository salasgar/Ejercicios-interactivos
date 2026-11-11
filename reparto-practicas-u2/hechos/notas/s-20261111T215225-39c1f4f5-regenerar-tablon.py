#!/usr/bin/env python3
"""Regenera reparto-practicas-u2/_ESTADO.md ENTERO a partir de hechos/, las fichas y el tablón anterior.

Escrito por la coordinadora s-20261111T215225-39c1f4f5 (2026-11-11). Uso, desde la raíz del repositorio:

    git fetch origin            # y pull --rebase si hay commits (nunca --autostash)
    python3 -I reparto-practicas-u2/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py \
        reparto-practicas-u2 <tu-sid> "al cerrar la NN (LISTA, commit abc1234; npm test 1810/1810)" \
        > /tmp/estado-nuevo.md && mv /tmp/estado-nuevo.md reparto-practicas-u2/_ESTADO.md
    git diff --stat reparto-practicas-u2/_ESTADO.md   # y léelo antes de comitear

Qué sale de dónde:
- Estado y última columna de cada fila: de hechos/ (reclamos, terminadas, reabiertas, fallos, sustituidas), con la hora real.
  Gana el rastro más reciente por su fecha interna (la mayor hora ISO del fichero, nunca anterior a la del sid).
  Una terminada que empieza por «PARCIAL» da PARCIAL. Sin rastros: PENDIENTE o BLOQUEADA según la precondición.
- Columnas Tarea, Fichero, Precondición y Salida: de la fila del tablón anterior (o de la ficha si la fila no existe), recortadas
  a 200 y 110 caracteres. Las dependencias «NN LISTA» se leen de la celda y de la Precondición entera de la ficha.
  Una tarea nueva sale con la Precondición larga de su ficha: corta su celda a mano una vez y la siguiente regeneración la conserva.
- Duración, Banda y Encadenable: SIEMPRE de la ficha (regla del tablón).
- Publicadas o no: de `disponible` en practicas/_comun/catalogo.js; el publicador, de las fichas cuyo «Ficheros que toca» cita
  `disponible` y el slug.
- Precondiciones que no están en hechos/ (papel de otro reparto, firmas, «Juan Luis delante»): diccionario EXTERNO de abajo.
  Lo mantiene la coordinadora; si cambia algo de eso, se edita aquí (fichero de su sid: cópialo con tu sid si necesitas cambiarlo).
- Historial: se conservan las 12 líneas «Actualizado» más recientes; las anteriores siguen en git y, hasta el 11-11, en
  hechos/notas/s-20261111T215225-39c1f4f5-historial-tablon.md.
No toca nada más que lo que imprime: la salida va a stdout.
"""
import datetime as dt
import glob
import os
import re
import sys

R = sys.argv[1]
SID = sys.argv[2] if len(sys.argv) > 2 else 's-?'
NOTA = sys.argv[3] if len(sys.argv) > 3 else 'regeneración completa'
RAIZ = os.path.dirname(os.path.abspath(R))
NOW = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

# Precondiciones externas: (cumplida, texto). Revisadas el 2026-11-11 por s-20261111T215225-39c1f4f5.
EXTERNO = {
    132: (False, 'solo 3 de las 7 prácticas de la U5 publicadas; las otras 4 (123-126), sin publicador'),
    156: (False, 'la hoja 1 y el examen 1 de la U6 aún no existen (11-11)'),
    157: (False, 'la hoja 2 y el examen 2 de la U6 aún no existen (11-11)'),
    158: (False, 'la hoja 3 y el examen 3 de la U6 aún no existen (11-11)'),
    159: (False, 'la hoja 4, el tipo test 4 y el final de la U6 aún no existen (11-11)'),
    161: (False, 'F0 del reparto de la U6 sin firmar (11-11)'),
}

ISO = re.compile(r'(20\d\d-\d\d-\d\d)[T ](\d\d:\d\d(?::\d\d)?)Z?')
SIDRE = re.compile(r's-(\d{8})T(\d{6})-[0-9a-f]{8}')


def iso(d, t):
    return dt.datetime.fromisoformat(f'{d}T{t if len(t) == 8 else t + ":00"}')


def sid_t(s):
    m = SIDRE.search(s)
    return dt.datetime.strptime(m.group(1) + m.group(2), '%Y%m%d%H%M%S') if m else None


def corta(s, n):
    s = ' '.join(s.split())
    return s if len(s) <= n else s[:n - 1].rstrip() + '…'


def hm(t):
    return f'{t:%H:%M}Z ({t.day}-{MESES[t.month - 1]})'


def leer(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


# ---------- tablón anterior
viejo = leer(f'{R}/_ESTADO.md')
lineas = viejo.splitlines()


def seccion(titulo):
    i = next(k for k, l in enumerate(lineas) if l.strip() == titulo)
    j = next((k for k in range(i + 1, len(lineas)) if lineas[k].startswith('## ')), len(lineas))
    return i, j


filas_viejas = {}
ti, tj = seccion('## Tabla de tareas')
for l in lineas[ti:tj]:
    m = re.match(r'^\|\s*(\d+)\s*\|', l)
    if m:
        celdas = [c.strip() for c in l.strip().strip('|').split('|')]
        filas_viejas[int(m.group(1))] = celdas
cabecera = '\n'.join(lineas[:next(k for k, l in enumerate(lineas) if l.startswith('Actualizado'))]).rstrip()
actualizados = [l for l in lineas if l.startswith('Actualizado ')]
ai, aj = seccion('## Antes de hacer nada')
oi, oj = seccion('## Reglas de operación')
antes = '\n'.join(lineas[ai:aj]).rstrip()
reglas = '\n'.join(lineas[oi:oj]).rstrip()
intro_tabla = []
for l in lineas[ti + 1:tj]:
    if l.startswith('| #'):
        break
    intro_tabla.append(l)
intro_tabla = '\n'.join(intro_tabla).strip()
fijos = []  # párrafos fijos tras la tabla (se copian tal cual)
for marca in ('Lo que la 37 deja propuesto', 'Fuera del reparto: el commit 58a9da2', 'Los cuatro arreglos de la base'):
    k = next((k for k, l in enumerate(lineas) if l.startswith(marca)), None)
    if k is not None:
        p = []
        while k < len(lineas) and lineas[k].strip():
            p.append(lineas[k]); k += 1
        fijos.append('\n'.join(p))
reca = ''
k = next((k for k, l in enumerate(lineas) if l.startswith('Recalibración (primera terminada)')), None)
if k is not None:
    p = []
    while k < len(lineas) and lineas[k].strip():
        p.append(lineas[k]); k += 1
    reca = '\n'.join(p)

# ---------- fichas
fichas = {}
for p in sorted(glob.glob(f'{R}/tareas/tarea-*.md')):
    m = re.match(r'tarea-0*(\d+)-', os.path.basename(p))
    if not m:
        continue
    n = int(m.group(1))
    txt = leer(p)
    cab = '\n'.join(txt.splitlines()[:12])
    tit = re.search(r'^# Tarea \d+ · (.+)$', txt, re.M)
    dur = re.search(r'Duración esperada:\s*([^(·\n]+)', cab)
    ban = re.search(r'Banda de modelo:\s*([A-ZÁÉÍÓÚ]+(?: \([^)]*\))?)', cab)
    enc = re.search(r'Encadenable con:\s*([^\n]+)', cab)
    pre = re.search(r'^Precondición:\s*([^\n]+)', cab, re.M)
    toca = re.search(r'^Ficheros que toca[^:]*:\s*([^\n]+)', cab, re.M)
    sal = re.search(r'^Carpeta de salida[^:]*:\s*`([^`]+)`', cab, re.M)
    fichas[n] = dict(
        ruta=os.path.relpath(p, R), titulo=tit.group(1).strip() if tit else '?',
        dur=dur.group(1).strip() if dur else '?', banda=ban.group(1).strip() if ban else '?',
        enc=corta(enc.group(1), 70) if enc else '—', pre=pre.group(1) if pre else '',
        toca=toca.group(1) if toca else '', salida=sal.group(1) if sal else '')

# ---------- catálogo
cat = leer(os.path.join(RAIZ, 'practicas/_comun/catalogo.js'))
disp = {m.group(1): m.group(2) == 'true'
        for m in re.finditer(r"slug: '([^']+)'.*?disponible: (true|false)", cat)}
ids = {int(m.group(1)): m.group(2) for m in re.finditer(r"id: (\d+), slug: '([^']+)'", cat)}
publicadores = {}
for n, f in fichas.items():
    if 'disponible' not in f['toca']:
        continue
    zona = f['titulo'] + ' ' + f['toca']
    slugs = {x for x in re.findall(r'`([a-z0-9-]+)`', zona) if x in disp}
    slugs |= {ids[int(x)] for x in re.findall(r'\((\d{1,3})\)', f['titulo']) if int(x) in ids}
    for m in re.finditer(r'filas? ((?:\d{1,3}(?:\s*(?:,|y|e)\s*)?)+)', f['toca']):
        slugs |= {ids[int(x)] for x in re.findall(r'\d{1,3}', m.group(1)) if int(x) in ids}
    for x in slugs:
        publicadores.setdefault(x, []).append(n)

# ---------- hechos
rastros = {}
relevados = set()
for p in glob.glob(f'{R}/hechos/reclamos/*.md'):
    for m in re.finditer(r'^releva a:\s*(s-\S+)', leer(p), re.M):
        relevados.add(m.group(1).strip())
for kind in ('reclamos', 'terminadas', 'reabiertas', 'fallos', 'sustituidas'):
    for p in glob.glob(f'{R}/hechos/{kind}/*.md'):
        b = os.path.basename(p)
        m = re.match(r'^(\d+)--', b)
        if not m:
            continue
        txt = leer(p)
        st = sid_t(b)
        t = st
        if kind == 'reclamos':
            ab = re.search(r'^abierto:\s*(\S+)', txt, re.M)
            if ab and ISO.search(ab.group(1)):
                t = iso(*ISO.search(ab.group(1)).groups())
            cad = re.findall(r'^caduca:\s*(\S+)', txt, re.M)
            cadt = iso(*ISO.search(cad[-1]).groups()) if cad and ISO.search(cad[-1]) else None
            sidm = re.search(r'^sesi[oó]n:\s*(s-\S+)', txt, re.M)
            sid = sidm.group(1) if sidm else (SIDRE.search(b).group(0) if SIDRE.search(b) else b)
            extra = dict(cad=cadt, cerrado=bool(re.search(r'^(CERRADA|CEDIDA|ABANDONADA)', txt, re.M)),
                         sid=sid, relevado=sid in relevados)
        else:
            ts = [iso(*x.groups()) for x in ISO.finditer(txt)]
            ts = [x for x in ts if x <= NOW and (st is None or x >= st)]
            if ts:
                t = max(ts)
            extra = {}
        if t is None:
            t = dt.datetime(2026, 1, 1)
        rastros.setdefault(int(m.group(1)), []).append(dict(kind=kind, file=b, t=t, txt=txt, **extra))

estado = {}


def calcula(n):
    trs = sorted(rastros.get(n, []), key=lambda x: x['t'])
    vivos = [x for x in trs if x['kind'] == 'reclamos' and not x['cerrado'] and not x['relevado']
             and x['cad'] and x['cad'] > NOW]
    otros = [x for x in trs if x['kind'] != 'reclamos']
    ult = otros[-1] if otros else None
    recs = [x for x in trs if x['kind'] == 'reclamos']
    urec = recs[-1] if recs else None
    if vivos:
        v = vivos[-1]
        return 'EN CURSO', f'{v["sid"]} · caduca {v["cad"]:%H:%M:%S}Z ({v["cad"].day}-{MESES[v["cad"].month - 1]})', ult
    if urec and not urec['cerrado'] and not urec['relevado'] and (ult is None or urec['t'] > ult['t']):
        c = urec['cad']
        return 'RELEVABLE', f'{urec["sid"]} · caducó {hm(c) if c else "?"} sin cierre', ult
    if ult is None:
        return None, '', None
    if ult['kind'] == 'terminadas':
        if ult['txt'].lstrip().startswith('PARCIAL'):
            return 'PARCIAL', corta(ult['txt'].strip().splitlines()[0], 160), ult
        com = re.search(r'^commits?:\s*([0-9a-f]{7,})', ult['txt'], re.M) or re.search(r'\bcommit\s+([0-9a-f]{7,})', ult['txt'])
        return 'LISTA', f'terminada {hm(ult["t"])}' + (f' · commit {com.group(1)[:7]}' if com else ''), ult
    if ult['kind'] == 'reabiertas':
        return 'REABIERTA', f'reabierta {hm(ult["t"])}: `hechos/reabiertas/{ult["file"]}`', ult
    if ult['kind'] == 'sustituidas':
        return 'SUSTITUIDA', f'`hechos/sustituidas/{ult["file"]}`', ult
    pp = re.search(r'parada por:\s*(.*)', ult['txt'])
    pp = pp.group(1) if pp else ''
    e = 'A MEDIAS' if 'agotada' in pp else 'MAL CORTADA' if 'mal cortada' in pp else 'FALLIDA'
    return e, f'fallo {hm(ult["t"])}: `hechos/fallos/{ult["file"]}`', ult


todas = sorted(set(fichas) | set(rastros) | set(filas_viejas))
for n in todas:
    estado[n] = calcula(n)


def deps(pre):
    pre = pre.replace('*', '')
    out = []
    for m in re.finditer(r'((?:\d{2,3})(?:\s*(?:,|\by\b|\be\b)\s*\d{2,3})*)\s+LISTAS?', pre):
        out += [int(x) for x in re.findall(r'\d{2,3}', m.group(1))]
    return out


def es_lista(n):
    return estado.get(n, (None,))[0] in ('LISTA', 'SUSTITUIDA')


final = {}
for n in todas:
    st0 = estado[n][0]
    if st0 is None:
        f = fichas.get(n, {})
        v = filas_viejas.get(n)
        pre0 = (v[3] if v and len(v) >= 8 else '') + ' ' + f.get('pre', '')
        bloq = any(d != n and not es_lista(d) for d in deps(pre0)) or (n in EXTERNO and not EXTERNO[n][0])
        st0 = 'BLOQUEADA' if bloq else 'PENDIENTE'
    final[n] = st0


def est(p):
    return final.get(p, '?')


slug_de = {}
filas = []
for n in todas:
    f = fichas.get(n, {})
    v = filas_viejas.get(n)
    if v and len(v) >= 8:
        tarea, fichero, pre, salida = v[1], v[2], v[3], v[7]
    else:
        tarea, fichero = f.get('titulo', '?'), f.get('ruta', '?')
        pre, salida = corta(f.get('pre', ''), 160), f.get('salida', '')
    dur = f.get('dur', v[4] if v and len(v) > 4 else '?')
    banda = f.get('banda', v[5] if v and len(v) > 5 else '?')
    enc = f.get('enc', v[6] if v and len(v) > 6 else '—')
    st, det, ult = estado[n]
    faltan = sorted({d for d in deps(pre + ' ' + f.get('pre', '')) if d != n and not es_lista(d)})
    ext = EXTERNO.get(n)
    if st is None or st == 'PARCIAL':
        espera = []
        if faltan:
            espera.append('espera a ' + ', '.join(str(x) for x in faltan))
        if ext and not ext[0]:
            espera.append(ext[1])
        if st is None:
            st = 'BLOQUEADA' if espera else 'PENDIENTE'
            det = '; '.join(espera) if espera else ('— · ' + ext[1] if ext else '—')
        elif espera:
            det += ' · lo que falta: ' + '; '.join(espera)
    for s in re.findall(r'practicas/([a-z0-9-]+)/', salida):
        if s in disp and s != '_comun':
            slug_de[n] = s
            break
    s = slug_de.get(n)
    if s and not disp[s] and st in ('LISTA', 'PARCIAL'):
        pubs = [p for p in publicadores.get(s, []) if p != n]
        vivos = [p for p in pubs if est(p) not in ('LISTA', 'SUSTITUIDA')]
        det += f' · **sin publicar** (`{s}`): ' + (
            'la publica la ' + ' o la '.join(f'{p} ({est(p)})' for p in vivos) if vivos else '**sin publicador**')
    filas.append((n, tarea, fichero, corta(pre, 200), dur, banda, enc, corta(salida, 110), st, det))

# ---------- salida
o = []
o.append(cabecera)
o.append('')
nuevo = (f'Actualizado {NOW:%Y-%m-%dT%H:%MZ} por {SID} {NOTA}: **regeneración completa** con '
         f'`hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py` (relistado `hechos/` tras `git fetch`; '
         f'todas las filas recalculadas contra `hechos/` y la hora real; banda, duración y «encadenable» de las fichas).')
o.append(nuevo)
for l in actualizados[:11]:
    o.append('')
    o.append(l)
o.append('')
o.append('Las líneas «Actualizado» anteriores están en git y, hasta el 11-11, en '
         '`hechos/notas/s-20261111T215225-39c1f4f5-historial-tablon.md` (no derivadas).')
o.append('')
o.append(antes)
o.append('')
o.append(reglas)
o.append('')
o.append('## Tabla de tareas')
o.append('')
o.append(intro_tabla)
o.append('')
o.append('| # | Tarea | Fichero | Precondición | Duración esperada | Banda | Encadenable con | Salida (dueño único) | Estado | Reclamo vivo (sid · caduca) |')
o.append('|---|---|---|---|---|---|---|---|---|---|')
for fl in filas:
    n = fl[0]
    o.append('| ' + ' | '.join([f'{n:02d}'] + [str(x).replace('|', '/') for x in fl[1:]]) + ' |')
o.append('')
o.append('Bandas hoy (de `proyecto.md`, puesta al día el 2026-10-21): ALTO = Opus 5.5, esfuerzo Alto ·')
o.append('MEDIO = Sonnet 5.5, esfuerzo Medio · BAJO = Haiku 4.5, esfuerzo Medio (sin tareas BAJO).')
o.append('')
cuenta = {}
for fl in filas:
    cuenta.setdefault(fl[8], []).append(fl[0])
o.append(f'**Foto a {NOW:%Y-%m-%d %H:%M}Z**: ' + ' · '.join(
    f'{k} {len(v)}' + (f' ({", ".join(str(x) for x in v)})' if k != 'LISTA' else '') for k, v in sorted(cuenta.items())) + '.')
o.append('')
for p in fijos:
    o.append(p)
    o.append('')
o.append('## Prácticas sin publicar')
o.append('')
o.append('Derivado de `disponible: false` en `practicas/_comun/catalogo.js` y de las fichas que lo cambian («Ficheros que toca»).')
o.append('')
for s, d in disp.items():
    if d:
        continue
    duenos = [n for n, x in slug_de.items() if x == s]
    pubs = publicadores.get(s, [])
    vivos = [p for p in pubs if est(p) not in ('LISTA', 'SUSTITUIDA')]
    o.append(f'- `{s}` (tarea {", ".join(str(x) for x in duenos) or "?"}, '
             f'{"; ".join(est(x) for x in duenos) or "?"}): '
             + ('la publica la ' + ', '.join(f'{p} ({est(p)})' for p in vivos) if vivos else '**sin publicador**'
                + (f' (lo intentaron: {", ".join(str(p) for p in pubs)})' if pubs else '')))
o.append('')
o.append('## Registro de finalizaciones')
o.append('')
term = []
for n, trs in rastros.items():
    for x in trs:
        if x['kind'] == 'terminadas':
            term.append((x['t'], n, x))
term.sort(key=lambda y: y[0], reverse=True)
o.append(f'Derivado de `hechos/terminadas/`: una línea por fichero ({len(term)}), más reciente arriba.')
o.append('Formato: `LISTA · tarea NN · AAAA-MM-DD HH:MM · sid · commit · ficheros · duración real` (lo que diga la terminada).')
o.append('')
o.append('El registro cuenta terminadas: una tarea REABIERTA sigue teniendo aquí su línea de cuando')
o.append('se cerró. Su estado de hoy es el de la tabla.')
o.append('')
for t, n, x in term:
    tx = x['txt']
    sid = SIDRE.search(x['file']).group(0) if SIDRE.search(x['file']) else '?'
    com = re.search(r'^commits?:\s*([^\n]+)', tx, re.M)
    com = corta(com.group(1), 50) if com else (re.search(r'\bcommit\s+([0-9a-f]{7,})', tx).group(1)[:7]
                                                if re.search(r'\bcommit\s+([0-9a-f]{7,})', tx) else '—')
    fic = re.search(r'^ficheros[^:\n]*:\s*([^\n]+)', tx, re.M)
    fic = corta(fic.group(1), 80) if fic else '—'
    dur = re.search(r'duración real:\s*([^\n]+)', tx)
    dur = corta(dur.group(1), 50) if dur else '—'
    pref = 'PARCIAL' if tx.lstrip().startswith('PARCIAL') else 'LISTA'
    o.append(f'{pref} · tarea {n:02d} · {t:%Y-%m-%d %H:%M} · {sid} · {com} · {fic} · {dur}')
o.append('')
if reca:
    o.append(reca)
    o.append('')
o.append('## Incidencias de coordinación')
o.append('')
o.append('Derivado de `hechos/incidencias/`: una línea por fichero, más reciente arriba.')
o.append('')
inc = []
for p in glob.glob(f'{R}/hechos/incidencias/*.md'):
    b = os.path.basename(p)
    tx = leer(p).strip()
    prim = ' · '.join(l.strip() for l in tx.splitlines()
                      if l.strip() and not l.startswith('#') and not re.match(r'^(sesi[oó]n|hora|fecha):', l))
    inc.append((sid_t(b) or dt.datetime(2026, 1, 1), b, prim))
for t, b, prim in sorted(inc, reverse=True):
    o.append(f'- `{b}`: {corta(prim, 260)}')
o.append('')
o.append('Los automatismos y las rutas del proyecto están en `proyecto.md`, no aquí: este fichero')
o.append('se regenera entero y se los llevaría por delante.')
print('\n'.join(o))
