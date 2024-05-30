FROM python:3.10.12

WORKDIR /app

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

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=server.py

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
