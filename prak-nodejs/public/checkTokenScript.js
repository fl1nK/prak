document.addEventListener("DOMContentLoaded", function () {
    const token = getCookie("token")
    const homeLink = document.querySelector('a[href="/home"]')
    const logoutLink = document.querySelector('a[href="/out"]')
    const registrationLink = document.querySelector('a[href="/registration"]')
    const loginLink = document.querySelector('a[href="/login"]')

    if (!token) {
        homeLink.style.display = "none"
        logoutLink.style.display = "none"
    } else {
        registrationLink.style.display = "none"
        loginLink.style.display = "none"
    }
})

// Функція для отримання значення куки за ім'ям
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) return parts.pop().split(";").shift()
}
