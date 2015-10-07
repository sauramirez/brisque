var Worker = require('./worker');

var worker = new Worker();
worker.on('email', function(job) {
  console.log('got email func');
  job.done();
});
worker.start();
