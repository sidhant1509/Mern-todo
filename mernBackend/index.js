import express from 'express'
import cors from 'cors'
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';
const app = express()
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use(cookieParser());


app.post("/login", async (req, res) => {
    const userData = req.body;
    if (userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users')
        const result = await collection.findOne({ email: userData.email, password: userData.password });
        if (result) {
            jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '5d' }, (error, token) => {
                res.send({
                    success: true,
                    msg: 'login done',
                    token
                })
            })
        } else {
            res.send({
                success: false,
                msg: 'user not found',
            })
        }
    } else {
        res.send({
            success: false,
            msg: 'login not done',
        })
    }
})

app.post("/signup", async (req, res) => {
    const userData = req.body;
    if (userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users')
        const result = await collection.insertOne(userData);
        if (result) {
            jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '5d' }, (error, token) => {
                res.send({
                    success: true,
                    msg: 'signup done',
                    token
                })
            })
        }
    } else {
        res.send({
            success: false,
            msg: 'signup not done',
        })
    }
})

app.post('/add-task', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const result = await collection.insertOne(req.body);
    if (result) {
        res.send({ message: 'new task added', success: true, result })
    } else {
        res.send({ message: 'task not added', success: false })
    }
})

app.get('/tasks', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const result = await collection.find().toArray();
    if (result) {
        res.send({ message: 'tasks lists fetched', success: true, result })
    } else {
        res.send({ message: 'error', success: false })
    }
})

app.get('/task/:id', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const id = req.params.id
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (result) {
        res.send({ message: 'tasks  fetched', success: true, result })
    } else {
        res.send({ message: 'error', success: false })
    }
})

app.put('/update-task', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const { _id, ...fields } = req.body;
    const update = { $set: fields }
    // console.log(fields)

    const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
    if (result) {
        res.send({ message: 'tasks data update ', success: true, result })
    } else {
        res.send({ message: 'error', success: false })
    }
})

app.delete('/delete/:id', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const id = req.params.id
    const collection = await db.collection(collectionName)
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result) {
        res.send({ message: 'tasks deleted', success: true, result })
    } else {
        res.send({ message: 'error not deleted', success: false })
    }
})

app.delete('/delete-multiple', verifyJWTToken, async (req, res) => {
    const db = await connection()
    const Ids = req.body;
    const deleteTaskIds = Ids.map((item) => new ObjectId(item))
    console.log(Ids)

    const collection = await db.collection(collectionName)
    const result = await collection.deleteMany({ _id: { $in: deleteTaskIds } });
    if (result) {
        res.send({ message: 'tasks deleted', success: result, })
    } else {
        res.send({ message: 'error not deleted', success: false })
    }
})

function verifyJWTToken(req, res, next) {
    console.log("verifyJWTToken", req.cookies["token"]);
    const token = req.cookies['token'];
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.send({
                msg: "invalid token",
                success: false
            })
        }
        next()
    })
}

app.listen(3200);