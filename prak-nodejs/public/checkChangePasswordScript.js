const inputs = document.querySelectorAll("input")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")
const passwordCriteriaList = document.getElementById("passwordCriteria")
const passwordMatchError = document.getElementById("passwordMatchError")
const submitButton = document.getElementById("submitButton")
const label = confirmPasswordInput.parentElement.querySelector("label")

var firstCheck = false
var secondCheck = false

submitButton.disabled = true

// Перевірка полів на наявність значення
inputs.forEach((input) => {
    const label = input.parentElement.querySelector("label")

    input.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            label.classList.remove("hidden")
        } else {
            label.classList.add("hidden")
        }
    })
})

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

// Перевірка на помилки пароля при введенні
passwordInput.addEventListener("input", function () {
    validatePassword(this.value)
    checkSamePasswords()
    checkFields()
})

// Перевірка на помилки підтвердження пароля при введенні
confirmPasswordInput.addEventListener("input", function () {
    checkSamePasswords()
    checkFields()
})

// Функція для перевірки вимог до пароля
function validatePassword(password) {
    const criteria = [
        password.length >= 8,
        /[A-ZА-ЯІЇЄҐ]/.test(password), // Перевірка на великі українські букви
        /[a-zа-яіїєґ]/.test(password), // Перевірка на малі українські букви
        /\d/.test(password), // Перевірка на наявність цифр
        /[!@#$%^&*()_+]/.test(password), // Перевірка на наявність спеціальних символів
    ]

    criteria.forEach((criterion, index) => {
        const listItem = passwordCriteriaList.children[index]
        if (criterion) {
            listItem.style.color = "#000000"
        } else {
            listItem.style.color = "#e73027"
        }
    })

    if (criteria.every((criterion) => criterion) || password.length == 0) {
        passwordCriteriaList.style.display = "none"
        if (password.length != 0) {
            firstCheck = true
        }
    } else {
        passwordCriteriaList.style.display = "block"
    }
}

// Функція для перевірки чи однакові паролі
function checkSamePasswords() {
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (password == confirmPassword || confirmPassword == 0) {
        passwordMatchError.style.display = "none"
        confirmPasswordInput.classList.remove("bred")
        label.classList.remove("red")
        confirmPasswordInput.style.borderColor = ""

        if (confirmPassword.length != 0) {
            secondCheck = true
        }
    } else {
        passwordMatchError.style.display = "block"
        confirmPasswordInput.classList.add("bred")
        label.classList.add("red")
        confirmPasswordInput.style.borderColor = "red"
        secondCheck = false
    }
}

// Функція для перевірки стану полів і активації / деактивації кнопки
function checkFields() {
    // console.log("firstCheck = " + firstCheck)
    // console.log("secondCheck = " + secondCheck)

    if (firstCheck && secondCheck) {
        submitButton.disabled = false
    } else {
        submitButton.disabled = true
    }
}

const formContainer = document.querySelector(".form-container")
const switchConteiner = document.querySelector(".switch-container")
const messageServer = document.querySelector(".message-server")
document
    .getElementById("change-password-form")
    .addEventListener("submit", function (event) {
        event.preventDefault()

        const formData = new FormData(this)

        fetch("/changePassword", {
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

                    formContainer.classList.toggle("hidden")
                    switchConteiner.classList.toggle("hidden")

                    setTimeout(function () {
                        window.location.href = "/home"
                    }, 5000)
                }
            })
            .catch((error) => {
                console.error("Помилка: ", error)
            })
    })
