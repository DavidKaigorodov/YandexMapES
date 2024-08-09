# Используем образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальную часть приложения
COPY . .

# Собираем приложение для продакшена
RUN npm install


# Экспонируем порт клиента
EXPOSE 3000

# Начинаем Nginx
CMD ["npm", "start"]
