# brisque
A disque job queue built for node.js

## Requirements
  - disque.js
  - hiredis

## Installation

  - Latest release:

        $ npm install brisque

## Creating Jobs

You can send jobs to the disque by using the Job class.
```js
client = disque.connect(['127.0.0.1:7711']);
var promise = Job.create('processImage', {image: 'imageUrl'}, client, 'queue_name');
  promise.then(function(job) {
  console.log(`Created job with id ${job.id}`);
});
```

## Processing Jobs

Jobs can bre processed by using the worker class and listening to the events sent using the job name. So for the previous job the worker would look like this.

```js
var client = disque.connect(['127.0.0.1:7711']);
var worker = new Worker({
  client: client
});
worker.on('email', function(job) {
  // ack job from disque
  job.done();
});
worker.start();
```
