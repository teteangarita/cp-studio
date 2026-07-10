#!/usr/bin/env bash
set -e

if [ -z "$CF_ZONE_ID" ] || [ -z "$CF_API_TOKEN" ]; then
  echo "Por favor exporta CF_ZONE_ID y CF_API_TOKEN"
  echo "export CF_ZONE_ID=xxxx"
  echo "export CF_API_TOKEN=xxxx"
  exit 1
fi

resp=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

echo "$resp" | jq || echo "$resp"

# Devuelve 0 siempre, revisa la respuesta JSON para confirmar success: true
