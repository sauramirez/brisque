'use strict';

var disque = require('disque.js');
var Hoek = require('hoek');


class Job {
  /**
   * @param {String} jobid
   * @param {String} queue
   * @param {Object} data
   * @param {disque} client
   * @param {Integer} timeout (ms) optional
   */
  constructor(jobid, name, queue, data, client, timeout) {
    this.id = jobid;
    this.name = name;
    this.queue = queue;
    this.data = data;
    this.client = client;
    this.timeout = timeout || 10;
  }

  /**
   *
   * @param {String} name the job name
   * @param {Object} data the job payload
   */
  static create(name, data, client, queue, timeout) {
    timeout = timeout || 10;
    queue = queue || 'q';
    Hoek.assert(typeof data, "object");
    data.job_name = name;
    var promise = new Promise(function(resolve, reject) {
      client.addjob(
        queue,
        JSON.stringify(data), timeout, function(err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(new Job(res, queue, data, client, timeout));
        });
    });
    return promise;
  }

  done(err) {
    Hoek.assert(!err, err);
    // remove job from the queue
    this.client.ackjob(this.id);
  }
}

module.exports = Job;
