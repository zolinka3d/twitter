// dependencies

const { v4: uuidv4 } = require("uuid");
const validator = require("validate.js");
const constraints = require("../lib/constraints");
const bcrypt = require("bcrypt");
const DB = require("../lib/db");

let _ = class User {
  constructor() {
    this.created = new Date();
    this.id = uuidv4();
    this.name = {
      first: null,
      last: null,
    };
    this.email = null;
    this.security = {
      passwordHash: null,
    };
    this.banned = false;
  }

  save() {
    // save user to database
    console.log(`User ${this.id} saved to database`);
    DB.write({ data: "hello" });
  }

  find(id) {
    return "";
  }

  setFirstName(firstName) {
    try {
      if (firstName) {
        firstName = firstName.trim().replace(/\s+/g, " ");
      }
      let msg = validator.single(firstName, constraints.name());

      if (msg) {
        return msg;
      } else {
        this.name.first = firstName;
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  setLastName(lastName) {
    try {
      if (lastName) {
        lastName = lastName.trim().replace(/\s+/g, " ");
      }
      let msg = validator.single(lastName, constraints.name);

      if (msg) {
        return msg;
      } else {
        this.name.last = lastName;
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  setEmail(email) {
    try {
      if (email) {
        email = email.trim().replace(/\s+/g, " ");
      }
      let msg = validator.single(email, constraints.email);

      if (msg) {
        return msg;
      } else {
        this.email = email;
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async setPassword(password) {
    try {
      let msg = validator.single(password, constraints.password);

      if (msg) {
        return msg;
      } else {
        // hash password
        this.security.passwordHash = await bcrypt.hash(password, 10);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = _;
