var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
// app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))


//var file = require('./public/index.html');

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

app.get('/short', function (req, res) {
	res.render('short',
	{
		title : "Short"
	})
})

var __counter123 = 0;
var shortened_urls = {
	
};
function convert(l) {
	var s = (__counter123 + 1).toString();
	shortened_urls[s] = l;
	__counter123 += 1;
	return s;
}
function lookup(s) {
	return shortened_urls[s];
}

app.post('/long_to_short', function (req, res) {
	var big = req.body.long_url;
	var small = convert(big);
	res.render('shortened', {
		longy : big,
		shorty : small
	})
});

app.get('/shortened_urls', function (req, res) {
	res.send(shortened_urls);
});

app.get('/shortened/:id', function (req, res) {
	var shorty = req.params.id;
	var longy = lookup(shorty);
	res.render('short_to_long_redirect', 
		{
			long_url : longy
		}
	)
	// res.send(longy);
})

app.get('/:id', function (req, res) {
	var id = req.params.id;
	res.render('not_found', {
		page : id
	});

});

app.listen(3000);

