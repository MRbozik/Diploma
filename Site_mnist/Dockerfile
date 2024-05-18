# Используем официальный образ Python 3.12 в качестве базового
FROM python:3.12-slim

# Устанавливаем рабочий каталог в контейнере
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libopenjp2-7-dev \
    libwebp-dev \
    libfreetype6-dev \
    gcc \
    && apt-get clean

# Копируем requirements.txt в рабочий каталог
COPY requirements.txt .

# Обновляем pip
RUN pip install --upgrade pip

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем содержимое текущего каталога в рабочий каталог в контейнере
COPY . .

# Устанавливаем переменную окружения для Flask
ENV FLASK_APP=server.py

# Открываем порт для приложения Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["flask", "run", "--host=0.0.0.0"]