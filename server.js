// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const app = express();
/* Middleware*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());

//Here we are configuring express to use body-parser as middle-ware.
//deprecated: https://expressjs.com/en/changelog/4x.html#4.16.0
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 8080;
//for deploying app: process.env.PORT
const server = app.listen(process.env.PORT || port, listening);
function listening() {
  console.log(`my server running on localhost: ${port}`);
}

// GET route
app.get("/getData", sendData);

function sendData(req, resp) {
  //options: res.send(), res.json(), res.end()
  console.log("sendData: incoming get request is", req.body);
  console.log("sendData response is \n", projectData);

  //When the parameter is an Array or Object, Express responds with the JSON representation
  resp.send(projectData);
}

//POST route
app.post("/postData", addData);

function addData(req, resp) {
  console.log("addData,  BEFORE post new data \n", projectData);
  console.log("addData, incoming post request \n", req.body);

  let idx_projectData = Object.keys(projectData).length;
  projectData[idx_projectData] = {
    temperature: req.body.temperature,
    date: req.body.date,
    user_response: req.body.user_response,
  };

  console.log("addMathFact,  projectData  AFTER post new data", projectData);

  resp.send(projectData);
}
