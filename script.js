// Отримуємо всі елементи input відповідно до їх типу
const inputs = document.querySelectorAll("input")

// Перебираємо кожен елемент input і додаємо до нього прослуховувач події введення
inputs.forEach((input) => {
    const label = input.parentElement.querySelector("label")

    input.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            label.classList.remove("hidden") // Видалити клас "hidden", якщо введено значення
        } else {
            label.classList.add("hidden") // Додати клас "hidden", якщо значення видалено
        }
    })
})

// Отримуємо елементи ока
const eyeIcons = document.querySelectorAll(".eye-icon")

// Перебираємо кожен елемент ока і додаємо прослуховувач події кліку
eyeIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
        // Отримуємо поле вводу, пов'язане з цією іконкою
        const inputField = this.previousElementSibling

        // Змінюємо тип поля вводу з "password" на "text" або навпаки
        const newType =
            inputField.getAttribute("type") === "password" ? "text" : "password"
        inputField.setAttribute("type", newType)

        // Отримуємо елемент .line, пов'язаний з цим полем вводу
        const line = this.querySelector(".line")

        // Видаляємо або додаємо клас "hidden" в залежності від наявності класу
        if (line.classList.contains("hidden")) {
            line.classList.remove("hidden")
        } else {
            line.classList.add("hidden")
        }
    })
})

const passwordInput = document.getElementById("password")
const passwordCriteriaList = document.getElementById("passwordCriteria")

var firstCheck = false

passwordInput.addEventListener("input", function () {
    const password = this.value
    const criteria = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*()_+]/.test(password),
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
        firstCheck = true
    } else {
        passwordCriteriaList.style.display = "block"
    }
})

const confirmPasswordInput = document.getElementById("confirmPassword")
const passwordMatchError = document.getElementById("passwordMatchError")
const submitButton = document.getElementById("submitButton")
var secondCheck = false
// Disable the button on initial page load
submitButton.disabled = true

confirmPasswordInput.addEventListener("input", function () {
    const label = confirmPasswordInput.parentElement.querySelector("label")

    const password = passwordInput.value
    const confirmPassword = this.value

    if (password == confirmPassword || confirmPassword.length == 0) {
        passwordMatchError.style.display = "none"
        confirmPasswordInput.classList.remove("bred")
        label.classList.remove("red")
        this.style.borderColor = ""
        secondCheck = true
    } else {
        passwordMatchError.style.display = "block"
        confirmPasswordInput.classList.add("bred")
        label.classList.add("red")
        this.style.borderColor = "red"
        secondCheck = false
    }

    if (firstCheck && secondCheck) {
        submitButton.disabled = false
        submitButton.classList.add("button-enabled")
    } else {
        submitButton.disabled = true
        submitButton.classList.remove("button-enabled")
    }
})

submitButton.addEventListener("click", function (event) {
    alert("Enabled!")
})
