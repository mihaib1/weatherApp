
const locationInput = document.getElementById('location');
const searchButton = document.getElementById('search-button');
const todayContainer = document.getElementById('today');

const gridData = {
    DATE: 'datetime',
    TEMPERATURE: 'temp',
    MAX_TEMP: 'tempmax',
    MIN_TEMP: 'tempmin',
    UV_INDEX: 'uvindex',
    WIND_SPEED: 'windspeed',
    HUMIDITY: 'humidity'
};

const gridLabels = {
    DATE: 'Date',
    TEMPERATURE: 'Temperature (°C)',
    MAX_TEMP: 'Maximum Temperature (°C)',
    MIN_TEMP: 'Minimum Temperature (°C)',
    UV_INDEX: 'UV Index',
    WIND_SPEED: 'Wind Speed (km/h)',
    HUMIDITY: 'Humidity (%)'
};

const labels = {
    
}

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const result = getWeatherForCity(locationInput.value);
    result.then(() => {
        console.log("Finished loading!");
    })
    locationInput.value = "";
})

async function getWeatherForCity(cityName) {
    const weatherRequest = new Request(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=J7BYYLHSFU6DSZ6FX57QV4VSL&contentType=json`, 
        {mode:"cors"}
    );
    try{
        const response = await fetch(weatherRequest);
        json = await response.json();
        console.log(json);

        const condition = json.currentConditions.conditions;
        weatherImage = await getGif(condition);

        createWeatherDetailsDiv(json);
    }
    catch(error){
        console.log("catch block");
        console.log(error);
        todayContainer.textContent = `No data was found for the provided address.`
    }
}



async function getGif(weatherCondition){
    const imageContainer = document.getElementById("weather-gif");
    const searchTerm = weatherCondition + " weather";
    const gifSearchUrl = 'https://api.giphy.com/v1/gifs/translate?api_key=cpqdWkIwHGIPEFU8Iy9m15Lj5Nu9h6sB&s=' + searchTerm;
    const gifRequest = new Request(gifSearchUrl, {mode: "cors"});
    try{
        const response = await fetch(gifRequest);
        const json = await response.json();
        imageContainer.src=json.data.images.original.url;
    }
    catch(error){
        imageContainer.src = './no-image-found';
        console.log(error);
    }
    finally{
        console.log("finally block")
    }

}

function createWeatherDetailsDiv(weatherData){
    todayContainer.innerHTML = "";
    const containerDiv = document.createElement("div");
    const summary = `Today's weather for ${weatherData.resolvedAddress} is ${weatherData.currentConditions.conditions}`;
    containerDiv.textContent = summary;

    todayContainer.appendChild(containerDiv);
    console.log(weatherData);
    addTable(weatherData);

}

function addTable(data) {
    const daysData = data.days;
    const gridKeys = Object.keys(gridData);
    var myTableDiv = document.getElementById("forecast-table");
    myTableDiv.innerHTML = "";
  
    var table = document.createElement('TABLE');
    table.border = '1';
  
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    for (var i = 0; i < gridKeys.length; i++) {

        var isOddRow = i % 2 === 1 ? true : false;
        var tr = document.createElement('TR');

        if(isOddRow){
            tr.classList.add("odd-row");
        }
        
        tableBody.appendChild(tr);
        const rowStart = document.createElement("TD");
        rowStart.classList.add('row-header');
        rowStart.appendChild(document.createTextNode(gridLabels[gridKeys[i]]));
        tr.appendChild(rowStart);
        
        for (var j = 0; j < daysData.length; j++) {
            var td = document.createElement('TD');
            td.width = '95';
            let currentKey = gridKeys[i];
            currentKey = gridData[currentKey];
            td.appendChild(document.createTextNode((daysData[j][currentKey])));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
  }
  