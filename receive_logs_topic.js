#!/usr/bin/env node

var amqp = require('amqplib');
var basename = require('path').basename;
var all = require('when').all;
var aws = require('aws-sdk');

var keys = process.argv.slice(2);
if (keys.length < 1) {
  console.log('Usage: %s pattern [pattern...]',
              basename(process.argv[1]));
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
      fetchSubscriptions();
      logMessage(msg);
      emailMessage(msg);
    };

    function logMessage(msg) {
      console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
    };

    function emailMessage(msg) {
      aws.config.loadFromPath('aws.credentials.json');
      var ses = new aws.SES();

      // Could be a list
      var to = ['johan.menac@gmail.com'];
      // this must relate to a verified SES account
      var from = 'johan.menac@gmail.com';

      var email = {
        Source: from,
        Destination: { ToAddresses: to },
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

    // TODO: another method, create a REST API for directly listening to queues
    // from Rabbit, then on create, just hit the API and have a new client listening
    function fetchSubscriptions() {
      // If create, get all the create subscriptions.
      // If update, get all the update subscriptions.
      // If delete, get all the delete subscriptions.
      // Then filter on a specific field
      // If there, send email / notification to subscriber
      // If not there, ignore
    }

  });
}).then(null, console.warn);
