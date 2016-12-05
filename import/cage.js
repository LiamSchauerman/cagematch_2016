// import cage movies

// read movies from database
// for each movieModel
    // convert movie to entryModel
    // insert entryModel

var Entry = require('../models/entryModel');
var Movie = require('../models/movieModel');
var mongoose = require("mongoose");
var request = require('request');
mongoose.connect('localhost/cagematch');

Movie.find({
  actorId: 'nm0000115'
}, function(err, cageMovies) {
  if (err) return next(err);
  var movieCount = cageMovies.length;
  cageMovies.forEach(function(movie, idx) {
    idx < 3 && console.log(movie);
    var entry = new Entry({
      id: movie.imdbId,
      title: movie.title,
      metadata: {},
      score: movie.score,
      list_id: movie.actorId,
    });
    entry.save(function(err) {
      if (err) {
        console.log('ERROR ');
        console.log(err);
      };
    });
  });
});
// {
//   _id: 553 b277c465c9e65190fbee4,
//   imdbId: 'tt2850386',
//   title: 'The Croods 2',
//   actorId: 'nm0000115',
//   __v: 0,
//   timestamp: Fri Apr 24 2015 22:34:52 GMT-0700 (PDT),
//   score: 1098.9919459177702 }
