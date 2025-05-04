FROM node:16-alpine

# Создаем рабочую директорию
WORKDIR /usr/src/app

# 1. Копируем ТОЛЬКО файлы зависимостей
COPY server/package.json .
COPY server/package-lock.json .

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем остальные файлы сервера
COPY server/ .

# 4. Копируем SSL-сертификат
COPY postgresql/root.crt /root/.postgresql/root.crt

# Настройки окружения
ENV PORT=5000
ENV DB_CONNECTION_STRING=${DB_CONNECTION_STRING} 
ENV PG_SSL_CA=/root/.postgresql/root.crt

EXPOSE 5000
CMD ["npm", "start"]