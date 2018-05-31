const express = require('express');
const app = express();
const request = require('request');
const cheerio = require('cheerio');

let foodList = {
  "meatfood": [],
  "vegefood": []
}

function updateFoodlist() {
  let url = 'https://www.mayk.fi/tietoa-meista/ruokailu/';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var vegedays = $('.ruoka-header-kasvisruoka');
      vegedays.each(function (i, elem) {
        foodList
          .vegefood
          .push({
            "day": elem
              .prev
              .prev
              .prev
              .prev
              .children[0]
              .data
              .slice(1, -1),
            "food": elem.children[0].data
          })
      })

      var meatdays = $('.ruoka-header-ruoka');
      meatdays.each(function (i, elem) {
        foodList
          .meatfood
          .push({
            "day": elem
              .prev
              .prev
              .children[0]
              .data
              .slice(1, -1),
            "food": elem.children[0].data
          })
      })
      console.log("List updated")
    }
  })
}

updateFoodlist();

setInterval(function () {
  updateFoodlist();
}, 1 * 60 * 60 * 1000);

app.get('/api/food/', (req, res) => res.send(foodList))
app.get('/api/food/today', (req, res) => res.send('AYAA'))

app.listen(8585, () => console.log('SHIT GOING ON ON 8585 OH SHIT'))
