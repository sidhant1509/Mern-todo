import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/";
const dbName = "mern-todo";
export const collectionName = "todo";
const client = new MongoClient(url);
export const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName)
}