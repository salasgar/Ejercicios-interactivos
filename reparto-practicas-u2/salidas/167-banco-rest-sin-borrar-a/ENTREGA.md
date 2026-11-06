# Entrega de la tarea 167 · El banco REST no borra los datos de la cuenta de prueba A

Sesión `s-20261106T144118-da7eb318` · commit `356addc` · fichero único: `herramientas/probar-reglas.mjs`.

## Qué hace ahora
- Antes de la primera escritura en el espacio de A (justo después de comprobar las altas) lee los tres documentos que el banco sobrescribe: `privado/nombres`, `config/tareas` y el documento del espacio. Si alguno da algo que no sea 200 o 404, aborta sin escribir nada.
- Guarda esa copia en memoria y en un fichero 0600 de la carpeta temporal del sistema (nunca en el repositorio); se borra solo si la restauración sale bien.
- Al final (bloque `finally` de nivel superior, también si una prueba lanza una excepción, y manejador de SIGINT/SIGTERM para Ctrl-C) restaura: lo que existía vuelve con sus campos exactos (PATCH sin máscara, que reemplaza el documento); lo que no existía se borra. Después lo vuelve a leer y compara el contenido (claves ordenadas; el `updateTime` no se compara). Salen filas ✓/✗ en la sección «Restauración de los datos de A» y cuentan para el código de salida.
- Se quitan de la limpieza las tres filas que borraban nombres, tareas y espacio.
- `--dejar` también restaura esos tres documentos (decisión mía: son los únicos con datos reales; el resto de lo de prueba, ZZ…, sí se deja).
- `--seco`: sin variables de entorno no hace ninguna petición y dice qué documentos tocaría; con ellas lee (solo lee) los tres y cuenta qué hay (existe o no, nombres de campo, tamaño), sin imprimir contenido ni uids.
- B: no se toca ningún documento de B (solo escribe códigos ZZ… inventados, que borra él).

## Cómo se probó
- `node --check` y `node herramientas/probar-reglas.mjs --seco` en verde (salida 0, sin contraseñas, sin red).
- Con un Firestore REST simulado en memoria (fuera del repo): A con `config/tareas` y `privado/nombres` reales y sin documento de espacio. Tras el banco, los dos primeros quedan idénticos y el espacio queda inexistente (404), incluso con una excepción a mitad de ejecución (el simulador no tiene reglas, así que el banco falló en una lectura y salió por la rama de error: justo el caso que debía cubrirse). No quedan copias en la carpeta temporal.
- `npm test`: falla en ficheros ajenos con reclamo vivo (fraccion-de/suma-resta, tareas 103/104/163); este fichero no lo cubre ningún test.

## Pendiente, con Juan Luis delante (paso 3 de la ficha; NO hecho)
La ejecución real contra la nube no se ha hecho. Comando (contraseñas con `read -s`, nada en el historial):
```
cd /Users/salasgar/Documents/git/Ejercicios-interactivos
read -r "PROFE_A_EMAIL?Correo de A: "; read -rs "PROFE_A_CLAVE?Contraseña de A: "; echo
read -r "PROFE_B_EMAIL?Correo de B: "; read -rs "PROFE_B_CLAVE?Contraseña de B: "; echo
export PROFE_A_EMAIL PROFE_A_CLAVE PROFE_B_EMAIL PROFE_B_CLAVE
node herramientas/probar-reglas.mjs --seco     # antes: qué tiene A hoy en sus tres documentos
node herramientas/probar-reglas.mjs            # la ejecución de verdad
node herramientas/probar-reglas.mjs --seco     # después: la misma lista
```
(`read` de zsh.) Los dos `--seco` tienen que decir lo mismo.

## Hallazgos para Juan Luis
1. **A sigue sin tareas por el borrado del 5-11** (`config/tareas` de A dio 404): no se reconstruyen de memoria. Los códigos de prueba 62 y 63 siguen sin tareas hasta que se vuelvan a montar en el panel (antes del lun 14-12).
2. Si la ejecución real encuentra que alguno de los tres documentos de A no se puede reescribir con las reglas (p. ej. una forma antigua que ya no pasa), el banco lo dice en la fila de restauración y deja la copia en la carpeta temporal.
