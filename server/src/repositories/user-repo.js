const CrudRepository = require("./crud-repo");
const User = require("../models/user");

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }
}

module.exports = UserRepository;