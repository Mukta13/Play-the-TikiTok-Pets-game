// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click", function() {
  reloadVideo(tiktokDiv);
});

// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.
showWinningVideo()
async function getResult() {
  let result = await sendGetRequest("/getWinner");
  console.log("result", result);

  return result;
}


async function showWinningVideo() {
  let winner = await getResult();
  let winningUrl = winner.url;
  addVideo(winningUrl, divElmt);
  loadTheVideos();
  const MostRecentname = winner.nickname;
  let msg = report.textContent;
  msg = msg.replace("caption", MostRecentname);
  report.textContent = msg
}

