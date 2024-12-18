async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("authToken", data.token);
    } else {
        document.getElementById("errorMessage").innerText = data.message;
    }
}

async function generateLicense() {
    const username = document.getElementById("username").value;
    const adminToken = localStorage.getItem("authToken");

    const response = await fetch("/api/generate-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, adminToken }),
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById("licenseMessage").innerText = `License Key: ${data.key}`;
    } else {
        document.getElementById("licenseMessage").innerText = data.message;
    }
}
