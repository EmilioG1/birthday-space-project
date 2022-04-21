import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import { ApiCall } from "./logic.js";

function errorFunction(element, response) {
  if (response instanceof Error) {
    $(element).text("");
    $(element).append(
      "<p class='error'>There was an error getting this data from api<p>"
    );
    return true;
  } else {
    return false;
  }
}
async function getSpaceImageOfDay(newDate) {
  const url = `https://api.nasa.gov/planetary/apod?date=${newDate}&api_key=${process.env.API_KEY}`;
  const response = await ApiCall.get(url);
  const isErrorPresent = errorFunction($("#image-of-day"), response);
  $("#response").removeClass("hidden");
  if (!isErrorPresent) {
    const imgUrl = response.url;
    const type = imgUrl.slice(-3);
    $("#date-image").removeClass("hidden");
    $("#date-video").removeClass("hidden");
    if (type === "jpg") {
      $("#date-image").attr("src", `${imgUrl}`);
      $("#date-video").addClass("hidden");
    } else {
      $("#date-video").attr("src", `${imgUrl}`);
      $("#date-image").addClass("hidden");
    }
  }
}
async function getRoverPhotos(date) {
  $("#mars-photos").removeClass("hidden");
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${process.env.API_KEY}`;
  const photoBlock = $("#photo-block");
  const response = await ApiCall.get(url);
  const isErrorPresent = errorFunction(photoBlock, response);
  if (!isErrorPresent) {
    for (let index = 0; index < 13; index += 5) {
      const imgUrl = response.photos[index].img_src;
      $(photoBlock).append(`<img src='${imgUrl}'>`);
    }
  }
}
async function getNewYorkTimesArticles(date) {
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.API_KEY2}&begin_date=${date}&end_date=${date}`;
  const response = await ApiCall.get(url);
  const articleBlock = $("#newspaper-articles");
  const isErrorPresent = errorFunction(articleBlock, response);
  $("#response2").removeClass("hidden");
  if (!isErrorPresent) {
    $(articleBlock).removeClass("hidden");
    $(articleBlock).text("");
    let index = 0;
    response.response.docs.forEach((doc) => {
      if (index < 3) {
        const link = `<div><a class='paper-cover' href='${doc.web_url}'></a></div>`;
        const article = `<div class='article'>${link}<div class='article-content'><h3>${doc.headline.main}</h3><p>${doc.lead_paragraph}</p></div></div>`;
        $(articleBlock).append(article);
      }
      index++;
    });
  }
}
async function getTop10Songs(date) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": `${process.env.API_KEY3}`,
    },
  };
  const url = `https://billboard-api2.p.rapidapi.com/hot-100?range=1-10&date=${date}`;
  $("#response3").removeClass("hidden");
  const response = await ApiCall.get(url, options);
  const songBlock = $("#songs");
  const isErrorPresent = errorFunction(songBlock, response);
  if (!isErrorPresent) {
    $(songBlock).text("");
    for (let i = 1; i < 10; i++) {
      const song = `<div class='song'><h3>${response.content[i].title}</h3><p>${response.content[i].artist}</p></div>`;
      $(songBlock).append(song);
    }
  }
}
$(document).ready(function () {
  $("#birthday").submit(async function (event) {
    event.preventDefault();
    const date = $("#date-input").val();
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    if (date > today) {
      $("#error-message").text(
        "The date you entered is invalid. Please enter a new date"
      );
    } else {
      $("#error-message").text("");
      const month = date.slice(5);
      const newDate = `2021-${month}`;
      $("#photo-block").text("");
      getSpaceImageOfDay(newDate);
      getRoverPhotos(newDate);
      getNewYorkTimesArticles(date);
      getTop10Songs(date);
    }
  });
});
