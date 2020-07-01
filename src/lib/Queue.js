const Bee = require('bee-queue');
const CancellationMail = require('../app/jobs/CancellationMail');
const configRedis = require('../config/configRedis');

const jobs = [CancellationMail]; // seta os jobs no array

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * inicializa as filas
   */
  init() {
    // desestrutura o key e handle vindo do job
    jobs.forEach(({ key, handle }) => {
      // armazena a fila e o método handle
      this.queues[key] = {
        bee: new Bee(key, {
          redis: configRedis,
        }),
        handle,
      };
    });
  }

  /**
   * adiciona novos trabalhos dentro de cada fila
   * irá receber o job e os dados do controller
   */

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * processa as filas
   */

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`queue ${job.queue.name}: failed`, err);
  }
}

module.exports = new Queue();
