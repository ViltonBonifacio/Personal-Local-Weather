/**
 * Created by vilto on 05/07/2017.
 */
//todo: skycons

function makeIcon(icon) {
    function stringChange(string) {
        var arr = string.split("-");
        var joinner = arr.join("_");
        return Skycons[joinner.toUpperCase()];
    }
    var skycons = new Skycons({"color": "#337ab7"});
    skycons.add("icon", stringChange(icon));
    skycons.play();
}

//todo: Background image generator

function backgroundGenerator(icon) {
    console.log("function started");
    var width = document.body.clientWidth,
        height = window.innerHeight,
        htmlHeight = document.getElementById("height").scrollHeight;
    var bodyStyle = document.body.style;

    if (height >= htmlHeight) {
        if (width / height > 1920 / 1111) {
            if (width <= 640) {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_640.jpg')";
                bodyStyle.backgroundSize = width + "px";
                console.log("640");
            } else if (width > 640 && width < 1280) {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_1280.jpg')";
                bodyStyle.backgroundSize = width + "px";
                console.log("1280");
            } else {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_1920.jpg')";
                bodyStyle.backgroundSize = width + "px";
                console.log("1920");
            }
        } else {
            if (height <= 370) {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_640.jpg')";
                bodyStyle.backgroundSize = "auto " + height + "px";
                console.log("370");
            } else if (height > 370 && height < 1111) {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_1280.jpg')";
                bodyStyle.backgroundSize = "auto " + height + "px";
                console.log("740");
            } else {
                bodyStyle.backgroundImage = "url('background images/" + icon + "_1920.jpg')";
                bodyStyle.backgroundSize = "auto " + height + "px";
                console.log("1111");
            }
        }
    } else {
        if (htmlHeight <= 370) {
            bodyStyle.backgroundImage = "url('background images/" + icon + "_640.jpg')";
            bodyStyle.backgroundSize = "auto " + htmlHeight + "px";
            console.log("370");
        } else if (htmlHeight > 370 && htmlHeight < 1111) {
            bodyStyle.backgroundImage = "url('background images/" + icon + "_1280.jpg')";
            bodyStyle.backgroundSize = "auto " + htmlHeight + "px";
            console.log("740");
        } else {
            bodyStyle.backgroundImage = "url('background images/" + icon + "_1920.jpg')";
            bodyStyle.backgroundSize = "auto " + htmlHeight + "px";
            console.log("1111");
        }
    }
}

//todo: check the user latitude and longitude with IP-API.com
// http://ip-api.com/docs/api:json
/*  Besides the coordinates, the following information is available:
        1. City;
        2. Country and country code;
        3. region and region name;
        4. time zone;
 */

function getWeather(lat, lon) {
    var httpRequestWeather;

    //The request
    httpRequestWeather = new XMLHttpRequest();
    if (!httpRequestWeather) {
        console.log("Cannot creat an XMLHTTP instance.\nError: 003.");
        return false;
    }

    httpRequestWeather.onreadystatechange = weatherAlerts;
    httpRequestWeather.open('GET', 'https://crossorigin.me/https://api.darksky.net/forecast/b1cdd0cd5d6306f2f8fdbedbb543a699/' +
        lat +
        ',' +
        lon +
        '?exclude=minutely,hourly,daily,alerts');
    httpRequestWeather.send();

    function weatherAlerts() {
        if (httpRequestWeather.readyState === XMLHttpRequest.DONE) {
            if (httpRequestWeather.status === 200) {
                console.log('run');
                var weatherResponse = JSON.parse(httpRequestWeather.responseText);
                console.log(weatherResponse);
                backgroundGenerator(weatherResponse['currently']['icon']);
                document.getElementById("temperature").innerHTML = weatherResponse['currently']['temperature'] + ' &#8457;'; //Celsius &#8451;
                document.getElementById("summary").innerHTML = weatherResponse['currently']['summary'];
                document.getElementById("windSpeed").innerHTML = weatherResponse['currently']['windSpeed'] + " mph";
                makeIcon(weatherResponse['currently']['icon']);
            } else {
                console.log("There was a problem with the request.\nStatus code: " + httpRequestWeather.status + ".\nError: 004.");
            }
        }
    }
}

