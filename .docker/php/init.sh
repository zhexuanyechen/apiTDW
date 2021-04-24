#!/bin/bash

cd /home/wwwroot/aos
/usr/local/bin/composer update --no-interaction --ignore-platform-reqs
./bin/doctrine -q dbal:run-sql "CREATE SCHEMA IF NOT EXISTS ${MYSQL_TEST_DATABASE}"
./bin/phpunit -c phpunit.xml.docker --coverage-text
