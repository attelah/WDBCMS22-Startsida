const API_URL = "https://cgi.arcada.fi/~lahepela/wdbcms22-projekt-1-hardtimez/api/widgets";
const TODO_URL = "https://cgi.arcada.fi/~lahepela/wdbcms22-projekt-1-hardtimez/api/todo"
const IP_URL = "https://cgi.arcada.fi/~kindstep/Startsida/wdbcms22-projekt-1-hardtimez/api/ip/";


//////////// WIDGET API WIDGET API WIDGET API ////////////

async function getWidgets() {
  const resp = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'x-api-key': localStorage.getItem("apiKey")
    }
  });

  const respData = await resp.json();
  if (respData['error'] == "403") {
    console.log("invalid api key");
    document.querySelector('#errorText').innerHTML = "Invalid API key";
    getIP();
    getTodo();
  } else {
    document.querySelector('#errorText').innerHTML = "";
    // run functions that require API key, get tokens from API
    getIP(respData['ip_token']);
    getTodo();
  }
}

function applyApi() {
  localStorage.setItem("apiKey", document.querySelector('#apiKey').value);
  getWidgets();
}
// Fyller i APIKEYN färdigt i fältet
if (localStorage.getItem("apiKey")) {
  document.querySelector('#apiKey').value = localStorage.getItem("apiKey");
}

///////////////// TODO API TODO API TODO API //////////////////

async function getTodo() {

  const resp = await fetch(TODO_URL, {
    method: 'GET',
    headers: {
      'x-api-key': localStorage.getItem("apiKey")
    }
  });
  const respData = await resp.json();
  if (respData['error'] == "403") {
    document.querySelector("#todoList").innerHTML = "";
    return;
  } else {

    // Visa todona
    for (todo of respData.todo) {


      document.querySelector("#todoList").innerHTML +=
        `<li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
  ${todo.title}
  <span class="badge bg-warning rounded-pill">${todo.category_name}</span>
  </div><div>
    <span class="badge bg-warning rounded-pill">checkmark here</span>
    </div>
  </li>
`;

    }
  }

}

///////////////////////////////////////////////////////////////

async function getIP(key) {
  if (!key) return document.querySelector("#ip").innerText = "";
  fetch("https://ipinfo.io/json?token=" + key).then(
    (response) => response.json()
  ).then(
    (jsonResponse) => document.querySelector("#ip").innerText = jsonResponse.ip + ("\n") + jsonResponse.country + (", ") + jsonResponse.city + "\n GPS Coordinates: " + jsonResponse.loc);

}


async function getJoke() {

  const Joke_URL = "https://v2.jokeapi.dev";
  const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
  const params = [
    "blacklistFlags=religious",
    "idRange=0-250"
  ];

  const xhr = new XMLHttpRequest();
  xhr.open("GET", Joke_URL + "/joke/" + categories.join(",") + "?" + params.join("&"));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status < 300) {
      var randomJoke = JSON.parse(xhr.responseText);

      if (randomJoke.type == "single") {
        document.querySelector("#joke").innerText = randomJoke.joke;

      } else {
        document.querySelector("#joke").innerText = randomJoke.setup;
        document.querySelector("#joke2").innerText = randomJoke.delivery;
      }
    } else if (xhr.readyState == 4) {
      document.querySelector("#joke").innerText = ("Error while requesting joke.\n\nStatus code: " + xhr.status + "\nServer response: " + xhr.responseText);
    }
  };

  xhr.send();
  //Källa: gjort enligt https://sv443.net/jokeapi/v2/#wrappers instruktioner, Gjort med XHR för att få apin till att funka.
}

async function getActivity() {
  const resp = await fetch("https://www.boredapi.com/api/activity/", {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await resp.json();

  document.querySelector("#activity").innerText = data.activity;
}

// TODO hide APIKEY sen när apikey databas skite funkar
async function getCat() {
  const resp = await fetch("https://api.thecatapi.com/v1/images/search", {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await resp.json();
  console.log(data[0].url);

  document.querySelector("#catApi").src = data[0].url;
}



// Event listeners & functions that don't require API key
getWidgets();
getJoke();
getActivity();
getCat();
document.getElementById("applyApi").addEventListener("click", applyApi);