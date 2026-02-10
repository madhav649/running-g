import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env";
import { landmarkZoneIds } from "../services/geo";

const connection = new Redis(env.redisUrl, { maxRetriesPerRequest: null });
const captureQueueName = "capture-events";
const landmarkSet = new Set(landmarkZoneIds());

export const captureQueue = new Queue(captureQueueName, { connection });

export const enqueueCaptureEvent = async (payload: Record<string, unknown>): Promise<void> => {
  await captureQueue.add("capture", payload, {
    removeOnComplete: 500,
    removeOnFail: 1000,
    attempts: 3
  });
};

export const startCaptureWorker = (
  onProcessed: (data: { zoneId: string; teamId: string; playerId: string; isLandmark: boolean }) => Promise<void>
): Worker => new Worker(
  captureQueueName,
  async (job) => {
    const data = job.data as { zoneId: string; teamId: string; playerId: string };
    await onProcessed({ ...data, isLandmark: landmarkSet.has(data.zoneId) });
  },
  { connection, concurrency: 100 }
);
