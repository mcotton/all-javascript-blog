var testCase = require('nodeunit').testCase,
    cradle = require('cradle'),
    config = require('../config');

    cradle.setup({ options: {cache: false, raw: true}});
    var user_settings = {
               host: config.settings.host,
               port: config.settings.port,
               user: config.settings.user,
               pass: config.settings.pass,
               testing_db: config.settings.testing_db,
               db: config.settings.db
                         };
    var testing_db = new(cradle.Connection)(user_settings.host, user_settings.port, {auth: {username:
    user_settings.user, password: user_settings.pass
    }}).database(user_settings.testing_db);


    var db = new(cradle.Connection)(user_settings.host, user_settings.port, {auth: {username:
    user_settings.user, password: user_settings.pass
    }}).database(user_settings.db);


exports.start_up = {
    'Create testing DB': function (test) {
        testing_db.create();
        testing_db.exists(function(err, data) {
            test.ifError(err);
            test.done();
                            })
                    }
                }

exports.testing = {
    'Check DB info': function (test) {
        testing_db.info(function(err, data) {
            test.ifError(err);
            test.done();
                            })
                    },

    'Saving document to the couch': function (test) {
        testing_db.save('nodeunit', {name: 'testing nodeunit'}, function(err, data) {
            test.ifError(err);
            test.done();
                            })
                    },

    'Getting document from the couch': function (test) {
        testing_db.get('nodeunit', function(err, data) {
            test.ifError(err);
            test.equal(data.name, 'testing nodeunit');
            test.done();
                            })
                    },

    'Deleting document from the couch': function (test) {
        testing_db.destroy();
        testing_db.exists(function(err, data) {
            test.equal(err, null);
            test.done();
                            })
                    }
                }

exports.finishing = {
    'Check for production DB': function (test) {
        db.exists(function(err, data) {
            test.ifError(err);
            test.done();
                            })
                    }
}
