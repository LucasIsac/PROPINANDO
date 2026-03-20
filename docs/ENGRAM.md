# Engram Automation - PROPINANDO

Sistema de memoria persistente para el framework Tony Stark.

## Quick Start

### 1. Configuración Inicial

```bash
# Clonar el repositorio
git clone https://github.com/LucasIsac/PROPINANDO.git
cd PROPINANDO

# Crear carpeta de memoria
mkdir memory
```

### 2. Instalar Engram (Windows)

1. Descargar `engram.exe` desde https://github.com/anomalyco/engram
2. Mover a: `C:\Users\<TU_USUARIO>\dev\tools\engram\engram.exe`
3. Crear la carpeta si no existe

### 3. Crear Script Helper

Crear `engram-save.ps1` en la raíz del proyecto:

```powershell
param (
    [Parameter(Mandatory=$true)] [string]$Name,
    [Parameter(Mandatory=$true)] [string]$Message
)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:ENGRAM_DATA_DIR = Join-Path $projectRoot "memory"
$engramPath = "C:\Users\<TU_USUARIO>\dev\tools\engram\engram.exe"
& $engramPath save $Name $Message --project "propinando"
```

> **Nota:** Cambiar `<TU_USUARIO>` por tu nombre de usuario de Windows.

### 4. Agregar npm script (package.json raíz)

```json
{
  "scripts": {
    "engram": "powershell -ExecutionPolicy Bypass -File engram-save.ps1"
  }
}
```

## Uso

### Guardar un Hito

```bash
npm run engram -- "Hito: Nombre" "Descripción del aprendizaje técnico"
```

### Bootstrap de Sesión

Al iniciar una nueva sesión de desarrollo:

```bash
npm run engram -- "Session Start" "Nueva sesión iniciada"
```

## Integración con AGENTS.md

El protocolo de memoria está integrado en el workflow SDD:

```
Spec aprobada → Engineer implementa → Guardian approves → 
→ npm run engram -- "Hito: X" "..." → Engram guarda
```

Ver `AGENTS.md` sección 7 (Workflow Determinista) y sección 13 (Cierre Engram).

## Estructura

```
PROPINANDO/
├── engram-save.ps1      # Script helper (NO incluir en git)
├── memory/
│   └── engram.db        # Base de datos SQLite (NO incluir en git)
```

## Troubleshooting

### Error: "data directory must be an absolute path"

El script usa ruta absoluta automáticamente. Si falla, verificar:

```powershell
# Verificar que memory/ existe
Test-Path memory

# Verificar que engram.exe existe
Test-Path "C:\Users\<TU_USUARIO>\dev\tools\engram\engram.exe"
```

### Error: "pwsh not recognized"

Windows PowerShell no tiene `pwsh`. El script usa `powershell` por defecto.

Si PowerShell Core está instalado:
```powershell
# Cambiar en engram-save.ps1 línea 8:
powershell -File ... → pwsh -File ...
```

### Verificar que funciona

```bash
npm run engram -- "Test" "Verificación de conexión"
```

Debería responder: `Memory saved: #X "Test" (manual)`

## Cambiar Ruta de Engram

Para usar una ruta diferente, editar `engram-save.ps1` línea 7:

```powershell
$engramPath = "C:\Users\<TU_USUARIO>\dev\tools\engram\engram.exe"
```

## Cambiar Nombre del Proyecto

Para usar con otro proyecto, cambiar `--project "propinando"` a:

```powershell
& $engramPath save $Name $Message --project "tu-proyecto"
```

## Desactivar Automáticamente

Para desactivar la integración, comentar/eliminar en `AGENTS.md`:

```markdown
<!-- 7. Persistencia Obligatoria: Ejecutar npm run engram -- "Hito" "Mensaje". -->
```
