from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

# Загрузка модели
model_path = "mnist_model.h5"  # Убедитесь, что файл модели находится в этом пути
if not os.path.exists(model_path):
    raise RuntimeError("Model file not found")
model = tf.keras.models.load_model(model_path)

# Определение корневого маршрута
@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze_image():
    try:
        # Получение изображения из запроса
        image_file = request.files.get("image")
        if not image_file:
            return jsonify({"error": "Image not provided"}), 400

        # Чтение и подготовка изображения
        image = Image.open(io.BytesIO(image_file.read())).convert('L')
        image = image.resize((28, 28))  # Изменить размер в соответствии с моделью MNIST
        image_array = np.array(image) / 255.0  # Нормализация
        image_array = np.expand_dims(image_array, axis=0)  # Добавление измерения

        # Предсказание с помощью модели
        predictions = model.predict(image_array)
        predicted_class_index = np.argmax(predictions)
        predicted_probability = float(predictions[0][predicted_class_index])

        # Ответ с предсказанным классом и вероятностью
        result = {
            "predicted_class_index": int(predicted_class_index),
            "predicted_class": str(predicted_class_index),  # добавляем строковое представление класса
            "disease_probability": predicted_probability
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
