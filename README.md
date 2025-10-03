# Clonar el repositorio

```bash
git clone https://github.com/williRR/pasarela_pago_banco.git

cd tu-api

```
# instalar dependencias (Node.js)

```bash
npm install


```

# Configurar variables de entorno

## Crear un archivo .env en la raíz del proyecto.

## Copiar las variables de ejemplo desde .env 

```bash
PORT=3000
# Debe apuntar al nuevo endpoint de autorizacin: /api/transacciones/autorizar
BANK_API_URL=http://localhost:3001/api/transacciones
DB_USER=sa
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=Banco
```

# Ejecutar la API en modo desarrollo
```bash

npm run dev

```

