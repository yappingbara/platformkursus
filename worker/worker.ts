import { Worker, Queue, Job } from 'bullmq';
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label: string) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const NOTIFICATION_QUEUE_NAME = 'notification-queue';

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry terbatas 3 kali
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

export function startWorker() {
  logger.info({ msg: '🚀 Initializing EduPlatform BullMQ Worker...', queue: NOTIFICATION_QUEUE_NAME });

  const worker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job: Job) => {
      const startTime = Date.now();
      const { idempotencyKey, type, recipientUserId, title, body } = job.data;

      logger.info({ msg: 'Processing job', jobId: job.id, attempt: job.attemptsMade + 1, type, idempotencyKey });

      // Kirim Web Push via web-push library...
      logger.info({ msg: 'Job completed', jobId: job.id, durationMs: Date.now() - startTime });
      return { success: true };
    },
    { connection: redisConnection, concurrency: 5 }
  );

  worker.on('completed', (job: Job) => {
    logger.info({ msg: 'Worker event: COMPLETED', jobId: job.id });
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    logger.warn({ msg: 'Worker event: FAILED', jobId: job?.id, error: err.message });
  });

  return worker;
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('worker.ts')) {
  startWorker();
}
