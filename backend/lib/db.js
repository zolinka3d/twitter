let _ = class DB {
  static localStorage = [];

  static write(data) {
    if (data) {
      this.localStorage.push(data);
      return data;
    }
    return false;
  }

  static findOne(id) {
    if (id) {
      return this.localStorage.find((item) => item.id === id);
    }
    return false;
  }

  static findByEmail(email) {
    let user = false;
    if (email) {
      for (let record of this.localStorage) {
        if (record.email === email) {
          user = record;
          break;
        }
      }
      return user;
    }
  }
};

module.exports = _;
