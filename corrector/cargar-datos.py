#!/usr/bin/env python3
"""
Genera data/datos-iniciales.json para el corrector.

Parte de la copia de seguridad más reciente del corrector (corrector-copia-*.json),
que es la fuente de verdad: alumnos con sus ids reales, registros ya corregidos y
claves con sus preguntas anuladas. Solo añade las claves de semanas que la copia
no tenga, tomándolas de los clave-semanaN.json de data/.

NO reconstruye la lista de alumnos desde ningún otro sitio: los ids que genera la
app («alba.lopez») no se pueden deducir con fiabilidad del texto del listado
oficial, y un id distinto deja huérfanos los registros.
"""

import json
import sys
from pathlib import Path

APUNTES = Path(
    "/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/"
    "1º ESO/apuntes-1eso-bilingue"
)
EXAMENES = APUNTES / "1. Natural numbers, powers and roots/exámenes-semanales"


def id_clave(unidad, semana):
    return f"{unidad}|{semana}"


def migrar(datos):
    """Como migrar() en logica.js: claves por «unidad|semana», registros con unidad."""
    claves, registros = {}, {}
    unidad_de_semana = {}
    for c in datos["claves"].values():
        c = {**c, "unidad": c.get("unidad", 1)}
        claves[id_clave(c["unidad"], c["semana"])] = c
        unidad_de_semana.setdefault(c["semana"], c["unidad"])
    for r in datos["registros"].values():
        unidad = r.get("unidad", unidad_de_semana.get(r["semana"], 1))
        registros[f"{unidad}|{r['semana']}|{r['alumno']}"] = {**r, "unidad": unidad}
    return {"alumnos": datos["alumnos"], "claves": claves, "registros": registros}


def copia_mas_reciente():
    copias = sorted(EXAMENES.glob("semana-*/corrector-copia-*.json"),
                    key=lambda p: p.stat().st_mtime)
    if not copias:
        sys.exit(f"No hay ninguna corrector-copia-*.json bajo {EXAMENES}")
    return copias[-1]


def main():
    data_dir = Path(__file__).parent / "data"
    copia = copia_mas_reciente()
    print(f"Copia de partida: {copia.name}")

    d = json.loads(copia.read_text(encoding="utf-8"))
    datos = migrar({"alumnos": d["alumnos"], "claves": d["claves"], "registros": d["registros"]})

    # «Pepe» fue un alumno ficticio de prueba; fuera él y sus registros.
    ficticios = {"pepe"}
    datos["alumnos"] = [a for a in datos["alumnos"] if a["id"] not in ficticios]
    antes = len(datos["registros"])
    datos["registros"] = {k: r for k, r in datos["registros"].items()
                          if r["alumno"] not in ficticios}
    print(f"  quitado el alumno de prueba «pepe» "
          f"({antes - len(datos['registros'])} registros suyos)")
    print(f"  {len(datos['alumnos'])} alumnos, {len(datos['registros'])} registros, "
          f"claves de las semanas {sorted(datos['claves'])}")

    for archivo in sorted(data_dir.glob("clave-*.json")):
        clave = json.loads(archivo.read_text(encoding="utf-8"))
        k = id_clave(clave.get("unidad", 1), clave["semana"])
        if k in datos["claves"]:
            print(f"  {archivo.name}: la copia ya trae la clave {k} "
                  "(con sus anuladas); no se toca")
        else:
            datos["claves"][k] = clave
            print(f"  {archivo.name}: clave {k} añadida")

    salida = data_dir / "datos-iniciales.json"
    salida.write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Escrito {salida.relative_to(Path(__file__).parent)}")


if __name__ == "__main__":
    main()
