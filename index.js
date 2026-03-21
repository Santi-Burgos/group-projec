import { corsMiddleware } from './middlewares/cors.js';
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';
import Message from './models/msgModel.js';
import { authenticateSocket } from './middlewares/socketAuthMiddleware.js';
import {Server as WebSocketServer} from 'socket.io';
import http from 'http';

const app = express();


const PORT = 3000;

app.use(cookieParser());

app.use(corsMiddleware()); 
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = http.createServer(app)
const io = new WebSocketServer(server,{
    cors: {
    origin: ['http://localhost:3001', 'https://chatgrupal.netlify.app'],
    methods: ['GET', 'POST'], 
    credentials: true
    }

})

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use('/user', router);

io.use(authenticateSocket);

io.on("connection", (socket) => {

    socket.on("joinRoom", (groupID) => {
        socket.join(groupID);
        console.log(`📌 Usuario ${socket.user?.id_user} unido al grupo: ${groupID}`);
    });

    socket.on("leaveRoom", (groupID) => {
        socket.leave(groupID);
        console.log(`👋 Usuario ${socket.user?.id_user} salió del grupo: ${groupID}`);
    });

    socket.on("sendMessage", async ({ groupID, msg_body }) => {
        try {
            const userID = socket.user?.id_user;
    
            if (!userID) {
                console.error("❌ No se pudo obtener el userID del socket.");
                return;
            }
            await Message.sendMessage({ userID, groupID, msg_body });
            const updatedMessages = await Message.getMessage(groupID);
            io.to(groupID).emit("receiveMessage", updatedMessages);

        } catch (err) {
            console.error("❌ Error en sendMessage (socket):", err);
        }
    });
});


server.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto http://localhost:${PORT}`);
});
