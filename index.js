'use strict';
//todo separate into smaller modules
var mongoose = require("mongoose");
var request = require('request');
var Movie = require('./models/movieModel');
var Matchup = require('./models/matchupModel');
var fs = require('fs');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type: 'application/*+json'});
var app = express();

var compress = require('compression');
var layouts = require('express-ejs-layouts');

/**
 * CONFIG
 */

app.set('layout');
app.set('view engine', 'ejs');
app.set('view options', {layout: 'layout'});
app.set('views', path.join(process.cwd(), '/server/views'));

app.use(compress());
app.use(layouts);
app.use('/client', express.static(path.join(process.cwd(), '/client')));

app.disable('x-powered-by');

var env = {
  production: process.env.NODE_ENV === 'production'
};

if (env.production) {
  Object.assign(env, {
    assets: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'assets.json')))
  });
}

/**
 * database connect
 */
mongoose.connect('localhost/cagematch');

/**
 * define routes
 */

// var routes = require('./server/routes.js');

app.get('/movies', function (req, res) {
  Movie.find({actorId: 'nm0000115'}, function (err, cageMovies) {
    if (err) return next(err);
    var movieCount = cageMovies.length;
    var filteredMovies = cageMovies.filter(function (movie) {
      return movie.imgUrl !== undefined
    }).sort(function(a, b){
      return b.score - a.score;
    }).slice(0, Math.floor(movieCount/2));


    res.send(JSON.stringify(filteredMovies));

  });
});

app.get('/image/:url', function(req,res){
  var url = req.params.url;
  request(url).pipe(res);
});

app.post('/matchup', jsonParser, function (req, res) {
  // get matchup data, insert
  // update winner score
  // update loser score

  var body = [];
  req.on('data', function (data) {
    body.push(data);
  });
  req.on('end', function () {
    body = Buffer.concat(body).toString();

    var matchupDataRaw = JSON.parse(body);
    var newMatchup = new Matchup(matchupDataRaw);
    newMatchup.save(function (err) {
      if (err) {
        res.status(500).end(err);
        return;
      }

      Movie.findOne({
        actorId: 'nm0000115',
        title: matchupDataRaw.winner
      }, function(err, winner) {
        if (err) {
          return res.status(405).end()
        }
        winner.score = matchupDataRaw.winnerScorePost;
        winner.save(function(err, newdoc){
          Movie.findOne({
            actorId: 'nm0000115',
            title: matchupDataRaw.loser
          }, function(err, loser) {
            if (err) {
              return res.status(405).end()
            }
            loser.score = matchupDataRaw.loserScorePost;
            loser.save(function(err, newdoc){
              res.status(201).end();
            })
          });
        })
      });
    });
  })
});

