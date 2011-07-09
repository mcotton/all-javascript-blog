  
/**
 * Module dependencies.
 */

var express = require('express'),
    cradle = require('cradle'),
    config = require('./config');

var app = module.exports = express.createServer();

// Configure CouchDB

    cradle.setup({cache: false, raw: true});
    
    var user_settings = {
               host: config.settings.host,
               port: config.settings.port,
               user: config.settings.user,
               pass: config.settings.pass,
               testing_db: config.settings.testing_db,
               db: config.settings.db
                         };

    var db = new(cradle.Connection)(
        user_settings.host, 
        user_settings.port, {
            auth: {
                username: user_settings.user,
                password: user_settings.pass
            }
        }).database(user_settings.db);


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    db.view('blog/by_date', function(err, doc) {
       
        var results = [];
        doc.rows.forEach(function (row) {
            results.push(row.value);
        });
        
        res.render('index', {
            rows: results
        });
    });
});

app.get('/post/:id', function(req, res){
    db.get(req.params.id, {"revs": "true"}, function(err, doc) {
        if(err) { console.log(err); res.end(); }
        if(doc) {
            res.render('post', {
                title: doc.title,
                author: doc.author,
                body: doc.body,
                rev: doc._rev,
                comments: doc.comments,
                date: doc.date,
                revisions: doc._revisions,
                id: doc._id
            });
        }
    });
});

app.get('/post/:id/:old_rev', function(req, res){
    db.get(req.params.id, req.params.old_rev, function(err, doc) {
        if(err) { 
            // Couldn't find the older rev of this doc
            console.log(err); 
            res.redirect('/post/' + req.params.id); 
            }
        if(doc) {
            res.render('post', {
                title: doc.title,
                author: doc.author,
                body: doc.body,
                rev: doc._rev,
                comments: doc.comments,
                date: doc.date,
                revisions: undefined,
                id: doc._id
            });
        }
    });
});

app.get('/tags', function(req, res){
    db.view('blog/tags_count', {"group":"true"}, function(err, doc) {
        if(err) { console.log(err); res.end(); }
        if(doc) {
            res.contentType('json');
            res.send(doc);
            //console.log(doc);
        }
    });
});





// Only listen on $ node app.js

if (!module.parent) {
  app.listen(9000);
  console.log("Express server listening on port %d", app.address().port);
}
