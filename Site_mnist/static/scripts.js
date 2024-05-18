let fileInputElement = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const analyzeButton = document.getElementById("analyze-button");
    fileInputElement = document.getElementById("image-upload");
    const uploadBox = document.getElementById("upload-box");
    const closeModal = document.getElementById("close-modal");
    const loadingElement = document.getElementById("loading");
    const resultModal = document.getElementById("result-modal");
    const resultSection = document.getElementById("result-section");

    console.log("Analyze button found:", analyzeButton);
    console.log("File input found:", fileInputElement);
    console.log("Upload box found:", uploadBox);
    console.log("Close modal button found:", closeModal);

    if (analyzeButton) {
        analyzeButton.addEventListener("click", function() {
            console.log("Analyze button clicked");
            analyzeImage();
        });
    } else {
        console.error("Analyze button not found in DOM");
    }

    if (fileInputElement) {
        fileInputElement.addEventListener("change", handleFileSelect);
    } else {
        console.error("File input not found in DOM");
    }

    if (uploadBox) {
        uploadBox.addEventListener("click", function() {
            console.log("Upload box clicked");
            if (fileInputElement) {
                fileInputElement.click();
            } else {
                console.error("File input element not found when clicking upload box");
            }
        });
    } else {
        console.error("Upload box not found in DOM");
    }

    if (closeModal) {
        closeModal.addEventListener("click", function() {
            resultModal.classList.add("hidden");
        });
    } else {
        console.error("Close modal button not found in DOM");
    }
});

function handleFileSelect(event) {
    console.log("handleFileSelect function called");
    const fileInput = fileInputElement;
    const uploadBox = document.querySelector(".upload-box");

    if (fileInput) {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                uploadBox.innerHTML = `<img src="${e.target.result}" alt="Завантажене зображення">`;
                console.log("File selected and displayed");
            };

            reader.readAsDataURL(file);
        } else {
            console.error("No file selected");
        }
    } else {
        console.error("File input element not found");
    }
}

function analyzeImage() {
    console.log("analyzeImage function called");
    const fileInput = fileInputElement;
    const loadingElement = document.getElementById("loading");
    const resultModal = document.getElementById("result-modal");
    const plantInfo = document.getElementById("plant-info");
    const resultSection = document.getElementById("result-section");

    console.log("File input during analyzeImage:", fileInput);

    if (!fileInput) {
        console.error("File input element not found");
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

    fetch("http://192.168.0.143:5000/analyze", {  // Обратите внимание на правильный IP-адрес
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

        console.log("Predicted class element before setting textContent:", predictedClassElement);
        console.log("Disease probability element before setting textContent:", diseaseProbabilityElement);

        if (predictedClassElement && diseaseProbabilityElement) {
            predictedClassElement.textContent = `Передбачений клас: ${data.predicted_class} (${data.predicted_class_index})`;
            diseaseProbabilityElement.textContent = `Ймовірність хвороби: ${(data.disease_probability * 100).toFixed(2)}%`;
            console.log("Updated predicted class and disease probability elements textContent.");
        } else {
            console.error("Predicted class or disease probability element not found in DOM");
        }

        resultSection.classList.remove("hidden");
    })
    .catch(error => {
        loadingElement.classList.add("hidden");
        plantInfo.innerHTML = `<p>Помилка під час аналізу: ${error.message}</p>`;
        console.error("Error during analysis:", error);
        resultModal.classList.remove("hidden");
    });
}
