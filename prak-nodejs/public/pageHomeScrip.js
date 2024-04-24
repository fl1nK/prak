document.addEventListener("DOMContentLoaded", function () {
    const token = decodeURIComponent(getCookie("username"))
    const mainHeader = document.getElementById("main-header")

    if (token)
        mainHeader.textContent = `Вітаємо ${token} на головній сторінці ;)`
})

// Функція для отримання значення куки за ім'ям
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) return parts.pop().split(";").shift()
}
