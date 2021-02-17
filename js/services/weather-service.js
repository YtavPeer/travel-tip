'use strict'

export const weatherService = {
      getTempByName

}

var API_KEY = 'd1321269b0b84b84850b3bfb09e8e95b'

function getTempByName(cityName) {
      let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=eea6f959004b4f12abf36d71708faf7d`
      return axios.get(url)
            .then((res) => {
                  return res.data.data[0];
            });
}

