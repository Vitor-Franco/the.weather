const apiWeatherKey = "e08d69d7980d4bc2b9f175312200610";
const apiPhotosKey = "563492ad6f91700001000001fce07ebe53ce4e65bf72e49e71e93932";
const inputOfCity = document.querySelector("[data-js='input']");
const formOfCity = document.querySelector("[data-js='form']");
const arrayBackupItems = new Array();
const weatherCitiesStorage = document.querySelector('[data-js="bckp-cities"]');

const getImageOfCity = (city) => {
  const apiImageCity = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
  const response = fetch(apiImageCity, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "563492ad6f91700001000001fce07ebe53ce4e65bf72e49e71e93932",
    },
  })
    .then((response) => response.json())
    .then((json) => json.photos[0].src.landscape);
  return response;
};

const getWeatherCity = (city) => {
  const apiWeatherDayOrWeek = `http://api.weatherapi.com/v1/forecast.json?key=${apiWeatherKey}&q=${city}&days=1`;
  const response = fetch(apiWeatherDayOrWeek).then((resp) => resp.json());
  return response;
};

const changeImageBackground = async (city) => {
  const backgroudImageContent = document.querySelector(
    "[data-js='img-background']"
  );
  const imageCityBackground = await getImageOfCity(city);
  backgroudImageContent.style.backgroundImage = `url('${imageCityBackground}')`;
};

const changeInfoWeather = async (city) => {
  const { location, current } = await getWeatherCity(city);

  const cloudy = document.querySelector("[data-js='cloudy']"),
    humidity = document.querySelector("[data-js='humidity']"),
    wind = document.querySelector("[data-js='wind']"),
    feelsLike = document.querySelector("[data-js='feelsLike']"),
    temperatureC = document.querySelector("[data-js='temp']"),
    country = document.querySelector("[data-js='country']"),
    hour = document.querySelector("[data-js='hour']"),
    condition = document.querySelector("[data-js='condition']");

  cloudy.innerText = current.cloud + "%";
  humidity.innerText = current.humidity + "%";
  wind.innerText = current.gust_kph + " km/h";
  feelsLike.innerText = current.feelslike_c + " °C";
  temperatureC.innerText = current.temp_c + " °";
  country.innerText = location.country;
  hour.innerText = location.localtime;
  condition.src = current.condition.icon;
};

const changeBackupCity = (city) => {
  if (arrayBackupItems.length > 4) {
    arrayBackupItems.pop();
    arrayBackupItems.unshift(city);
  } else {
    arrayBackupItems.unshift(city);
  }
  return arrayBackupItems;
};

const addEventClickCitiesBackup = () => {
  const citiesSpan = document.querySelectorAll('[data-js="cities"]');
  citiesSpan.forEach((city) =>
    city.addEventListener("click", getWeatherInfoWithSpanStorage)
  );
};

const getWeatherInfoWithSpanStorage = ({ target }) => {
  changeImageBackground(target.innerText);
  changeInfoWeather(target.innerText);
};

const showCitiesRecentViewed = (cities) => {
  weatherCitiesStorage.innerHTML = "";
  cities.forEach((city) => {
    weatherCitiesStorage.innerHTML += `
    <span data-js="cities">${city}</span>
    `;
  });
  addEventClickCitiesBackup();
};

const saveInStorageBackupCities = (cities) =>
  window.localStorage.setItem("citiesBackup", JSON.stringify(cities));

const handleBackupAndInfoCity = (city) => {
  const arrayBackupCities = changeBackupCity(city);
  saveInStorageBackupCities(arrayBackupCities);
  showCitiesRecentViewed(arrayBackupCities);
};

const handleValueInput = (e) => {
  e.preventDefault();
  const cityNameInput = inputOfCity.value;
  handleBackupAndInfoCity(cityNameInput);
  changeImageBackground(cityNameInput);
  changeInfoWeather(cityNameInput);
};

const getStorageCity = (cities) => {
  cities.forEach((city) => {
    arrayBackupItems.push(city);
  });
  showCitiesRecentViewed(arrayBackupItems);
};

const getCitiesBackupStorage = () =>
  window.localStorage.citiesBackup
    ? getStorageCity(JSON.parse(window.localStorage.citiesBackup))
    : null;
getCitiesBackupStorage();

formOfCity.addEventListener("submit", handleValueInput);
