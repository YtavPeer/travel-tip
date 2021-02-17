'use strict'

export const weatherService = {
      getTempByName

}

var API_KEY = '96c0eb0e4e61dc74cd6d8eefb2384b94'

function getTempByName(cityName) {
      let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${API_KEY}`
      return axios.get(url)
            .then((res) => {
                  return res.data.data[0];
            });
}

