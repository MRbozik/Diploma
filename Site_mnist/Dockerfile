# Використовуємо офіційний образ Python як базовий
FROM python:3.10.12

# Встановлюємо робочу директорію
WORKDIR /app

# Встановлюємо системні залежності для обробки зображень
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    zlib1g-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libopenjp2-7-dev \
    libwebp-dev \
    libfreetype6-dev \
    gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Копіюємо файл вимог
COPY requirements.txt .

# Оновлюємо pip і встановлюємо Python-залежності
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо весь проект в робочу директорію
COPY . .

# Встановлюємо змінну оточення для Flask
ENV FLASK_APP=server.py

# Відкриваємо порт 5000 для Flask
EXPOSE 5000

# Команда для запуску Flask
CMD ["flask", "run", "--host=0.0.0.0"]
