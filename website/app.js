/* Global Variables */
// let data2save = {};
//`${API_URL}/data/2.5/weather?zip=${ZIP}&units=imperial&appid=${APP_ID}`
// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
const base_url = "https://api.openweathermap.org/"; //zip=${user_zip},ca&units=metric&appid=${api_key}`;
let user_zip = "";
const api_key = "8ab2628f3b9e331bc037af30aa920fad";

let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

//GET weather data
async function getWeather(a_base_url, a_zip, an_api_key) {
  //validate zip
  if (!Number.isInteger(parseInt(a_zip))) {
    alert("Enter a valid ZIP code");
  }
  try {
    let request_url =
      a_base_url +
      "data/2.5/weather?zip=" +
      a_zip +
      ",US" +
      "&units=metric&appid=" +
      an_api_key;
    const response = await fetch(request_url);
    console.log("getWeather: response from fetch request \n", response);

    const weather_data = await response.json();
    console.log("getWeather: weather data \n", weather_data);

    let data2save = {
      temperature: weather_data.main.temp,
      date: newDate,
      // user_response: "get user input"
    };
    console.log("getWeather: data2save \n", data2save);
    return data2save;
  } catch (error) {
    console.log("getWeather: error\n", error);
  }
}

//POST async function to post data to server
async function postData(url, data = {}) {
  try {
    data = {
      temperature: data.temperature,
      date: newDate,
      user_response: document.getElementById("feelings").value,
    };
    console.log("postData: data \n", data);
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const serverData = await response.json();
    console.log("postData : data posted to server and response received");
    console.log("postData : data on server... \n", serverData);

    // Not using serverData, making a seperate get request in updateDOM() to get server data
    return serverData;
  } catch (error) {
    console.log("error", error);
  }
}

//get data from server and then update DOM
async function updateDOM() {
  const last_temp = document.getElementById("temp");
  const last_date = document.getElementById("date");
  const last_content = document.getElementById("content");

  const response = await fetch("/getData");

  try {
    const allData = await response.json();
    console.log("updateDOM, allData", allData);

    //get last entry, which will be displayed
    const lastEntry = allData[Object.keys(allData).length - 1];
    console.log("updateDOM: lastEntry", lastEntry);

    let object_values = Object.values(lastEntry);

    last_date.innerHTML = `<p>Date: ${object_values[1]}</p>`;
    last_temp.innerHTML = `<p>Temperature: ${object_values[0]}<span>&#176;</span>C</p>`;
    last_content.innerHTML = `<p>Notes: ${object_values[2]}</p>`;
  } catch (error) {
    console.log(error);
  }
}

document
  .getElementById("generate")
  .addEventListener("click", userInputGetPostUpdate);

async function userInputGetPostUpdate() {
  console.log("click event registered");
  user_zip = document.getElementById("zip").value;

  getWeather(base_url, user_zip, api_key).then(function (data2save) {
    postData("/postData", data2save).then(function () {
      updateDOM();
    });
  });
}
