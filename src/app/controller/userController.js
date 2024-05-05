class UserController {
  async create(request, response) {
    return response.json({ message: "create user" });
  }
}

export default new UserController();
