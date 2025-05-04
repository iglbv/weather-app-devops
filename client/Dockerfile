# Шаг сборки
FROM node:16-alpine as build

# Создаем рабочую директорию
WORKDIR /usr/src/app

# Копируем только package.json сначала
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Шаг производства
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]