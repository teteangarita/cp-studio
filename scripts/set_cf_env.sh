#!/usr/bin/env bash
# Rellenar con tus valores reales y ejecutar con: source scripts/set_cf_env.sh
# ADVERTENCIA: no subas este archivo con valores reales a un repo público.

export CF_API_TOKEN="REPLACE_WITH_YOUR_CF_API_TOKEN"
export CF_ACCOUNT_ID="REPLACE_WITH_YOUR_CF_ACCOUNT_ID"
export CF_PROJECT_NAME="REPLACE_WITH_YOUR_CF_PROJECT_NAME"
export CF_ZONE_ID="REPLACE_WITH_YOUR_CF_ZONE_ID"

echo "Variables de entorno Cloudflare cargadas en el shell actual (si usaste 'source')."
echo "Asegúrate de añadir estos valores como Secrets en GitHub Actions en lugar de dejarlos en archivos."