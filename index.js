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

var NIC_CAGE_IMDBID = 'nm0000115';

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
//todo - move this to routes external function
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
        actorId: NIC_CAGE_IMDBID,
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
