const cheerio = require('cheerio');
const request = require('superagent');

let gb2312 = 'http://info.51.ca/news/canada/2017-12/609785.html';
let utf8 = 'http://www.wenxuecity.com/news/2017/12/28/6854071.html';

request
    .get(utf8)
    .then(function(res) {
	    $ = cheerio.load(res.text, {decodeEntities: false});
	
	    let title = $('h3').text();
	    let content = $('#articleContent').html();
	
	    console.log(title);
    }).catch(function(err) {
	    console.log(err.message);
    });
