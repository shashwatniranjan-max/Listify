const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
    name : {type : String, unique : true, required : true},
    email : {type : String, unique : true, required : true},
    password : {type : String, unique : true, required : true}
})

const todo = new Schema({
    title : String,
    done : Boolean,
    userId : ObjectId
})

const UserModel = mongoose.model("users", user);
const TodoModel = mongoose.model("todos", todo);

module.exports = {
    UserModel,
    TodoModel
}