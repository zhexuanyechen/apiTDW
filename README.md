![logo UPM](https://raw.githubusercontent.com/laracabrera/AOS/master/tarea1/logo_upm.jpg)  TDW: REST API - Anales de la Ciencia
======================================

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Minimum PHP Version](https://img.shields.io/badge/php-%5E8.0-blue.svg)](http://php.net/)
[![Build Status](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/build.png?b=master&s=f78545ddddef6aed3696ab7470c1d48421cee9d1)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/quality-score.png?b=master&s=ced26a14a5730e2f1b084a9b32db4472b672b60b)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/coverage.png?b=master&s=342159ea031ef8672005fb2ccb05b3f1a91f0af1)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/?branch=master)
> 馃幆Implementaci贸n de una API REST para la gesti贸n aportaciones a la Ciencia

Este proyecto implementa una interfaz de programaci贸n [REST][rest] desarrollada sobre
el framework [Slim][slim]. La aplicaci贸n proporcionar谩 las operaciones
habituales para la gesti贸n de Productos, Entidades y Personas.

Para hacer m谩s sencilla la gesti贸n de los datos se ha utilizado
el ORM [Doctrine][doctrine]. Doctrine 2 es un Object-Relational Mapper que proporciona
persistencia transparente para objetos PHP. Utiliza el patr贸n [Data Mapper][dataMapper]
con el objetivo de obtener un desacoplamiento completo entre la l贸gica de negocio y la
persistencia de los datos en los sistemas de gesti贸n de bases de datos.

Para su configuraci贸n, este proyecto se apoya en el componente [Dotenv][dotenv], que
permite realizar la configuraci贸n a trav茅s de variables de entorno. De esta manera,
cualquier configuraci贸n que pueda variar entre diferentes entornos (desarrollo, pre-producci贸n, producci贸n, ...) puede ser establecida
a trav茅s de variables de entorno, tal como se aconseja en la metodolog铆a [鈥淭he twelve-factor app鈥漖[12factor] 鉁旓笍.

Por otra parte se incluye parcialmente la especificaci贸n de la API (OpenAPI 3.0). Esta
especificaci贸n se ha elaborado empleando el editor [Swagger][swagger]. Adicionalmente 
tambi茅n se incluye la interfaz de usuario (SwaggerUI) de esta fenomenal herramienta que permite
realizar pruebas interactivas de manera completa y elegante. La especificaci贸n entregada
define las operaciones sobre usuarios del sistema y `Productos`, por lo que queda por implementar las 
operaciones relativas a la gesti贸n de `Entidades` y `Personas`.

## 鈿橧nstalaci贸n del proyecto锔?

El primer paso consiste en generar un esquema de base de datos vac铆o y un usuario/contrase帽a
con privilegios completos sobre dicho esquema.

Despu茅s se deber谩 crear una copia del fichero `./.env` y renombrarla
como `./.env.local`. Despu茅s se debe editar dicho fichero y modificar las variables `DATABASE_NAME`,
`DATABASE_USER` y `DATABASE_PASSWD` con los valores generados en el paso anterior (el resto de opciones
pueden quedar como comentarios). Una vez editado el anterior fichero y desde el directorio ra铆z del
proyecto se deben ejecutar los comandos:
```
> composer update
> bin/doctrine orm:schema:update --dump-sql --force
```
Para verificar la validez de la informaci贸n de mapeo y la sincronizaci贸n con la base de datos:
```
> bin/doctrine orm:validate
```

## 馃梽锔廍structura del proyecto

A continuaci贸n se describe el contenido y estructura m谩s destacado del proyecto:

* Directorio `bin`:
    - Ejecutables (*doctrine*, *phpunit*, ...)
* Directorio `config`:
    - `config/cli-config.php`: configuraci贸n de la consola de comandos de Doctrine,
      configuraci贸n de la aplicaci贸n, asociaci贸n entre rutas y controladores, etc.
* Directorio `src`:
    - Subdirectorio `src/Entity`: entidades PHP (incluyen anotaciones de mapeo del ORM)
    - Subdirectorio `src/Controller`: controladores PHP (implementan los _endpoints_ de la API)
    - Subdirectorio `src/scripts`: scripts de ejemplo
* Directorio `public`:
    - Ra铆z de documentos del servidor web
    - `public/index.php`: controlador frontal
    - `public/api-docs`: especificaci贸n de la API (Swagger-UI)
    - `public/demoAjax`: ejemplo b谩sico acceso a la API (login)
* Directorio `tests`:
    - Pruebas unitarias y funcionales de la API
* Directorio `vendor`:
    - Componentes desarrollados por terceros (Doctrine, DotENV, Slim, etc.)

## 馃殌Puesta en marcha de la aplicaci贸n

Para acceder a la aplicaci贸n utilizando el servidor interno del int茅rprete
de PHP se ejecutar谩 el comando:

```
> php -S 127.0.0.1:8000 -t public
```

Una vez hecho esto, la aplicaci贸n estar谩 disponible en [http://127.0.0.1:8000/][lh].

## 馃洜锔廍jecuci贸n de pruebas

La aplicaci贸n incorpora un conjunto completo de herramientas para la ejecuci贸n de pruebas 
unitarias y de integraci贸n con [PHPUnit][phpunit]. Empleando este conjunto de herramientas
es posible comprobar de manera autom谩tica el correcto funcionamiento de la API completa
sin la necesidad de herramientas adicionales.

Para configurar el entorno de pruebas se debe crear un nuevo esquema de bases de datos vac铆o,
y una copia del fichero `./phpunit.xml.dist` y renombrarla como `./phpunit.xml`.
Despu茅s se debe editar este 煤ltimo fichero para asignar los siguientes par谩metros:
                                                                            
* Configuraci贸n (l铆neas 15-17) del acceso a la nueva base de datos (`DATABASE_NAME`, `DATABASE_USER`
y `DATABASE_PASSWD`)
* Si se desea (l铆neas 21-23), se pueden modificar el nombre y contrase帽a de los usuarios que se van
a emplear para realizar las pruebas (no es necesario insertarlos, lo hace autom谩ticamente
el m茅todo `setUpBeforeClass()` de la clase `BaseTestCase`)

Para lanzar la suite de pruebas completa se debe ejecutar:
```
> bin/phpunit [--testdox] [--coverage-text] [-v]
```

Adicionalmente, para comprobar la calidad de las pruebas, el proyecto incluye test de mutaciones
generados con la herramienta [Infection][infection].
El funcionamiento es simple: se generan peque帽os cambios en el c贸digo original (_mutantes_), y a continuaci贸n
se ejecuta la bater铆a de pruebas. Si las pruebas fallan, indica que han sido capaces de detectar la modificaci贸n
del c贸digo, y el mutante es eliminado. Si pasa las pruebas, el mutante sobrevive y la fiabilidad de la prueba
queda cuestionada.

Para lanzar los test de mutaciones se ejecutar谩:
```
> composer infection
```

[dataMapper]: http://martinfowler.com/eaaCatalog/dataMapper.html
[doctrine]: http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/
[dotenv]: https://packagist.org/packages/vlucas/phpdotenv
[infection]: https://infection.github.io/guide/
[jwt]: https://jwt.io/
[lh]: http://127.0.0.1:8000/
[monolog]: https://github.com/Seldaek/monolog
[openapi]: https://www.openapis.org/
[phpunit]: http://phpunit.de/manual/current/en/index.html
[rest]: http://www.restapitutorial.com/
[slim]: https://www.slimframework.com/ 
[swagger]: http://swagger.io/
[yaml]: https://yaml.org/
[12factor]: https://www.12factor.net/es/