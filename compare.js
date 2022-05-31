let videoElmts = document.getElementsByClassName("tiktokDiv");
console.log(videoElmts);
let reports = document.getElementsByClassName("report");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let nextButton = document.getElementById("next");

getId();
async function getResult() {
  let result = await sendGetRequest("/getTwoVideos");
  console.log("result", result);

  return result;
}

async function getId() {
  let vid_id = await getResult();
  console.log("Video1: " + vid_id[0].rowIdNum);
  console.log("Video2: " + vid_id[1].rowIdNum);
  for (let i = 0; i < 2; i++) {


    addVideo(vid_id[i].url, videoElmts[i]);

  }
  loadTheVideos();
  for (let i = 0; i < 2; i++) {
    const MostRecentname = vid_id[i].nickname;
    let msg = reports[i].textContent;
    msg = msg.replace("caption", MostRecentname);
    reports[i].textContent = msg
  }
  let loved = 2;

  for (let i = 0; i < 2; i++) {
    let reload = reloadButtons[i];
    reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });
    heartButtons[i].classList.add("unloved");
    heartButtons[i].addEventListener("click", function() {
      console.log("Heart button clicked of video: " + i);

      loved = i;
      loved_heart(heartButtons[i]);
      if (i == 0) {
        unloved_heart(heartButtons[1]);
      }
      else {
        unloved_heart(heartButtons[0]);
      }

    });

  }



  nextButton.addEventListener("click", function() {
    buttonAction(loved);
  });

  function buttonAction(i) {
    console.log("next button clicked");
    console.log("vid id", vid_id);
    let videoData = {
      better: vid_id[i].rowIdNum,
      worse: vid_id[(i + 1) % 2].rowIdNum
    }
    console.log("videoData", videoData);
    let data = sendPostRequest('/insertPref', videoData)
      .then(function(data) {

        if (data == "continue") {
          setTimeout("location.reload(true);", 1500);
        }
        if (data == "pick winner") {
          window.location = "winner.html";
        }

      })
      .catch(function(error) {
        console.log("Error occurred:", error)
      });

  }


}


function loved_heart(heartButton) {
  heartButton.classList.remove("unloved");
  heartButton.firstElementChild.setAttribute("class", "fas fa-heart");

}

function unloved_heart(heartButton) {
  heartButton.classList.add("unloved");
  heartButton.firstElementChild.setAttribute("class", "far fa-heart");

}

