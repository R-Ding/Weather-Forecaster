/**
 * A3: AJAX and fetch (Weather Forecaster)
 * CS 11 JS Winter 2021
 * Rachel Ding
 * Feb 20, 2021
 */

 (function() {
    "use strict";

    // API 1
    const ZIP_API_URL = "http://api.zippopotam.us/us/";
    // API 2, using API 1 results
    const WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather";
    const APPID = "4f8eedbdf6ed75959a5cfbd725e2420c";  

    window.addEventListener("load", init);

    /**
     * Sets up the page to request weather data when a user has entered a zip code
     * and clicks on the Get Weather! button.
     */
    function init() {
        let submitButton = id("weather");
        submitButton.addEventListener("submit", fetchLocationData);
    }

    /**
     * Handles the submit request, checking for valid (non-empty) input
     * for zipcode and then requesting location information for the given zipcode
     * to use in another fetch request for weather data to update the page with
     * information. 
     * 
     * If zipcode input is empty, displays an error message on the page and
     * hides any earlier results.
     * 
     * @param {Object} evt - submit event object to override default submit behavior 
     */
    function fetchLocationData(evt) {
        evt.preventDefault(); // prevent default submit behavior

        if (id("zipcode").value === "") {
          handleError('Please enter zipcode.');
        } else {
          let url = "http://api.zippopotam.us/us/";
          fetch(url + id("zipcode").value)
            .then(checkStatus)
            .then(response => response.json())
            .then(fetchWeatherData)
            .catch(err => handleError("No location data was found for the requested zip code."));
        }
    }

    /**
     * Uses the given data to fetch the current weather forecast with for a particular
     * city, state, and country abbreviation that were returned from the first Zippopotamus
     * API request when given a ZIP code.
     * 
     * @param {JSON} data - data from Zippopotamus API
     */
    function fetchWeatherData(data) {
        let firstMatch = data.places[0]; // example above only has one place, but there may be more; we only consider the first
        let url = WEATHER_API_URL;

        let city = firstMatch["place name"];
        let state = firstMatch["state"];
        let country = data["country abbreviation"];

        let urlStr = url + "?appid=" + APPID + "&units=imperial&q=" + city + "," + state + "," + country;

        fetch(urlStr)
          .then(checkStatus)
          .then(response => response.json())
          .then(processWeatherData)
          .catch(err => handleError("No weather data was found for the given location."));
    }

    /**
     * Uses the given data to fetch the current weather forecast with for a particular
     * city, state, and country abbreviation that were returned from the first Zippopotamus
     * API request when given a ZIP code.
     * 
     * @param {JSON} data - data from OpenWeather API
     */
    function processWeatherData(data) {
      let city = data.name
      id("location").textContent = city;

      let iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

      let weatherImg = document.createElement("img");
      weatherImg.src = iconUrl;
      if (id("icon").children.length !== 0) {
        let currImg = id("icon").children[0];
        id("icon").removeChild(currImg);
      }
      id("icon").appendChild(weatherImg); 
      weatherImg.alt = data.weather[0].main;

      let temp = data.main["temp"]
      id("temp").textContent = temp;

      let windspeed = data.wind["speed"]
      id("windspeed").textContent = windspeed + " mph";

      let dt = data.date;
      id("result-time").textContent = Date(dt); 

      id("results").classList.remove("hidden");     
      id("error").classList.add("hidden");
    }

    /* ------------------------------ Helper Functions ------------------------------ */
    /**
     * Helper function to return the response's result text if successful, otherwise
     * returns the rejected Promise result with an error status and corresponding text
     * @param {object} response - response to check for success/error
     * @returns {object} - Response if status code is ok (200-level)
     */
    function checkStatus(response) {
      if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
      }
      return response;
    }
    
    /**
     * Displays an error message on the page, hiding any previous results.
     * @param {string} errMsg - error message to display on page. 
     */
    function handleError(errMsg) {
        let errorP = id("error");
        errorP.textContent = errMsg;
        errorP.classList.remove("hidden");
        id("response").classList.remove("hidden");
        id("results").classList.add("hidden");
    }

    /**
     * Returns the element that has the ID attribute with the specified value.
     * @param {string} idName - element ID
     * @returns {object} DOM object associated with id.
     */
    function id(idName) {
        return document.getElementById(idName);
    }

    /**
     * Returns the first element that matches the given CSS selector.
     * @param {string} query - CSS query selector.
     * @returns {object[]} array of DOM objects matching the query.
     */
    function qs(query) {
        return document.querySelector(query);
    }

    /**
     * Returns the array of elements that match the given CSS selector.
     * @param {string} query - CSS query selector
     * @returns {object[]} array of DOM objects matching the query.
     */
    function qsa(query) {
        return document.querySelectorAll(query);
    }
})();
