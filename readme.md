# knex ejemplo CRUD Stickers
###### Siguieno el video: *https://www.youtube.com/watch?v=xFsaRVNLtxI&list=PLM_i0obccy3uwR6ZYa7QE03xDRAqs4Aso&index=1*
### Instalación dependencias knex y postgresql
```npm install --save knex pg``` 

### Crear aplicación express

### Inicializar proyecto knex
Para inicializar el proyecto se ejecuta el comando: **knex init**, esto generará el archivo **knexfile.js**, en este archivo deberá configurarse los datos de conexión a la base de datos, algo similar al siguiente fragmento:

```
// Update with your config settings.

module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'knex-crud',
            user: 'postgres',
            password: 'Imix2019*'
        },
    },

    production: {
        client: 'pg',
        connection: {
            database: 'knex-crud',
            user: 'postgres',
            password: 'Imix2019*'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
```

### ERD

Con **knex** se creará una estructura similar a la siguiente: 

![](https://www.lucidchart.com/publicSegments/view/462daa21-76a1-4f7f-a2fc-43f78e866962/image.png)

### Comando: knex migrate:make create-sticker
Este comando generará un archivo js con el formato **yyyyMMddhhmmss_name.js**, para este caso **20190221152616_create-sticker.js**
Este archivo se crea con el código básico para migración, en los cuales se deben describir las acciones a realizar. Para este caso
se crea el archivo con la finalidad de crear una tabla.

**Código básico después de ejecutar el comando knex migrate:make create-sticker**
```
exports.up = function(knex, Promise) {

};

exports.down = function(knex, Promise) {

};
```

El siguiente es el código después de describir lo que se desea actualizar:

```
exports.up = function(knex, Promise) {
    return knex.schema.createTable('sticker', (table) => {
        table.increments();
        table.text('tittle');
        table.text('description');
        table.float('rating');
        table.text('url');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('sticker');
};
```

Después de salvar los cambios, es hora de ejecutar la migración y ver los resultados en el motor de la base de datos.

### Para migrar las configuraciones se necesita ejecutar el comando: knex migrate:latest

Esto crea físicamente en la base de datos 3 tablas

1. sticker: Esta tabla se creó a partir de la descripción que se encuentra en el archivo **20190221152616_create-sticker.js** en el cual se especificó para subida la creación de la tabla sticker.

2. knex_migrations: Esta tabla la crea **knex** y la utiliza para registrar el control de las migraciones **up** 
3. knex_migrations_lock: Esta tabla la crea **knex** y la utiliza para registrar **?**

### Ahora vamos a registrar datos en la tabla stickers

Para ello vamos a utilizar un archivo **JSON** que se encuentra en la carpeta **data** con la siguiente información:

```
module.exports = [{
        title: "Javascript",
        description: "JS logo",
        rating: 10,
        url: "https://devstickers.com/assets/img/pro/i4eg.png"
    },
    {
        title: "Angular",
        description: "Angular logo",
        rating: 10,
        url: "https://devstickers.com/assets/img/cat/angular2.png"
    },
    {
        title: "NodeJS",
        description: "NodeJS logo",
        rating: 10,
        url: "https://devstickers.com/assets/img/cat/nodejs.png"
    }
]
```

Luego se crea un script **seeds\01_sticker.js** para la insertar valores a la tabla sticker, para ello se le especifica el script que primero limpie la tabla y después ingrese los registros que se encuentran en el archivo **data\stickers.js**

```
const stickers = require("../data/stickers");

exports.seed = function(knex, Promise) {
    return knex('sticker').del()
        .then(function() {
            return knex('sticker').insert(stickers);
        });
}
``` 

Luego se ejecuta el comando **knex seed:run**, si todo sale bien se observará un mensaje muy similar al siguiente:
```
Using environment: development
Ran 1 seed files 
```

Y la tabla **sticker**, de la base de datos **knex-crud** deberá tener los registros configurados en el archivo **JSON** llamado **data\stickers.js**

## Convertir ExpressAPP a JSON API

1. Quitar del archivo **app.js** la sección de código: 
```
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```
2. Quitar referencia al directorio **public** en el archivo **app.js** y luego la carpeta **public**
```
app.use(express.static(path.join(__dirname, 'public')));
```
3. Quitar referencias a la carpeta **routes** y después el directorio
```
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ...

app.use('/', indexRouter);
app.use('/users', usersRouter);
```

4. Luego en el archivo **app.js** en la sección ```//render the error page```

Original: 
```
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
```

Modificar el código de la siguiente forma: 
```
// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {} 
    });
});
```

## Agregar el directorio 'api' e implementar router

1. Desinstalaremos **jade**
```
npm uninstall jade
removed 42 packages and audited 1180 packages in 3.294s
found 0 vulnerabilities
```
2. Creamos el directorio **api** y dentro de el el archivo **stickers.js**

```
/* jshint esversion:6 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: '☑'
    });
});

module.exports = router;
```
3. Listar todos los registros con metodo **GET** 

- Modificar el archivo **app.js**

```
/* jshint esversion:6 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const stickers = require('./api/stickers');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/stickers', stickers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
```
- Ejecutamos en la terminal el comando **npm install nodemon --save-dev** y modificamos el archivo **package.json**
```
    "name": "knexjs-crud",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "start": "node ./bin/www",
        "dev": "nodemon"
    },
```
- Ejecutamos el comando **npm run dev** y realizamos una prueba en el navegador comprobando que al ejecutar **http://localhost** debería salir el mensaje: 
```
message	"Not Found"
error	
status	404
```
Por el contrario cuando se ejecute en el navegador la ruta: **http://localhost:3000/api/v1/stickers** el mensaje que debería presentar es: 
```
message	"☑"
```
npm run dev

