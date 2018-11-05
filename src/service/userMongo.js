const Mongolass = require('mongolass')
const fs = require("fs");
const config = require('../config')
// const mongolass = new Mongolass
// mongolass.connect(config.mongodb)

class UserMongo {
    constructor() {
        this.mongolass = new Mongolass(config.db.usersUrl)
        this.file = this.mongolass.model('users', {
            firstName: { type: 'string'},
            lastName: { type: 'string'},
            userName: { type: 'string'},
            password: { type: 'string'}
        })
        this.file.index({userName: 1}, {unique: true}).exec()    
    }

    async storgeUser( fname_, lname_, uname_, password_) {
        return this.file
            .insertOne({ firstName: fname_, lastName: lname_, userName: uname_, password: password_})
            .exec()
            .then(console.log("data saved"))
            .catch(function (e) {
              console.error(e)
              console.error(e.stack)
            })
    }
    searchUser (uname, password) {
        console.log("searching...", uname);          
            return (this.file
                .findOne({ 'userName': uname, 'password': password })
                .exec())
    }
}

module.exports = UserMongo;

