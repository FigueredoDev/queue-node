## Criar objeto com a config do email em `src/config/mail`
````javascript
const mailConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

export default mailConfig;
````

## Adicionar variaveis de ambiente do envio de emails no `.env`
````env
MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT=2525
MAIL_USER=3cb1e01a6fbc36
MAIL_PASS=760304129ca12a
````

## adicionar `nodemailer`
````bash
yarn add nodemailer
````

## Criar conexão nodemail em `src/lib/Mail.js`
````javascript
import nodemailer from "nodemailer";
import mailConfig from "../../config/mail.js";

export default nodemailer.createTransport(mailConfig);
````

## Adicionar a função de envio de email no `userController`
````javascript
await Mail.sendMail({
      from: "Queue test <queue@example.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Welcome",
      html: `Welcome, ${user.name}!`,
    });
````

## Instalar o bull
````bash
yarn add bull
````

## Criar o arquivo com as configs do redis em `src/config/redis`
````javascript
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export default redisConfig;
````

## Subir container com `redis`
````bash
docker run --name redis -p 6379:6379 -d -t redis:alpine
````

## Criar a fila do bull em `src/lib`
````javascript
import Queue from "bull";
import redisConfig from "../../config/redis.js";

const registrationUserQueue = new Queue("registrationMail", redisConfig);

export default registrationUserQueue;
````

## Criar arquivo com a execução do job em `src/app/jobs/registrationMailJob`
````javascript
import Mail from "../lib/Mail.js";

const registrationMailJob = async (job) => {
  const { name, email } = job.data;

  try {
    await Mail.sendMail({
      from: "Queue test <queue@example.com>",
      to: `${name} <${email}>`,
      subject: "Welcome",
      html: `Welcome, ${name}!`,
    });
  } catch (error) {
    throw new Error(
      `Failed to send email to ${name} <${email}>: ${error.message}`,
    );
  }
};

export default registrationMailJob;
````

## Criar worker para processar as filas em `src/worker.js`
````javascript
import "dotenv/config";

import registrationUserQueue from "./app/lib/Queue.js";
import registrationMailJob from "./app/jobs/registrationMail.js";

registrationUserQueue.process("registrationMail", registrationMailJob);

console.clear();
console.log("Worker is running...");
````

## Adicionar Script no `package.json` para iniciar o worker
````json
"dev:worker": "node --watch src/worker.js",
````

## Adicionar no `userController` a inserção do job na fila
````javascript
import registrationUserQueue from "../lib/Queue.js";

class UserController {
  async create(request, response) {
    const { name, email } = request.body;

    const user = { name, email };

    // add job to queue
    registrationUserQueue.add("registrationMail", user);

    return response.json(user);
  }
}

export default new UserController();
````

## Caso precise ver os logs de erro, inserir no `src/worker.js`
````javascript
registrationUserQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});
````

## Evento apos completar o job, inserir no `src/worker.js`
````javascript
registrationUserQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});
````

## Instalar o `bull-board` e `bull-boar/express`
````bash
yarn add bull-board @bull-board/express
````

## Adicionar o `bull-board` ao `server.js`
````javascript
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
const port = process.env.APPLICATION_PORT || 3000;

app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(registrationUserQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
````

## Opções de cada job:
### No userController posso passar um objeto com as options do job, exemplo abaixo:
````javascript
const jobOptions = {
  delay: 5000, // delay in milliseconds
  attempts: 3, // number of attempts before failing
  repeat: {
    cron: "*/5 * * * *", // cron expression
    startDate: new Date("2022-01-01T00:00:00"),
    endDate: new Date("2022-01-01T01:00:00"),
    tz: "America/Sao_Paulo", // time zone
  },
};

registrationUserQueue.add("registrationMail", user, jobOptions);
````

# Observações
- Devo usar o redis pois armazenar a fila em memoria é perigoso pois ela é volatil
- O bull me permite trabalhar com prioridade de jobs
- Posso mudar a forma com a fila trabalhao, exemplo: Usar como pilha LIFO(last in, first out), o padrão é FIFO(first in, first out)
- Posso repetir os jobs, definindo a quantidade de repetições com a chave: attemps: 3;
- Posso definir o delay pra inicio do job com a chave: delay
