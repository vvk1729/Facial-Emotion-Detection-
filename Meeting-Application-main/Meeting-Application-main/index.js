const express = require('express');
const app = express();
const path = require('path');
let cookieParser = require("cookie-parser")
let ejs = require("ejs")
let _db = require("./config/db");
const { Server } = require('socket.io');
const httpServer = require("http").createServer(app);
const { AccessToken } = require('livekit-server-sdk');
require("dotenv").config();


let { isLoggedIn } = require("./middleware/auth");



let auth = require("./controllers/authController");
let inMeetingController = require("./controllers/inMeetingController")
let emotionController = require("./controllers/emotionController");


_db.conntectToDB();



const io = new Server(httpServer, {
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



io.on("connection", (socket) => {

    socket.on("call-denied", (data) => {
        io.to(data.socketId).emit("call-denied", data.message)
    })

    socket.on("new-member-joined", (data) => {
        socket.broadcast.emit("new-member-joined", {
            name: data.name,
            memberId: data.memberId,
            joinedMembers: data.joinedMembers
        })
    })

    socket.on("screen-share", (data) => {
        socket.broadcast.emit("screen-share", data)
    })

    socket.on("screen-sharing-stopped", (data) => {
        socket.broadcast.emit("screen-sharing-stopped", data)
    })

    socket.on("leave-meeting", (data) => {
        socket.broadcast.emit("leave-meeting", data)
    })

    // Simple WebRTC signaling for multi-party with host controls
    socket.on("join-room", (data) => {
        socket.join(data.room);
        
        // Store user info
        socket.userName = data.name;
        socket.isHost = data.isHost || false;
        socket.roomName = data.room;
        
        // Get all users in the room
        const room = io.sockets.adapter.rooms.get(data.room);
        const usersInRoom = room ? Array.from(room).map(socketId => {
            const userSocket = io.sockets.sockets.get(socketId);
            return { 
                id: socketId, 
                name: userSocket?.userName || 'Guest',
                isHost: userSocket?.isHost || false
            };
        }) : [];
        
        if (data.isHost) {
            // Check if host already exists
            const existingHosts = usersInRoom.filter(u => u.isHost && u.id !== socket.id);
            if (existingHosts.length > 0) {
                socket.emit("join-denied", { message: "A host is already in this room" });
                socket.disconnect();
                return;
            }
            // Host joins immediately
            socket.emit("all-users", usersInRoom.filter(u => u.id !== socket.id));
            socket.to(data.room).emit("user-connected", { 
                userId: socket.id, 
                name: data.name,
                isHost: true 
            });
        } else {
            // Check room capacity (1 host + 5 participants = 6 max)
            if (usersInRoom.length >= 6) {
                socket.emit("join-denied", { message: "Meeting is full (maximum 6 people)" });
                socket.disconnect();
                return;
            }
            
            // Participant requests permission
            const hosts = usersInRoom.filter(u => u.isHost);
            if (hosts.length > 0) {
                // Ask host for permission
                hosts.forEach(host => {
                    io.to(host.id).emit("join-request", { 
                        userId: socket.id, 
                        name: data.name 
                    });
                });
                socket.emit("waiting-approval", { message: "Waiting for host approval..." });
            } else {
                // No host, deny join
                socket.emit("join-denied", { message: "No host found. Please wait for host to start the meeting." });
                socket.disconnect();
            }
        }
    });

    socket.on("approve-join", (data) => {
        const { userId, room } = data;
        const approvedSocket = io.sockets.sockets.get(userId);
        
        if (approvedSocket) {
            // Get all users for the approved participant
            const roomObj = io.sockets.adapter.rooms.get(room);
            const usersInRoom = roomObj ? Array.from(roomObj).map(socketId => {
                const userSocket = io.sockets.sockets.get(socketId);
                return { 
                    id: socketId, 
                    name: userSocket?.userName || 'Guest',
                    isHost: userSocket?.isHost || false
                };
            }) : [];
            
            // Check capacity again before approving
            if (usersInRoom.length >= 6) {
                io.to(userId).emit("join-denied", { message: "Meeting is now full" });
                approvedSocket.disconnect();
                return;
            }
            
            // Notify approved user
            io.to(userId).emit("join-approved", { users: usersInRoom.filter(u => u.id !== userId) });
            
            // Notify everyone else
            socket.to(room).emit("user-connected", { 
                userId: userId, 
                name: approvedSocket.userName,
                isHost: false 
            });
        }
    });

    socket.on("deny-join", (data) => {
        io.to(data.userId).emit("join-denied", { message: "Host denied your request" });
    });

    socket.on("mute-participant", (data) => {
        io.to(data.userId).emit("force-mute");
    });

    socket.on("mute-all", (data) => {
        socket.to(data.room).emit("force-mute-all");
    });

    socket.on("offer", (data) => {
        io.to(data.to).emit("offer", { from: socket.id, offer: data.offer });
    });

    socket.on("answer", (data) => {
        io.to(data.to).emit("answer", { from: socket.id, answer: data.answer });
    });

    socket.on("ice-candidate", (data) => {
        io.to(data.to).emit("ice-candidate", { from: socket.id, candidate: data.candidate });
    });

    // Emotion alert from host to specific participant
    socket.on("send-emotion-alert", (data) => {
        io.to(data.to).emit("emotion-alert", { emotion: data.emotion });
        console.log(`Emotion alert sent to ${data.to}: ${data.emotion}`);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("user-disconnected", socket.id);
        });
    });

})


