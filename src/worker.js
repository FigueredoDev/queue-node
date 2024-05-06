import "dotenv/config";

import registrationUserQueue from "./app/lib/Queue.js";
import registrationMailJob from "./app/jobs/registrationMail.js";

registrationUserQueue.process("registrationMail", registrationMailJob);

console.clear();
console.log("Worker is running...");

registrationUserQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

registrationUserQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});
