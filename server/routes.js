module.exports = function(app, express){
    app.use(function (req, res, next) {
        app.get('/status', function() {
            res.status(200).end();
        });
        app.get('/entries', function() {
            res.status(200).send();
        });
    });
}
