const express = require('express');

const app = express();
const request = require('request');
const cheerio = require('cheerio');

const foodList = {
	meatfood: [],
	vegefood: []
};

function updateFoodlist() {
	const url = 'https://www.mayk.fi/tietoa-meista/ruokailu/';

	request(url, (error, response, html) => {
		if (!error) {
			const $ = cheerio.load(html);

			const vegedays = $('.ruoka-header-kasvisruoka');
			vegedays.each((i, elem) => {
				foodList
					.vegefood
					.push({
						day: elem
							.prev
							.prev
							.prev
							.prev
							.children[0]
							.data
							.slice(1, -1),
						food: elem.children[0].data
					});
			});

			const meatdays = $('.ruoka-header-ruoka');
			meatdays.each((i, elem) => {
				foodList
					.meatfood
					.push({
						day: elem
							.prev
							.prev
							.children[0]
							.data
							.slice(1, -1),
						food: elem.children[0].data
					});
			});
			console.log('List updated');
		}
	});
}

updateFoodlist();

setInterval(() => {
	updateFoodlist();
}, 1 * 60 * 60 * 1000);

app.get('/api/food/', (req, res) => res.send(foodList));
app.get('/api/food/today', (req, res) => res.send({meatfood: foodList.meatfood[foodList.meatfood.length - 1], vegefood: foodList.vegefood[foodList.vegefood.length - 1]}));

app.listen(8585, () => console.log('SHIT GOING ON ON 8585 OH SHIT'));
