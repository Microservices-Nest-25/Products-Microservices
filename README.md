<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## Dev

1. Clonar repositorio
2. Instalar dependencias
3. Clonar .env.template y renombrar a .env, completar variables de entorno
4. Ejecutar migraciones de prisma
```
npx prisma migrate env
```
5. Ejecutar el proyecto
```
npm run start:dev
o
yarn start:dev
```