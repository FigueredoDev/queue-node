import Queue from "bull";
import redisConfig from "../../config/redis.js";

const registrationUserQueue = new Queue("registrationMail", redisConfig);

export default registrationUserQueue;
