import express from "express";
import { ConflictException,globalHandlingError,ErrorResponse,BadRequestException,NotFoundException } from "./common/response/error.response.js";
import { env } from "../config/env.service.js";
import { SuccessResponse } from "./common/response/success.response.js";
import { hashData,verifyData } from "./common/middleware/security/encryption.js";
import{databaseConnection} from "./database/connection.js"
import authRouter from "./module/auth/auth.controller.js"
import userRouter from "./module/user/user.controller.js"
import cors from "cors";
export const bootstrap = async () => {

// console.log(await hashData("jnjjnjn"));
// console.log(await verifyData("jnjjnjn", "$2b$10$6aVT9uDoA2Qvo3drpqYhxuEcVWg58dUxQeHOFaPyq/4neZ9ZRdgae"));
 const app = express();
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());
await databaseConnection();

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.get('/check-health', (req, res) => {
res.json({message: "Server is healthy"});
})

// app.get('/test', (req, res) => {
//     SuccessResponse({
//         res,
//         message :"done from sucess response",
//         status: 201,
//         data: {name: "sohaila", age: 22}

//     });
//     // NotFoundException({message: "This is a test error"})
//     res.json({message: "Test api", data});
// })

app.use('{*dummy}', (req, res) => {
res.json({message: "Route not found"});
})
//global handler error
// app.use((err, req, res, next) => {
//     console.error(err);
// res.json({message: "Something went wrong", data: err.message});
// })
app.use(globalHandlingError);

app.listen(env.port, () => {
    console.log("Server is running ");
});

}