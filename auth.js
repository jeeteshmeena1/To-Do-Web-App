/* ==========================================
   TO-DO APP AUTHENTICATION
========================================== */

// Redirect if already logged in
if (
    localStorage.getItem("loggedInUser") &&
    window.location.pathname.includes("login.html")
) {
    window.location.href = "index.html";
}

// ================================
// SIGNUP
// ================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document
            .getElementById("signupUsername")
            .value
            .trim();

        const email = document
            .getElementById("signupEmail")
            .value
            .trim();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        // Validation

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        if (password.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(user =>
            user.email === email
        );

        if (exists) {

            alert("Email already registered.");

            return;

        }

        const newUser = {

            username,
            email,
            password

        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    });

}

// ================================
// LOGIN
// ================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document
            .getElementById("loginUsername")
            .value
            .trim();

        const password = document
            .getElementById("loginPassword")
            .value;

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u =>

            u.username === username &&
            u.password === password

        );

        if (!user) {

            alert("Invalid Username or Password");

            return;

        }

        localStorage.setItem(

            "loggedInUser",

            JSON.stringify(user)

        );

        alert("Login Successful");

        window.location.href = "index.html";

    });

}

// ================================
// PROTECT DASHBOARD
// ================================

if (
    window.location.pathname.includes("index.html")
) {

    const loggedIn =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedIn) {

        window.location.href = "login.html";

    } else {

        const userName =
            document.getElementById("username");

        if (userName) {

            userName.textContent =
                loggedIn.username;

        }

    }

}

// ================================
// LOGOUT
// ================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        if (
            confirm("Are you sure you want to logout?")
        ) {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

        }

    });

}