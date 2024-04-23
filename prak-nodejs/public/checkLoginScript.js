const inputs = document.querySelectorAll("input")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const passwordCriteriaList = document.getElementById("passwordCriteria")
const passwordMatchError = document.getElementById("passwordMatchError")
const submitButton = document.getElementById("submitButton")

var firstCheck = false
var secondCheck = false

submitButton.disabled = true

// Перевірка полів на наявність значення
inputs.forEach((input) => {
    const label = input.parentElement.querySelector("label")

    input.addEventListener("input", function () {
        checkInputs()
        if (this.value.trim() !== "") {
            label.classList.remove("hidden")
        } else {
            label.classList.add("hidden")
        }
    })
})

// Функція для перевірки полів введення
function checkInputs() {
    // Перевіряємо, чи не є обидва поля порожніми
    if (emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
        submitButton.disabled = false // Увімкнути кнопку
    } else {
        submitButton.disabled = true // Вимкнути кнопку
    }
}

// Зміна типу поля паролю та відображення / приховування іконки ока
const eyeIcons = document.querySelectorAll(".eye-icon")

eyeIcons.forEach(function (icon) {
    const useElement = icon.querySelector("use")
    const inputField = icon.previousElementSibling

    icon.addEventListener("click", function () {
        if (useElement.getAttribute("href") === "#icon-eye-blind") {
            useElement.setAttribute("href", "#icon-eye")
        } else {
            useElement.setAttribute("href", "#icon-eye-blind")
        }

        const newType =
            inputField.getAttribute("type") === "password" ? "text" : "password"
        inputField.setAttribute("type", newType)
    })
})

//POST Запрос з форми
const messageServer = document.querySelector(".message-server")

document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
        event.preventDefault()

        const formData = new FormData(this)

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (data.error) {
                    messageServer.textContent = data.error
                    messageServer.classList.add("red")
                    messageServer.classList.remove("green")
                } else if (data.message) {
                    messageServer.textContent = data.message
                    messageServer.classList.remove("red")
                    messageServer.classList.add("green")
                    window.location.href = "/home"
                }
            })
            .catch((error) => {
                console.error("Помилка: ", error)
            })
    })
