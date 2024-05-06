import registrationUserQueue from "../lib/Queue.js";

class UserController {
  async create(request, response) {
    const { name, email } = request.body;

    const user = { name, email };

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

    return response.json(user);
  }
}

export default new UserController();
