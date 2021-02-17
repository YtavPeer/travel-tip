import { storageService } from './storage-service.js'

var LOCATION_KEY = 'locationDB'


export const mapService = {
    getLocs,
    addLocation,
    getLocById,
    removeFromLocationList,
    loadLocationFromStorage,
}


var locs;

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

//funtion that add location and save to storage
function addLocation(loc, newLocationName, weatherDate) {
    var newLocation = {
        id: locs[locs.length - 1].id + 1,
        name: newLocationName,
        lat: loc.lat,
        lng: loc.lng,
        weather: weatherDate,
        createdAt: Date.now(),
        updateAt: undefined
    }
    locs.push(newLocation)
    storageService.saveToStorage(LOCATION_KEY, locs)
}


function getLocById(locationId) {
    var currLoc = locs.find(value => value.id === +locationId)
    var locData = { lat: currLoc.lat, lng: currLoc.lng };
    return locData
}

function removeFromLocationList(locationid) {
    var idx = locs.findIndex(value => value.id === +locationid)
    locs.splice(idx, 1);
    storageService.saveToStorage(LOCATION_KEY, locs);
    console.log('location deleted');
}

function loadLocationFromStorage() {
    var dataFromDB = storageService.loadFromStorage(LOCATION_KEY);
    locs = (dataFromDB) ? dataFromDB : [];
}


