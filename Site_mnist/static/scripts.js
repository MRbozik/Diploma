let fileInputElement = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM повністю завантажений і розібраний");

    const analyzeButton = document.getElementById("analyze-button");
    fileInputElement = document.getElementById("image-upload");
    const uploadBox = document.getElementById("upload-box");
    const closeModal = document.getElementById("close-modal");
    const loadingElement = document.getElementById("loading");
    const resultModal = document.getElementById("result-modal");
    const resultSection = document.getElementById("result-section");

    console.log("Кнопка аналізу знайдена:", analyzeButton);
    console.log("Вхідний елемент для файлів знайдений:", fileInputElement);
    console.log("Блок завантаження знайдений:", uploadBox);
    console.log("Кнопка закриття модального вікна знайдена:", closeModal);

    // Додавання обробника подій для кнопки аналізу
    if (analyzeButton) {
        analyzeButton.addEventListener("click", function() {
            console.log("Кнопка аналізу натиснута");
            analyzeImage();
        });
    } else {
        console.error("Кнопка аналізу не знайдена в DOM");
    }

    // Додавання обробника подій для вибору файлу
    if (fileInputElement) {
        fileInputElement.addEventListener("change", handleFileSelect);
    } else {
        console.error("Вхідний елемент для файлів не знайдений в DOM");
    }

    // Додавання обробника подій для кліку на блок завантаження
    if (uploadBox) {
        uploadBox.addEventListener("click", function() {
            console.log("Блок завантаження натиснутий");
            if (fileInputElement) {
                fileInputElement.click();
            } else {
                console.error("Вхідний елемент для файлів не знайдений при кліку на блок завантаження");
            }
        });
    } else {
        console.error("Блок завантаження не знайдений в DOM");
    }

    // Додавання обробника подій для кнопки закриття модального вікна
    if (closeModal) {
        closeModal.addEventListener("click", function() {
            resultModal.classList.add("hidden");
        });
    } else {
        console.error("Кнопка закриття модального вікна не знайдена в DOM");
    }
});

function handleFileSelect(event) {
    console.log("Функція handleFileSelect викликана");
    const fileInput = fileInputElement;
    const uploadBox = document.querySelector(".upload-box");

    if (fileInput) {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            // Обробка події завантаження файлу
            reader.onload = function(e) {
                uploadBox.innerHTML = `<img src="${e.target.result}" alt="Завантажене зображення">`;
                console.log("Файл вибрано і відображено");
            };

            reader.readAsDataURL(file);
        } else {
            console.error("Файл не вибрано");
        }
    } else {
        console.error("Вхідний елемент для файлів не знайдений");
    }
}

function analyzeImage() {
    console.log("Функція analyzeImage викликана");
    const fileInput = fileInputElement;
    const loadingElement = document.getElementById("loading");
    const resultModal = document.getElementById("result-modal");
    const plantInfo = document.getElementById("plant-info");
    const resultSection = document.getElementById("result-section");

    console.log("Вхідний елемент для файлів під час analyzeImage:", fileInput);

    if (!fileInput) {
        console.error("Вхідний елемент для файлів не знайдений");
        return;
    }

    if (fileInput.files.length === 0) {
        alert("Будь ласка, завантажте фотографію.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    loadingElement.classList.remove("hidden");

    // Відправка зображення на сервер для аналізу
    fetch("http://192.168.0.143:5000/analyze", {  // Переконайтеся, що IP-адреса правильна
        method: "POST",
        body: formData
    })
    .then(response => {
        loadingElement.classList.add("hidden");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Дані від сервера:", data);

        const predictedClassElement = document.getElementById("predicted-class");
        const diseaseProbabilityElement = document.getElementById("disease-probability");

        console.log("Елемент передбаченого класу перед встановленням textContent:", predictedClassElement);
        console.log("Елемент ймовірності захворювання перед встановленням textContent:", diseaseProbabilityElement);

        if (predictedClassElement && diseaseProbabilityElement) {
            const predictedClass = data.predicted_class.split('___'); // Розділення класу на дві частини
            const plantType = predictedClass[0]; // Тип рослини
            const disease = predictedClass[1]; // Хвороба

            predictedClassElement.textContent = `Клас: ${plantType}\nХвороба: ${disease} (${data.predicted_class_index})`;
            diseaseProbabilityElement.textContent = `Ймовірність хвороби: ${(data.disease_probability * 100).toFixed(2)}%`;
            console.log("Оновлено textContent елементів передбаченого класу та ймовірності захворювання.");
        } else {
            console.error("Елемент передбаченого класу або ймовірності захворювання не знайдений в DOM");
        }

        resultSection.classList.remove("hidden");
    })
    .catch(error => {
        loadingElement.classList.add("hidden");
        plantInfo.innerHTML = `<p>Помилка під час аналізу: ${error.message}</p>`;
        console.error("Помилка під час аналізу:", error);
        resultModal.classList.remove("hidden");
    });
}
