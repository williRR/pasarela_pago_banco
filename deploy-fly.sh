#!/bin/bash

# Script de despliegue para Fly.io
# Uso: ./deploy-fly.sh

set -e

echo "🚀 Iniciando despliegue en Fly.io..."

# Verificar si flyctl está instalado
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl no está instalado. Instalando..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Verificar si el usuario está logueado
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Necesitas iniciar sesión en Fly.io..."
    flyctl auth login
fi

# Verificar si la app ya existe
if flyctl apps list | grep -q "pasarela-pago-banco"; then
    echo "📱 La aplicación ya existe, desplegando..."
    flyctl deploy
else
    echo "🆕 Creando nueva aplicación..."
    flyctl launch --no-deploy
    
    echo "🔧 Configurando variables de entorno..."
    echo "Por favor, configura las siguientes variables de entorno:"
    echo "flyctl secrets set DB_SERVER=tu_servidor.database.windows.net"
    echo "flyctl secrets set DB_DATABASE=tu_base_de_datos"
    echo "flyctl secrets set DB_USER=tu_usuario"
    echo "flyctl secrets set DB_PASSWORD=tu_password"
    echo "flyctl secrets set DB_PORT=1433"
    echo ""
    echo "Después ejecuta: flyctl deploy"
fi

echo "✅ Proceso completado!"
echo "🌐 Tu aplicación estará disponible en: https://pasarela-pago-banco.fly.dev"
