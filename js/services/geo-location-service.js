'use strict';

// import { axios } from '../lib/axios.js'


export const geoCodeService = {
      getLocationByName
}

var API_KEY = 'AIzaSyAkOmFkBUn6IbejuXmCRMjE0KhuIiXbaY0'
var URL = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAkOmFkBUn6IbejuXmCRMjE0KhuIiXbaY0`

function getLocationByName(keywordSearch) {
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${keywordSearch}&key=${API_KEY}`
      return axios.get(url)
            .then((res) => res.data.results[0].geometry.location);
}
