const IP_URL = "https://cgi.arcada.fi/~kindstep/Startsida/wdbcms22-projekt-1-hardtimez/api/ip/";

const Joke_URL = "https://v2.jokeapi.dev";
const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
const params = [
    "blacklistFlags=religious",
    "idRange=0-150"
];



function settings() {
    let apiKey = localStorage.apiKey;
    if (!apiKey) apiKey = prompt("Your api key", "No API key set");
    else apiKey = prompt("Your api key", apiKey);
    localStorage.setItem("apiKey", apiKey);
}

async function getIP() {
    // Kalla på vår php-IP-API med fetch()
    const resp = await fetch(IP_URL);
    // Ta emot response och omvandla till json
    const respBody = await resp.json();

    document.querySelector("#ip").innerText = respBody.ip; 
}



async function getJoke() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", Joke_URL + "/joke/" + categories.join(",") + "?" + params.join("&"));

    xhr.onreadystatechange = function() {
     if(xhr.readyState == 4 && xhr.status < 300) // readyState 4 means request has finished + we only want to parse the joke if the request was successful (status code lower than 300)
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
//Källa: https://sv443.net/jokeapi/v2/#wrappers, för att få apin till att funka
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
getIP();
getJoke();
getActivity();
getCat();

document.getElementById("settings").addEventListener("click", settings);







