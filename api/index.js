const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log(
            `Connected to the  database.`
        );
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error(
            `Failed to connect to the  database:`,
            error.stack
        );
        throw error;
    }
};

connectToDatabase();


// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    if (!req.headers['authorization']) return res.sendStatus(401);
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    const tokenWithoutBearer = token.replace('Bearer ', '');

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World!' });
})

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("resigtering error: ", err);
        res.status(500).json({ error: err.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if(!username || !password) return res.status(400).json({ error: 'Please provide username and password' });
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
            res.json({ token, user: {id: user.id, username: user.username} });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const findUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Fetch all users (for connection requests)
app.get('/users', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username FROM users WHERE id != $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/send-request', authenticateToken, async (req, res) => {
    try {
        const { receiver_id, sender_id, message } = req.body;
        if(!receiver_id || !sender_id || !message) {
            const error = new Error('Please provide receiver_id, sender_id and message');
            error.statusCode = 400;
            throw error;
        }
        const receiver = await findUserById(receiver_id);
        if(!receiver) {
            const error = new Error('Receiver not found');
            error.statusCode = 404;
            throw error;
        }

    await pool.query(
            'INSERT INTO connection_requests (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
            [sender_id, receiver_id, message]
        );
        res.status(200).json({
            message: "Request sent successfully",
            success: true,
        });
    }catch (error){
        console.log(error);
        res.status(error.statusCode || 500).json({ error: error.message || "Failed to send request", success:false });
    }

})

app.get('/get-requests', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await pool.query(`SELECT u.username, c.id,c.status, c.message,c.sender_id  FROM connection_requests c JOIN users u ON u.id = c.receiver_id WHERE receiver_id = $1 AND status = 'pending'` ,[userId]);
        res.status(200).json(requests.rows)
    }catch (error){
        console.log(error);
        res.status(error.statusCode || 500).json({ error: error.message || "Failed to get request", success:false });
    }
})

app.post('/accept-request/:request_id', authenticateToken, async (req, res) => {
try {
    const {request_id} = req.params;
    await pool.query(`UPDATE connection_requests SET status = 'accepted' WHERE id = $1`,[request_id]);
    res.status(200).json({
        message: "Request accepted successfully",
        success: true,
    });
}catch (error){
    console.log(error);
    res.status(error.statusCode || 500).json({ error: error.message || "Failed to accept request", success:false });
}
})


// GET FRIENDS:
app.get("/friends", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID from middleware

        const query = `
            SELECT u.id, u.username
            FROM connection_requests cr
                     JOIN users u ON
                (cr.sender_id = u.id AND cr.receiver_id = $1) OR
                (cr.receiver_id = u.id AND cr.sender_id = $1)
            WHERE cr.status = 'accepted';
        `;

        const { rows } = await pool.query(query, [userId]);

        return res.json(rows );
    } catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ error: "Server error" });
    }
});






app.listen(5454, ()=> console.log('Server listening on port 5454'))



const http = require('http').createServer(app);

const io = require('socket.io')(http);

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);


    const userId = socket.handshake.query.userId;

    console.log({userId});

    if(userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    console.log("user socket data", userSocketMap)


    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId];
    });

    socket.on('sendMessage', ({sender_id, receiver_id, message}) => {
        const receiverSocketId = userSocketMap[receiver_id];

        console.log({receiverSocketId})

        if(receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {sender_id, message});
        }
    })
})

http.listen(6000, ()=> console.log('Socket io listening on port 6000'));


app.post('/send-message', authenticateToken, async (req, res) => {
    try {
        const {sender_id, receiver_id, message} = req.body;

        const newMessage = {
            sender_id,
            receiver_id,
            message,
            created_at: new Date().toISOString()
        }
        console.log({newMessage})

        await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
            [sender_id, receiver_id, message]
        );

        const receiverSocketId = userSocketMap[receiver_id];

        if(receiverSocketId){
            console.log("emitting receiver message event to the receiver", receiver_id)
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }else{
            console.log("receiver socket id not found", receiver_id, receiverSocketId)
        }
        res.status(200).json({
            message: "Message save successfully",
            success: true,
        });
    }catch (error){
        console.log(error);
        res.status(error.statusCode || 500).json({ error: error.message || "Failed to send request", success:false });
    }
})

//get message
app.get('/messages', authenticateToken, async (req, res) => {
    try {
const {sender_id, receiver_id} = req.query;
        const messages = await pool.query(
            `SELECT
                 m.id,
                 m.sender_id,
                 sender.username AS sender_username,
                 m.receiver_id,
                 receiver.username AS receiver_username,
                 m.message,
                 m.created_at
             FROM messages m
                      JOIN users sender ON m.sender_id = sender.id
                      JOIN users receiver ON m.receiver_id = receiver.id
             WHERE (m.sender_id = $1 AND m.receiver_id = $2)
                OR (m.sender_id = $2 AND m.receiver_id = $1)
             ORDER BY m.created_at ASC`,
            [sender_id, receiver_id]
        );
        res.status(200).json(messages.rows)
    }catch (error){
        console.log(error);
        res.status(error.statusCode || 500).json({ error: error.message || "Failed to send request", success:false });
    }
}
)



