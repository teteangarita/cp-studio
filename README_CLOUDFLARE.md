# Despliegue y sincronización con Cloudflare

Este documento explica cómo publicar y mantener sincronizada la documentación del proyecto en Cloudflare Pages, y cómo purgar la caché tras cambios.

Requisitos previos
- Cuenta en GitHub (u otro SCM soportado por Cloudflare Pages)
- Cuenta en Cloudflare
- Token de API de Cloudflare con permiso para `Zone.Zone` y `Zone.Cache Purge` (o `Zone.Zone` y `Cache Purge` según tu política)

Flujo recomendado (Cloudflare Pages)

1) Inicializa repositorio Git local y sube a GitHub

```bash
cd /ruta/a/tu/proyecto
git init
git add .
git commit -m "Site inicial"
# crea repo en GitHub y empuja (ejemplo para main)
git branch -M main
git remote add origin git@github.com:TU_USUARIO/TU_REPO.git
git push -u origin main
```

2) Crea un proyecto en Cloudflare Pages
- Entra a Cloudflare Dashboard > Pages > Create a project
- Conecta tu cuenta de GitHub y selecciona el repositorio
- Build settings: como este proyecto es estático sin compilación, deja `Build command` vacío y `Build output directory` en `/` (o deja los valores por defecto si no aplica)
- Selecciona la rama `main` y crea el proyecto

3) Configura dominio y DNS (opcional)
- En Pages > Custom domains, añade tu dominio (ej. `docs.tudominio.com`) y sigue las instrucciones para crear el registro CNAME apuntando a `your-project.pages.dev`.
- En el apartado de DNS (Cloudflare DNS), añade el CNAME o A según indique Pages.

4) Ajustes recomendados en Cloudflare (Dashboard > SSL/TLS y Speed)
- SSL/TLS > Edge Certificates: activa `Always Use HTTPS`
- Speed > Brotli: activar Brotli
- Caching > Configuration: Cache Level `Standard` o `Aggressive` según necesidades
- Page Rules: (opcional) crea una regla para `/assets/*` o `/*.css` para cachear por más tiempo si tu flujo de despliegue purga caché al publicar.

Purgar caché automáticamente

Puedes purgar la caché por API después de un despliegue. Crea un `API token` en Cloudflare con permisos `Zone.Zone` y `Zone.Cache Purge`.

Script de ejemplo (usa variables de entorno):

```bash
#!/usr/bin/env bash
set -e
if [ -z "$CF_ZONE_ID" ] || [ -z "$CF_API_TOKEN" ]; then
  echo "Por favor exporta CF_ZONE_ID y CF_API_TOKEN"
  echo "export CF_ZONE_ID=xxxx"
  echo "export CF_API_TOKEN=xxxx"
  exit 1
fi

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}' | tee /dev/stderr

# Exit code will be 0 si la API respondió; revisa la salida para confirmar success: true
```

Guardalo como `scripts/purge_cache.sh`, hazlo ejecutable (`chmod +x scripts/purge_cache.sh`) y ejecútalo tras cada despliegue.

Despliegue manual (alternativa)
- Si no deseas usar Git, puedes subir un ZIP con los archivos al panel de Pages o usar una integración CI que haga `git push`.

Verificación
- Tras desplegar, abre `https://<tu-proyecto>.pages.dev` o tu dominio personalizado.
- Si ves versiones antiguas, ejecuta el script de purga o usa el botón `Purge Cache` en el Dashboard > Caching.

Notas finales
- Mantén consistencia en `og:*` y meta tags entre `index.html` y `brandbook.html` (ya sincronizados).
- Si necesitas, puedo preparar un workflow de GitHub Actions que automáticamente purgue la caché tras `push` a `main`.
 
GitHub Actions: purgar caché automáticamente
-----------------------------------------

He incluido un workflow de ejemplo en `.github/workflows/pages-purge.yml` que se ejecuta en cada `push` a la rama `main`. El workflow espera 30 segundos y ejecuta la purga de caché de Cloudflare usando la API.

Configura estos secretos en tu repositorio de GitHub (Repository > Settings > Secrets & variables > Actions > New repository secret):

- `CF_API_TOKEN` — Token de Cloudflare con permiso `Zone.Cache Purge`.
- `CF_ZONE_ID` — ID de la zona DNS donde está tu dominio (lo encuentras en Cloudflare Dashboard > Overview > Zone ID).

Notas sobre el workflow:
- Cloudflare Pages realiza el despliegue automáticamente cuando conectas el repositorio a Pages; este workflow solo purga la caché para asegurarse de que los cambios se sirvan inmediatamente.
- Si tu proyecto necesita un build step, el workflow actual asume que Pages hace el build. Podemos adaptar el workflow para realizar el build y desplegar usando la API si prefieres no conectar Pages directamente.

Ejecutar manualmente desde tu máquina (alternativa)
------------------------------------------------
Si prefieres no usar GitHub Actions, tras hacer `git push` puedes ejecutar localmente el script de purga:

```bash
export CF_ZONE_ID=xxxx
export CF_API_TOKEN=xxxx
./scripts/purge_cache.sh
```

Si quieres, configuro el workflow para esperar hasta que el despliegue de Pages esté `ready` usando la API de Pages, y luego purgar solo los recursos necesarios en vez de `purge_everything`.
