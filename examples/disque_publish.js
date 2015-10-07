// publisher
var disque = require('disque.js');
var Job = require('../lib/job');
var client = disque.connect(['127.0.0.1:7711']);


var promise = Job.create('email', {'test': 'test'}, client, 'q', 10);
promise.then(function(job) {
  console.log(`Created job ${job.id}`);
  process.exit();
});
