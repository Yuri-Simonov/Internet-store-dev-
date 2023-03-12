import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
	.connect(
		"mongodb+srv://Admin:Admin@clustertest2023.ahvxudd.mongodb.net/internet_store_2023?retryWrites=true&w=majority"
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB err", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
	res.send("Hello fucking world!");
});

app.post(
	"/auth/login",
	loginValidation,
	handleValidationErrors,
	UserController.login
);
app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
);

app.listen(4444, (err) => {
	if (err) return console.log(err);

	console.log("Сервер был запущен на порту: 4444");
});
