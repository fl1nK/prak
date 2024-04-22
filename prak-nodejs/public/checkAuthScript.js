const inputs = document.querySelectorAll("input")
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
    checkFields()
})

const emailInput = document.getElementById("email")

// Перевірка на помилки пароля при введенні
emailInput.addEventListener("input", function () {
    validateEmail(this.value)
    checkFields()
})

const emailCriteriaList = document.getElementById("emailCriteria")

function validateEmail(email) {
    // Регулярний вираз для перевірки електронної пошти
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const boolValidate = regex.test(email)

    if (boolValidate) {
        emailCriteriaList.style.display = "none"
        secondCheck = true
    } else {
        emailCriteriaList.style.display = "block"
        secondCheck = false
    }
}

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
        firstCheck = false
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

const formContainer = document.querySelector(".form-conteiner")
const switchConteiner = document.querySelector(".switch-conteiner")

// submitButton.addEventListener("click", function (event) {
//     formContainer.classList.toggle("hidden")
//     switchConteiner.classList.toggle("hidden")
//     event.preventDefault()
// })