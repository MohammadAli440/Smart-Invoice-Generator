import { configure } from 'ts-node';
configure({});
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { ScheduledService } from '../scheduled/scheduled.service';

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/invoice';
  await mongoose.connect(uri);
  const svc = new ScheduledService();
  console.log('Scheduler started. Poll interval:', process.env.SCHEDULER_POLL_MS || 30000);
  setInterval(async () => {
    try {
      const res = await svc.runDue();
      if (res?.processed) console.log('Processed scheduled sends:', res.processed);
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }, Number(process.env.SCHEDULER_POLL_MS || 30000));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});