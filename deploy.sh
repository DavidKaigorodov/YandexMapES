#!/bin/bash

# Остановка и удаление существующих контейнеров
docker-compose down

# Сборка образов
docker-compose build

# Запуск контейнеров
docker-compose up -d
