const IP_URL = "https://cgi.arcada.fi/~kindstep/Startsida/wdbcms22-projekt-1-hardtimez/api/ip/";

const Joke_URL = "https://v2.jokeapi.dev";
const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
const params = [
    "blacklistFlags=religious",
    "idRange=0-250"
];



function settings() {
    let apiKey = localStorage.apiKey;
    if (!apiKey) apiKey = prompt("Your api key", "No API key set");
    else apiKey = prompt("Your api key", apiKey);
    localStorage.setItem("apiKey", apiKey);
}

async function getIP() {
    fetch("https://ipinfo.io/json?token=$TOKEN").then(
        (response) => response.json()
      ).then(
        (jsonResponse) => document.querySelector("#ip").innerText = jsonResponse.ip + ("\n") + jsonResponse.country + (", ") +jsonResponse.city);
      
}



async function getJoke() {

    const xhr = new XMLHttpRequest();
    xhr.open("GET", Joke_URL + "/joke/" + categories.join(",") + "?" + params.join("&"));

    xhr.onreadystatechange = function() {
     if(xhr.readyState == 4 && xhr.status < 300) 
         {
             var randomJoke = JSON.parse(xhr.responseText);

        if(randomJoke.type == "single")
        {
            document.querySelector("#joke").innerText = randomJoke.joke; 
            
        }
        else
        {
            document.querySelector("#joke").innerText = randomJoke.setup; 
            document.querySelector("#joke2").innerText = randomJoke.delivery; 
        }
    }
    else if(xhr.readyState == 4)
    {
        document.querySelector("#joke").innerText = ("Error while requesting joke.\n\nStatus code: " + xhr.status + "\nServer response: " + xhr.responseText);
    }
};

xhr.send();
//Källa: gjort enligt https://sv443.net/jokeapi/v2/#wrappers instruktioner, Gjort med XHR för att få apin till att funka.
}

async function getActivity()
{
        const resp = await fetch( "https://www.boredapi.com/api/activity/", {
          headers: {
            Accept: "application/json",
          },
        });
            const data = await resp.json();

    document.querySelector("#activity").innerText = data.activity;
}

// TODO hide APIKEY sen när apikey databas skite funkar
async function getCat() {
  const resp = await fetch( "https://api.thecatapi.com/v1/images/search?api_key=22f8569d-b07f-4144-8e33-6fd2ca3af43a", {
    headers: {
      Accept: "application/json",
    },
  });
      const data = await resp.json();
      console.log(data[0].url);

document.querySelector("#catApi").src = data[0].url;
}



// Event listeners
getIP("ipinfo.io?token=$TOKEN");
getJoke();
getActivity();
getCat();

document.getElementById("settings").addEventListener("click", settings);







