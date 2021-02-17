import { storageService } from './storage-service.js'


export const mapService = {
    getLocs,
}


var locs = [
    { id: 1, lat: 11.22, lng: 26.16, weather: 57, createdAt: 1833, updateAt: 1644 },
    { id: 2, lat: 13.56, lng: 23.14, weather: 35, createdAt: 1433, updateAt: 1244 },
    { id: 3, lat: 17.46, lng: 22.17, weather: 23, createdAt: 1733, updateAt: 1644 },
    { id: 4, lat: 16.22, lng: 29.13, weather: 51, createdAt: 1433, updateAt: 1444 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


