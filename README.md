# Backend del proyecto de contratación - Capital Salud EPS

Para reconstruir los módulos de node se debe ejecutar el comando `npm install`

## Archivo .env

Para garantizar el funcionamiento de la aplicación se debe crear un archivo con la extensión .env en la raiz de los documentos con la siguiente información:

Configuración de la base de datos
```sh
PORT=
HOST=
DATABASE=
USER=
PASSWORD=
```

Configuración del servidor del correo electrónico
```sh
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=
```

Configuración para la conexión con el directorio activo ldap
```sh
LDAP_USER=
LDAP_PASSWORD=
```

## Build de producción

Para realizar un build de distribución el usuario debe navegar hasta la carpeta donde se encuentra el proyecto y ejecutar el comando `npm run start`. Los archivos de ejecución están ubicados en la carpeta `dist/` y los documentos almacenados por el sistema estarán ubicados en la carpeta `public/`. Para ver el resultado de la ejecución navegar a la ruta `http://localhost:4202/`.

## Build angular

El commit incluye el build de producción del frontend creado en [Angular CLI](https://github.com/angular/angular-cli) version 9.0.1. para descargar el código del front acceder al repositorio de [Capital](https://github.com/santiagogo2/capital)

## Documentos del sistema

Los documentos almacenados serán guardados en la carpeta `uploads/` los cuales no serán compartidos al realizar el commit
Si no existe en el repositorio debe ser creada la carpeta `uploads/contratacion` para almacenar la información de los documentos cargados por el servidor
