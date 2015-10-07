'use strict';

// worker
var disque = require('disque.js');
var EventEmitter = require('events');
var Job = require('./job');


class Worker extends EventEmitter {
  constructor(opts) {
    super();
    opts = opts || {};
    opts.disque = opts.disque || ['127.0.0.1:7711'];
    // default queue
    this.queues = opts.queues || ['q'];
    if (opts.client !== undefined) {
      this.client = opts.client;
    } else {
      this.client = disque.connect(opts.disque);
    }
    this.running = true;
  }

  start() {
    if (!this.running) {
      return;
    }
    var self = this;
    this.client.getjob(this.queues, function(err, jobs) {
      if (!jobs || err) {
        process.nextTick(function() {
          self.start();
        });
      }

      // else process job
      jobs.forEach(function(job) {
        var queue = job[0],
            id = job[1],
            payload = JSON.parse(job[2]);
        var job_name = payload.job_name;
        delete payload.job_name;
        var j = new Job(id, job_name, queue, payload, self.client);
        self.emit('jobstart', j);
        self.emit(job_name, j);
      });
      process.nextTick(function() {
        self.start();
      });
    });
  }

  stop() {
    this.removeAllListeners();
    this.running = false;
  }
}

module.exports = Worker;
