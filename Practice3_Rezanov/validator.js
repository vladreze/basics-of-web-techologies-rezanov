/*Правила:

Довжина ≥ 8 символів.
Хоча б одна велика літера (A-Z).
Хоча б одна мала літера (a-z).
Хоча б одна цифра (0-9).
Хоча б один спеціальний символ (!@#$%^&*).
Не містить пробіли.
Не співпадає з типовими «слабкими» паролями зі списку: ["password", "12345678", "qwerty", "admin"] (case-insensitive). */

function validatePassword(password) {

const errorsArray = [];

const weakPassword = ["password" , "12345678", "qwerty", "admin"];

    if (password.length < 8) {
        errorsArray.push("Password must be at least 8 characters long.");
    }
    if(!/[A-Z]/.test(password)) {
        errorsArray.push("Password must contain at least one uppercase letter.");
    }
    if(!/[a-z]/.test(password)) {
        errorsArray.push("Password must contain at least one lowercase letter.");
    }
    if(!/[0-9]/.test(password)) {
        errorsArray.push("Password must contain at least one digit.");
    }
    if(!/[!@#$%^&*]/.test(password)){
        errorsArray.push("Password must contain at least one specific character.");
    }
    if(weakPassword.some(weak => password.toLowerCase().includes(weak))){
        errorsArray.push("Password must not contain 'weak' passwords such as  'password', '12345678', 'qwerty', 'admin'");
    }
    if(/\s/.test(password)){
        errorsArray.push("Password must not contain spaces.");
    }

    return{
         valid: errorsArray.length === 0,
         errors: errorsArray
    }
}

