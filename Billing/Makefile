ifneq (,$(wildcard ./.env))
    include .env
    export
endif

no-command:
	@echo Usage: make [scenario]

# Генерируем модели по схеме
models:
	sequelize-auto --caseModel p --lang es6 --singularize 1 -h ${MYSQL_HOST} -d ${MYSQL_DB} -u ${MYSQL_USER} -x ${MYSQL_PASSWORD} -p ${MYSQL_PORT}  --dialect mysql -o ./src/models -t `echo ${MYSQL_TABLES}`
