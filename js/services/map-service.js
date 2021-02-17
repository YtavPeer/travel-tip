import { storageService } from './storage-service'


export const mapService = {
    getLocs,
}


var locs = [{ id: 1, lat: 11.22, lng: 22.11, weather: 38, createdAt: 1533, updateAt: 1844 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