function getAddress() {
    //backgroundGenerator();

    var httpRequestIP;

    //The request
    httpRequestIP = new XMLHttpRequest();
    if (!httpRequestIP) {
        console.log("Cannot creat an XMLHTTP instance.\nError: 001.");
        return false;
    }
    httpRequestIP.onreadystatechange = IPAlerts;
    httpRequestIP.open('GET', 'https://crossorigin.me/http://ip-api.com/json');
    httpRequestIP.send();

    //Alerts
    function IPAlerts() {
        if (httpRequestIP.readyState === XMLHttpRequest.DONE) {
            if (httpRequestIP.status === 200) {
                //todo: get the IP;
                console.log(httpRequestIP.responseText);
                var IPResponse = JSON.parse(httpRequestIP.responseText);
                console.log(IPResponse);
                document.getElementById("location").innerHTML = IPResponse['city'] + ", " + IPResponse['regionName'] + " - " + IPResponse['countryCode'];
                var lat = IPResponse['lat'].toString();
                var lon = IPResponse['lon'].toString();
                getWeather(lat,lon);
            }
        } else {
            console.log("There was a problem with the request.\nStatus code: " + httpRequestIP.status + '.\nError: 002.');
        }
    }

}

//todo: Change temperature unit

function changeTempUnit() {
    var temp = document.getElementById("temperature").innerHTML.split(" ");
    var temperature = document.getElementById("temperature").innerHTML;
    if (temp[1] === "℉") {
        document.getElementById("temperature").innerHTML = ((temp[0] - 32) * 5 / 9).toFixed(2) + ' &#8451;';
        document.getElementById("changeUnit").innerHTML = "&#8457;";
    } else {
        document.getElementById("temperature").innerHTML = (temp[0] * 9 / 5 + 32).toFixed(2) + ' &#8457;';
        document.getElementById("changeUnit").innerHTML = "&#8451;";
    }
}

function changeWSUnit() {
    var temp = document.getElementById("windSpeed").innerHTML.split(" ");
    var temperature = document.getElementById("windSpeed").innerHTML;
    if (temp[1] === "mph") {
        document.getElementById("windSpeed").innerHTML = (temp[0] * 1.609344).toFixed(2) + ' Km/h';
        document.getElementById("changeWS").innerHTML = "mph";
    } else {
        document.getElementById("windSpeed").innerHTML = (temp[0] / 1.609344).toFixed(2) + ' mph';
        document.getElementById("changeWS").innerHTML = "Km/h";
    }
}
//todo: with the coordinates, check the local weather for the user:
/*  1. Icon;
    2. Temperature;
        2.1. maybe can create a button to change from fahrenheit to celsius; or
        2.2. provide that information based on the user location;
    3. Summary of the weather (ex: sky is clear, rain, etc.).
 */

//todo: link to background images and their owners
/*
00. [Clear day]
    url: https://pixabay.com/en/aerial-napa-california-landscape-2294636/
    Owner nickname: derwiki
    Owner profile: https://pixabay.com/en/users/derwiki-562673/

01. [Clear night]
    url: https://pixabay.com/en/british-columbia-canada-clear-lake-2382640/
    Owner nickname: jameswheeler
    Owner profile: https://pixabay.com/en/users/jameswheeler-5314099/
02. [Rain]
    url: https://pixabay.com/en/rain-rainy-weather-bad-weather-port-1479303/
    Owner nickname: WolfBlur
    Owner profile: https://pixabay.com/en/users/WolfBlur-2503887/
03. [Snow]
    url: https://pixabay.com/en/winter-tree-snow-landscape-cold-1367153/
    Owner nickname: smarko
    Owner profile: https://pixabay.com/en/users/smarko-2381951/
04. [Sleet]
    url: https://pixabay.com/en/imp-winter-cold-sleet-1056741/
    Owner nickname: Couleur
    Owner profile: https://pixabay.com/en/users/Couleur-1195798/
05. [Wind]
    url: https://pixabay.com/en/weather-vane-wind-sky-north-is-711082/
    Owner nickname: ddouk
    Owner profile: https://pixabay.com/en/users/ddouk-607002/
06. [Fog]
    url: https://pixabay.com/en/landscape-fog-morning-sun-sunrise-1619283/
    Owner nickname: hansbenn
    Owner profile: https://pixabay.com/en/users/hansbenn-194001/
07. [Cloudy]
    url: https://pixabay.com/en/clouds-cloudy-reflection-blue-210649/
    Owner nickname: Sharky
    Owner profile: https://pixabay.com/en/users/Sharky-36579/
09. [Partly Cloudy Day]
    url: https://pixabay.com/en/sea-black-sea-crimea-clouds-summer-1528703/
    Owner nickname: kakirochka
    Owner profile: https://pixabay.com/en/users/kakirochka-2946506/
10. [Partly Cloudy Night]
    url: https://pixabay.com/en/outdoor-sunlight-gorgeous-sunbeam-2091804/
    Owner nickname: kalmankovats
    Owner profile: https://pixabay.com/en/users/kalmankovats-4642025/
*/