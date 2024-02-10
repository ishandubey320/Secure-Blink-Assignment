const bcrypt = require("bcryptjs");
class User {
  constructor(email, password, roles = "user") {
    this.email = email;
    this.password = password;
    this.roles = roles;

    this.hashPassword = async () => {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    };

    this.isValidPassword = async (password) => {
      return await bcrypt.compare(password, this.password);
    };
  }
}

let users = []; // Array to hold user objects

// Function to add a new user
async function addUser(email, password, roles) {
  console.log({ email, password, roles });
  const user = new User(email, password, roles);
  await user.hashPassword();
  users.push(user);
  return user;
}

async function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

module.exports = { addUser, findUserByEmail };