// Setup middleware BEFORE routes
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.set("view engine", ejs)
app.set("views", path.join(__dirname, "public/views"))
app.use(express.static(path.join(__dirname, "public/")))


// LiveKit token generation endpoint (no auth required for public meetings)
app.post("/get-token", async (req, res) => {
    const { roomName, participantName } = req.body;
    
    if (!roomName || !participantName) {
        return res.status(400).json({ error: "Room name and participant name are required" });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        return res.status(500).json({ error: "LiveKit credentials not configured" });
    }

    const at = new AccessToken(apiKey, apiSecret, {
        identity: participantName,
    });

    at.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
    });

    const token = at.toJwt();
    
    res.json({ 
        token: token,
        wsUrl: wsUrl 
    });
})


app.get('/', isLoggedIn, (req, res) => { res.redirect("/home") });
app.get("/home", isLoggedIn,  auth.home)

app.get("/login", (req, res) => { res.render("login.ejs") })
app.get("/signup", (req, res) => { res.render("signup.ejs") })
app.post("/login_process", auth.login_process);
app.post("/signup_process", auth.signup_process);
app.get("/logout", auth.logout);

// Simple WebRTC Meeting (works without external CDNs)
app.get("/simple-meeting", (req, res) => {
    res.sendFile(path.join(__dirname, "public/simple-meeting.html"));
});

// Host and Participant Meeting Routes
app.get("/host-meeting.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/host-meeting.html"));
});

app.get("/host-meeting", (req, res) => {
    res.sendFile(path.join(__dirname, "public/host-meeting.html"));
});

app.get("/participant-meeting.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/participant-meeting.html"));
});

app.get("/participant-meeting", (req, res) => {
    res.sendFile(path.join(__dirname, "public/participant-meeting.html"));
});

// LiveKit Meeting Routes (no auth required for public meetings)
app.get("/livekit-meeting", (req, res) => {
    res.sendFile(path.join(__dirname, "public/livekit-meeting.html"));
});

// Emotion Detection Routes
app.post("/detect-emotion", emotionController.detectEmotion);
app.get("/emotion-service-health", emotionController.checkEmotionServiceHealth);

// Legacy PeerJS routes (keeping for backward compatibility)
app.get("/new-meeting", isLoggedIn, inMeetingController.new_meeting)
app.get("/meeting/:id", isLoggedIn, inMeetingController.join_existing_meeting);
app.get("/join-meeting", isLoggedIn, inMeetingController.join_meeting)
app.get("/get-joined-members", isLoggedIn, inMeetingController.get_joined_members);
app.get("/add-members-to-meeting", isLoggedIn, inMeetingController.add_members_to_meeting);
app.get("/add-active-member-to-db", isLoggedIn, inMeetingController.add_active_members_to_db)
app.get("/remove-active-member-from-db", isLoggedIn, inMeetingController.remove_active_members_from_db);
app.get("/get-active-members", isLoggedIn, inMeetingController.get_active_members)
app.get("/remove-meeting-from-db/", isLoggedIn, inMeetingController.remove_meeting_from_db);

app.get("*", (req, res) => {res.send("Error 404")})




httpServer.listen(process.env.express_port || 3000, () => {
    console.log('Server (Main) running on port 3000')
    console.log('LiveKit integration enabled')
});
