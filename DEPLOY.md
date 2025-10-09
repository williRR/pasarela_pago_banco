# Despliegue en Fly.io

Esta guía te ayudará a desplegar tu API de pasarela de pagos en Fly.io.

## Prerrequisitos

- Cuenta en [Fly.io](https://fly.io)
- Base de datos Azure SQL Server configurada

## Pasos para el despliegue

### 1. Instalar Fly CLI (si no lo tienes)

```bash
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"
```

### 2. Iniciar sesión en Fly.io

```bash
flyctl auth login
```

### 3. Usar el script automatizado

```bash
./deploy-fly.sh
```

### 4. Configurar variables de entorno

```bash
flyctl secrets set DB_SERVER=tu_servidor.database.windows.net
flyctl secrets set DB_DATABASE=tu_base_de_datos  
flyctl secrets set DB_USER=tu_usuario
flyctl secrets set DB_PASSWORD=tu_password
flyctl secrets set DB_PORT=1433
```

### 5. Desplegar la aplicación

```bash
flyctl deploy
```

## Comandos útiles

### Ver logs en tiempo real
```bash
flyctl logs
```

### Verificar el estado de la aplicación
```bash
flyctl status
```

### Abrir la aplicación en el navegador
```bash
flyctl open
```

### Configurar variables de entorno adicionales
```bash
flyctl secrets set VARIABLE_NAME=valor
```

### Ver variables de entorno configuradas
```bash
flyctl secrets list
```

## Endpoints disponibles

- **Health Check**: `https://tu-app.fly.dev/health`
- **API Principal**: `https://tu-app.fly.dev/api/payments`
- **Documentación**: `https://tu-app.fly.dev/`

## Configuración de Azure SQL Server

Asegúrate de agregar las IPs de Fly.io a tu Azure SQL Server:

1. Ve a Azure Portal
2. Navega a tu SQL Server
3. Ve a "Networking" > "Firewalls and virtual networks"
4. Agrega esta regla:
   - **Nombre**: Fly-io-access
   - **IP inicial**: 0.0.0.0
   - **IP final**: 255.255.255.255

> **Nota**: Para producción, es recomendable usar rangos de IP más específicos.

## Troubleshooting

### Error de conexión a la base de datos
1. Verifica que las variables de entorno estén configuradas correctamente
2. Asegúrate de que Azure SQL Server permita conexiones externas
3. Revisa los logs con `flyctl logs`

### Error de build
1. Verifica que el Dockerfile esté correcto
2. Asegúrate de que todas las dependencias estén en package.json
3. Revisa el archivo .dockerignore

### App no responde
1. Verifica que el puerto 4000 esté configurado en fly.toml
2. Asegúrate de que el health check esté funcionando
3. Revisa los logs para errores específicos
