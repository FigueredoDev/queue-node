import Mail from "../lib/Mail.js";

class UserController {
  async create(request, response) {
    const { name, email } = request.body;

    const user = { name, email };

    // TODO: send a confirmation email to the user
    await Mail.sendMail({
      from: "Queue test <queue@example.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Welcome",
      html: `Welcome, ${user.name}!`,
    });

    return response.json(user);
  }
}

export default new UserController();
