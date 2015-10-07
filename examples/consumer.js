var Worker = require('../lib/worker');

var worker = new Worker();
worker.on('email', function(job) {
  console.log(`Processed job ${job.id}`);
  job.done();
});
worker.start();
