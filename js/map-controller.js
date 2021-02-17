import { mapService } from './services/map-service.js'
import { geoCodeService } from './services/geo-location-service.js'
import { weatherService } from './services/weather-service.js'

var gMap;
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))


window.onload = () => {

    //this will load and render the location data to table from storage
    mapService.loadLocationFromStorage()
    renderLoacationTable()

    //this handle the my location button
    document.querySelector('.my-location-btn').addEventListener('click', (ev) => {
        console.log('our location is!', ev.target);
        var ourLocation = getPosition()
            .then((res) => {
                var lat = res.coords.latitude;
                var lng = res.coords.longitude;
                panTo(lat, lng);
                addMarker({ lat, lng })
            });
        console.log(ourLocation);
    })

    //this will handle the search by name input
    document.querySelector('.go-btn').addEventListener('click', () => {
        var searchKeyword = document.querySelector('.input-location').value;
        //need to find the way to convert the keyword search to get lat ant lng
        geoCodeService.getLocationByName(searchKeyword)
            .then((loc) => {
                console.log('Getting res from geo code service', loc);
                panTo(loc.lat, loc.lng);
                addMarker(loc)
                //need to send data to get wheather api
                var weatherDate = weatherService.getTempByName(searchKeyword)
                    .then(res => renderWeatherData(res))

                mapService.addLocation(loc, searchKeyword, weatherDate);
                renderLoacationTable()
                //handle change the location details area
                document.querySelector('.location-details').innerText = searchKeyword

                //this will handle the copy location buttom
                document.querySelector('.copy-location-btn').addEventListener('click', () => {
                    //need to save to clipboard
                    var url = `https://ytavpeer.github.io/travel-tip/?lat=${loc.lat}&lng=${loc.lng}`
                    // document.execCommand(url);
                    // const myParam = urlParams.get('myParam');
                    // const urlParams = new URLSearchParams(window.location.search);
                    const elem = document.createElement('textarea');
                    elem.value = url;
                    document.body.appendChild(elem);
                    elem.select();
                    document.execCommand('copy');
                    document.body.removeChild(elem);
                })
                // document.execCommand('copy');

                //add the query param to the url
                // github link 




            })
    })
    const urlParams = new URLSearchParams(window.location.search);
    var latUrl = +getParameterByName(`lat`, urlParams) || 32.0852999
    var lngUrl = +getParameterByName(`lng`, urlParams) || 34.78176759999999;



    initMap(latUrl, lngUrl)
        .then(() => {
            addMarker({ lat, lng });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function initMap(lat, lng) {


    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 11
            })
            console.log('Map!', gMap);
            // Create the initial InfoWindow.
            const myLatlng = { lat: -25.363, lng: 131.044 };
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: myLatlng,
            });
            infoWindow.open(gMap);
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                }
                );
                addMarker(infoWindow.position)
                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                );
                infoWindow.open(gMap);
            });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'new defulat location'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAkOmFkBUn6IbejuXmCRMjE0KhuIiXbaY0'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}




function renderLoacationTable() {
    mapService.getLocs()
        .then((res) => {
            console.log('locssss', res);
            var htmls = res.map((location) => {
                return  /*html*/`<tr>
               <td>id: ${location.id} </td>
               <td>name: ${location.name} </td>
               <td>lat: ${location.lat} </td>
               <td>lng: ${location.lng} </td>
               <td><button class='go-btn' onclick="goToLocation('${location.id}')">go</button> </td>
               <td><button class='remove-btn' onclick="removeLocation('${location.id}')">delete</button> </td>
             </tr>`
            })
            document.querySelector('.rows-table').innerHTML = htmls.join('');
        })
}

function renderWeatherData(data) {
    console.log('weather data is', data)
    var htmls = /*html*/`<tr>
                  <td>date: ${data.datetime} </td>
                  <td>max temp: ${data.app_max_temp} </td>
                  <td>min temp: ${data.app_min_temp} </td>
                  <td>description: ${data.weather.description} </td>
                </tr>`
    document.querySelector('.whether-table').innerHTML = htmls;
    return data;
}

//handle the go buttom
window.goToLocation = (locationId) => {
    var currLoc = mapService.getLocById(locationId);
    console.log('currLoc', currLoc);
    panTo(currLoc.lat, currLoc.lng)
    addMarker(currLoc);
}


//handle the delete buttom
window.removeLocation = (locationid) => {
    mapService.removeFromLocationList(locationid)
    renderLoacationTable()
}

