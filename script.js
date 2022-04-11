

function settings() {
    let apiKey = localStorage.apiKey;
    if (!apiKey) apiKey = prompt("Your api key", "No API key set");
    else apiKey = prompt("Your api key", apiKey);
    localStorage.setItem("apiKey", apiKey);
}



// Event listeners
document.getElementById("settings").addEventListener("click", settings);