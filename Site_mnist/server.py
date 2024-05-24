import io
import os

import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешить все источники

# Загрузка модели
model_path = "Model_2_16_1.keras"  # Убедитесь, что файл модели находится в этом пути
if not os.path.exists(model_path):
    raise RuntimeError("Model file not found")
model = tf.keras.models.load_model(model_path)

# Определение классов заболеваний растений (замените на ваши реальные классы)
class_names = ['Apple___Apple_scab',
               'Apple___Black_rot',
               'Apple___Cedar_apple_rust',
               'Apple___healthy',
               'Background_without_leaves',
               'Blueberry___healthy',
               'Cherry___Powdery_mildew',
               'Cherry___healthy',
               'Corn___Cercospora_leaf_spot Gray_leaf_spot',
               'Corn___Common_rust',
               'Corn___Northern_Leaf_Blight',
               'Corn___healthy',
               'Grape___Black_rot',
               'Grape___Esca_(Black_Measles)',
               'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
               'Grape___healthy',
               'Orange___Haunglongbing_(Citrus_greening)',
               'Peach___Bacterial_spot',
               'Peach___healthy',
               'Pepper,_bell___Bacterial_spot',
               'Pepper,_bell___healthy',
               'Potato___Early_blight',
               'Potato___Late_blight',
               'Potato___healthy',
               'Raspberry___healthy',
               'Soybean___healthy',
               'Squash___Powdery_mildew',
               'Strawberry___Leaf_scorch',
               'Strawberry___healthy',
               'Tomato___Bacterial_spot',
               'Tomato___Early_blight',
               'Tomato___Late_blight',
               'Tomato___Leaf_Mold',
               'Tomato___Septoria_leaf_spot',
               'Tomato___Spider_mites Two-spotted_spider_mite',
               'Tomato___Target_Spot',
               'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
               'Tomato___Tomato_mosaic_virus',
               'Tomato___healthy']  # Замените на реальные классы вашей модели


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
        image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        image = image.resize((224, 224))  # Изменить размер в соответствии с вашей моделью
        image_array = np.array(image) / 255.0  # Нормализация
        image_array = np.expand_dims(image_array, axis=0)  # Добавление измерения

        # Предсказание с помощью модели
        predictions = model.predict(image_array)
        predicted_class_index = np.argmax(predictions)
        predicted_probability = float(predictions[0][predicted_class_index])

        # Ответ с предсказанным классом и вероятностью
        result = {
            "predicted_class_index": int(predicted_class_index),
            "predicted_class": class_names[predicted_class_index],  # добавляем строковое представление класса
            "disease_probability": predicted_probability
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
