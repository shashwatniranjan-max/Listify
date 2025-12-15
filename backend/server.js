const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const {UserModel, TodoModel} = require("../db/db")
const MONGO_URL = process.env.MONGO_URL;
const mongoose = require("mongoose");
mongoose.connect(MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err))

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth")
const bcrypt = require("bcrypt")
const validate = require("../Middleware/validation")
const {signupSchema, signinSchema} = require("../validators/auth.validator");
const {createTodoSchema, updateTodoSchema}  = require("../validators/todo.validator")
const errorHandler = require("../Middleware/errorHandler");
app.use(errorHandler)

app.post("/signup", validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ msg: "Signed up" });

  } catch (err) {
    next(err); 
  }
});


app.post("/signin", validate(signinSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(403).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    next(err);
  }
});

app.post("/todo", auth, validate(createTodoSchema), async (req, res, next) => {
  try {
    const { title, done } = req.body;

    await TodoModel.create({
      title,
      done,
      userId: req.userId
    });

    res.json({ msg: "Todo created" });

  } catch (err) {
    next(err);
  }
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId
    }).select("title done _id");
    if(todos.length === 0) return res.json({msg : "todo list is empty", todos : []});
    res.json({
        msg : "todos fetched",
        todos
    })
})

app.put("/me/:id", auth, validate(updateTodoSchema), async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Nothing to update" });
    }

    const todo = await TodoModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.json({ msg: "Updated", todo });

  } catch (err) {
    next(err);
  }
});

app.delete("/delete/:id", auth, async function(req, res) {
    const userId = req.userId;
    const todoId = req.params.id;
    const deletedTodo = await TodoModel.findOneAndDelete({
        userId : userId,
        _id : todoId
    }).select("title done _id");
    if(!deletedTodo) return res.status(404).json({ msg: "Todo not found or you are not authorized to delete it" });
    res.json({msg : "deleted the todo successfully", deletedTodo});
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})