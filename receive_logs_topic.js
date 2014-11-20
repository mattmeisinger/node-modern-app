#!/usr/bin/env node

var amqp     = require('amqplib');
var basename = require('path').basename;
var all      = require('when').all;
var aws      = require('aws-sdk');
var http     = require('http');
var _        = require('underscore');

var keys = process.argv.slice(2);

if (keys.length < 1) {
  console.log('Usage: %s pattern [pattern...]', basename(process.argv[1]));
  process.exit(1);
}

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var ex = 'operations';
    var ok = ch.assertExchange(ex, 'topic', {durable: false});

    ok = ok.then(function() {
      return ch.assertQueue('', {exclusive: true});
    });

    ok = ok.then(function(qok) {
      var queue = qok.queue;
      return all(keys.map(function(rk) {
        ch.bindQueue(queue, ex, rk);
      })).then(function() { return queue; });
    });

    ok = ok.then(function(queue) {
      return ch.consume(queue, process, {noAck: true});
    });

    return ok.then(function() {
      console.log(' [*] Waiting for logs. To exit press CTRL+C.');
    });

    function process(msg) {
      fetchSubscriptions(msg);
      logMessage(msg);
    };

    function fetchSubscriptions(msg) {
      var options = {
        host: 'localhost',
        port: 1337,
        path: '/api/subscription'
      };

      http.get(options, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
          var data = JSON.parse(body);
          var subscriptions = data.items;
          var action = JSON.parse(msg.content);
          // Check subscriptions and match against message
          var routingKey = msg.fields.routingKey;
          var operation = routingKey.split('.')[2];
          var agents = _.chain(subscriptions)
            .filter(function(s) { return s.operation == "all" ? true : operation == s.operation ; })
            .filter(function(s) {
              if (s.parameter != undefined && s.parameter != "all") {
                var parameter = s.parameter;
                if (s.value != undefined && s.value != "all") {
                  var value = s.value;
                  return value == action[parameter];
                }
                return true;
              }
            })
            .map(function(s) { return s.agent; })
            .value();

          var recipients = _.map(agents, function(agent) {
            console.log("Sending email to " + agent.firstName + " " + agent.lastName);
            return agent.email;
          });

          emailMessage(msg, recipients);
        });
      });
    }

      function emailMessage(msg, recipients) {
      aws.config.loadFromPath('aws.credentials.json');
      var ses = new aws.SES();

      // this must relate to a verified SES account
      var from = 'johan.menac@gmail.com';

      var email = {
        Source: from,
        Destination: { ToAddresses: recipients},
        Message: {
          Subject: { Data: msg.fields.routingKey },
          Body: {
            Text: { Data: msg.content.toString() }
          }
        }
      };

      ses.sendEmail(email, function(err, data) {
          if(err) throw err;
          console.log('Email sent:');
          console.log(data);
       }
     );
    };

    function logMessage(msg) {
      console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
    };
  });
}).then(null, console.warn);
