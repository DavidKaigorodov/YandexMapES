# Используем базовый образ Node.js
FROM node:16

# Создаем рабочую директорию внутри контейнера
WORKDIR /server

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы в рабочую директорию
COPY . .

# Указываем порт, который будет прослушивать приложение
EXPOSE 5000

# Определяем команду для запуска приложения
CMD ["node", "index.js"]
