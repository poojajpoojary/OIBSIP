// ---------- SHA-256 Password Hash ----------

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(byte =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}


// ---------- REGISTER ----------

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();

        const email = document.getElementById("email").value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");


        message.classList.remove("success");
        message.textContent = "";


        // Empty validation

        if (!username || !email || !password || !confirmPassword) {

            message.textContent = "Please fill all fields.";

            return;

        }


        // Password length

        if (password.length < 8) {

            message.textContent = "Password must be at least 8 characters.";

            return;

        }


        // Must contain one number

        if (!/\d/.test(password)) {

            message.textContent = "Password must contain at least one number.";

            return;

        }


        // Password match

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";

            return;

        }


        // Existing users

        const users = JSON.parse(localStorage.getItem("users")) || [];


        const exists = users.find(user =>
            user.username === username ||
            user.email === email
        );

        if (exists) {

            message.textContent =
                "Username or Email already exists.";

            return;

        }


        // Hash Password

        const hashedPassword = await hashPassword(password);


        users.push({

            username,

            email,

            password: hashedPassword

        });


        localStorage.setItem("users", JSON.stringify(users));


        message.classList.add("success");

        message.textContent =
            "Registration successful! Redirecting...";


        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    });

}





// ---------- LOGIN ----------

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        message.textContent = "";
        message.classList.remove("success");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const hashedPassword = await hashPassword(password);

        const user = users.find(
            u => u.email === email && u.password === hashedPassword
        );

        if (!user) {

            message.textContent = "Invalid email or password.";

            return;

        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        message.classList.add("success");
        message.textContent = "Login successful! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1000);

    });

}





// ---------- DASHBOARD ----------

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

if (welcomeMessage) {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        welcomeMessage.textContent =
            `Welcome, ${loggedInUser.username}!`;

    }

}

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });

}