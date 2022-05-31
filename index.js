'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}

function selectRandomVideos(max) {
  let firstVidInd = getRandomInt(8);
  let secondVidInd = getRandomInt(8);
  while (secondVidInd == firstVidInd) {
    secondVidInd = getRandomInt(8);
  }
  return [firstVidInd, secondVidInd];
}
/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {

    let winner = await win.computeWinner(8, false);

    let winnerInfo = await db.get("SELECT * FROM VideoTable WHERE rowIdNum = ?", [winner]);
    console.log("winner info", winnerInfo)
    res.json(winnerInfo);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get("/getTwoVideos", async function(req, res) {
  let video_sel = selectRandomVideos(8);
  let table = await db.all("SELECT * from VideoTable");
  console.log(table);
  let first_video = table[video_sel[0]];
  let second_video = table[video_sel[1]];
  res.send([first_video, second_video]);
});

app.post("/insertPref", async function(req, res) {

  let table1 = await db.all("SELECT * from PrefTable");
  console.log("indertPref", table1);
  await db.run("INSERT into PrefTable (better, worse) values (?, ?)", [req.body.better, req.body.worse]);
  let table = await db.all("SELECT * from PrefTable");
  console.log("indertPref", table);

  let num_video = await db.get("SELECT COUNT (*) FROM PrefTable", [])
  console.log(num_video['COUNT (*)']);
  if (num_video['COUNT (*)'] >= 15) {
    res.send("pick winner");
  }
  else {
    res.send("continue");
  }

});



// Page not found
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

