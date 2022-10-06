# Backend del proyecto de contratación - Capital Salud EPS

Para reconstruir los módulos de node se debe ejecutar el comando
---
npm install
---

## Archivo .env

Para garantizar el funcionamiento de la aplicación se debe crear un archivo con la extensión .env en la raiz de los documentos con la siguiente información:

Configuración de la base de datos
---
PORT=
HOST=
DATABASE=
USER=
PASSWORD=
---

Configuración del servidor del correo electrónico
---
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=
---

Configuración para la conexión con el directorio activo ldap
---
LDAP_USER=
LDAP_PASSWORD=
---

## Build de producción

Para realizar un build de distribución el usuario debe navegar hasta la carpeta donde se encuentra el proyecto y ejecutar el comando `npm run start`. Los archivos de ejecución están ubicados en la carpeta `dist/` y los documentos almacenados por el sistema estarán ubicados en la carpeta `public/`

## Documentos del sistema

Los documentos almacenados serán guardados en la carpeta `public/` los cuales no serán compartidos al realizar el commit