var lists = [
    {id: '123', title: 'Nicolas Cage Movies',},
    {id: '456', title: 'Top 20 Albums 2007-2016'},
    {id: '789', title: 'Adam Sandler Movies'}
];
var entries = [
{ "_id" : "553bd7d0168a011d4725fb30", "imdbId" : "tt3532216", "title" : "Mena", "actorId" : "nm0000129", "score" : 1168, "__v" : 0 },
{ "_id" : "553bd7d0168a011d4725fb2e", "imdbId" : "tt3393786", "title" : "Jack Reacher: Never Go Back", "actorId" : "nm0000129","score" : 1188, "__v" : 0 },
{ "_id" : "553bd7d0168a011d4725fb2f", "imdbId" : "tt1745960", "title" : "Top Gun 2", "actorId" : "nm0000129",  "score" : 1188.414300586377, "__v" : 0 },
{ "_id" : "553bd7d0168a011d4725fb33", "imdbId" : "tt1483013", "title" : "Oblivion", "actorId" : "nm0000129", "score" : 1178, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTQwMDY0MTA4MF5BMl5BanBnXkFtZTcwNzI3MDgxOQ@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb34", "imdbId" : "tt0790724", "title" : "Jack Reacher", "actorId" : "nm0000129",  "score" : 1200, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTM1NjUxMDI3OV5BMl5BanBnXkFtZTcwNjg1ODM3OA@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb35", "imdbId" : "tt1336608", "title" : "Rock of Ages", "actorId" : "nm0000129", "score" : 1177, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTg2NDQyODAzNF5BMl5BanBnXkFtZTcwMTg5MDA3Nw@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb38", "imdbId" : "tt0985699", "title" : "Valkyrie", "actorId" : "nm0000129", "score" : 1212, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb3d", "imdbId" : "tt0369339", "title" : "Collateral", "actorId" : "nm0000129", "score" : 1189, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMjE3NjM5OTMxMV5BMl5BanBnXkFtZTcwOTIzMTQyMw@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb42", "imdbId" : "tt0175880", "title" : "Magnolia", "actorId" : "nm0000129","score" : 1200, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BNzMzMDgyNTIzOF5BMl5BanBnXkFtZTcwOTk0MDg2OQ@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb47", "imdbId" : "tt0106918", "title" : "The Firm", "actorId" : "nm0000129", "score" : 1200, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTgxMjM5NDYwM15BMl5BanBnXkFtZTgwODkzMzk5MDE@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb49", "imdbId" : "tt0104231", "title" : "Far and Away", "actorId" : "nm0000129",  "score" : 1188, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMjE4MjUxMDk0NV5BMl5BanBnXkFtZTYwNTM4ODY5._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb4c", "imdbId" : "tt0095953", "title" : "Rain Man", "actorId" : "nm0000129", "score" : 1200, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTQ4NTA1NDU3NV5BMl5BanBnXkFtZTcwODUwMTU2NA@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb4d", "imdbId" : "tt0094889", "title" : "Cocktail", "actorId" : "nm0000129","score" : 1212.813372137389, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTkxMzk4OTMwOF5BMl5BanBnXkFtZTcwMzE3ODIyMQ@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb4f", "imdbId" : "tt0092099", "title" : "Top Gun", "actorId" : "nm0000129", "score" : 1224, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTY3ODg4OTU3Nl5BMl5BanBnXkFtZTYwMjI1Nzg4._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb50", "imdbId" : "tt0089469", "title" : "Legend", "actorId" : "nm0000129","score" : 1188, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMjI3OTg2NTQ5Nl5BMl5BanBnXkFtZTgwMzY3MjQxMDE@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb53", "imdbId" : "tt0085868", "title" : "Losin' It", "actorId" : "nm0000129",  "score" : 1179, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTU4MTUwNzcxOV5BMl5BanBnXkFtZTYwMDgyNDY5._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb55", "imdbId" : "tt0083169", "title" : "Taps", "actorId" : "nm0000129", "score" : 1212, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTY1OTQ3ODc2MF5BMl5BanBnXkFtZTcwNTQyNjQzMQ@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb56", "imdbId" : "tt0082329", "title" : "Endless Love", "actorId" : "nm0000129", "score" : 1189, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BOTYzNDU1MzEyN15BMl5BanBnXkFtZTgwOTYwMTU0MDE@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb36", "imdbId" : "tt1229238", "title" : "Mission: Impossible - Ghost Protocol", "actorId" : "nm0000129","score" : 1200, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTY4MTUxMjQ5OV5BMl5BanBnXkFtZTcwNTUyMzg5Ng@@._V1_SX300.jpg" },
{ "_id" : "553bd7d0168a011d4725fb31", "imdbId" : "tt2381249", "title" : "Mission: Impossible - Rogue Nation", "actorId" : "nm0000129",  "score" : 1178, "__v" : 0, "imgUrl" : "http://ia.media-imdb.com/images/M/MV5BMTQ1NDI2MzU2MF5BMl5BanBnXkFtZTgwNTExNTU5NDE@._V1_SX300.jpg" }
]



app.get('/s', function(req, res) {
    res.status(200).end();
});
app.get('/movie', function (req, res) {
    res.send(JSON.stringify([1,2,3]));
});




app.get('/entries', function(req, res) {
    res.send(JSON.stringify(entries));
});
app.get('/entries/:id', function(req, res) {
    var id = req.params.id;
    var filtered = entries.filter(function(entry){
        return entry.imdbId === id.toString();
    });
    var list = (filtered || [])[0]
    res.send(JSON.stringify(list));
});

app.get('/lists', function(req, res) {
    res.send(JSON.stringify(lists));
})
app.get('/lists/:id', function(req, res) {
    var id = req.params.id;
    console.log(req.query);
    console.log(req.params);
    var filtered = lists.filter(function(list){
        return list.id === id.toString();
    });
    var list = (filtered || [])[0]
    res.send(JSON.stringify(list));
})


app.get('/', function (req, res) {
  res.render('index', {
    env: env
  });
});

var port = Number(process.env.PORT || 3001);
app.listen(port, function () {
  console.log('server running at localhost:3001, go refresh and see magic');
});

if (env.production === false) {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');

  var webpackDevConfig = require('./webpack.config.development');

  new WebpackDevServer(webpack(webpackDevConfig), {
    publicPath: '/client/',
    contentBase: './client/',
    inline: true,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
  }).listen(3000, 'localhost', function (err) {
    if (err) {
      console.log(err);
    }

    console.log('webpack dev server listening on localhost:3000');
  });
}
