import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

const _dirname = path.resolve();

app.use(cors({
    origin: "https://convonest-mn3l.onrender.com",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import contactRouter from "./routes/contact.routes.js"
import messageRouter from "./routes/message.routes.js"
import channelRouter from "./routes/channel.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/contacts", contactRouter)
app.use("/api/v1/messages", messageRouter)
app.use("/api/v1/channels", channelRouter)

app.use(express.static(path.join(_dirname, "/client/dist")))
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"))
})

export {app}