import registrationUserQueue from "../lib/Queue.js";

class UserController {
  async create(request, response) {
    const { name, email } = request.body;

    const user = { name, email };

    registrationUserQueue.add("registrationMail", user);

    return response.json(user);
  }
}

export default new UserController();
