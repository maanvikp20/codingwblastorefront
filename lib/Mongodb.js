import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ""

if(!MONGODB_URI){throw new Error('Define a MONGODB_URI in .env.local')}
// Check for env for later connection string use
let cached = global.mongoose
if(!cached){cached = global.mongoose = {conn:null, promise:null}}
// Assigning global default mongoose caching

async function connectDB(){
    if(cached.conn) return cached.conn
    // If there is already a cached connection, use it
    if(!cached.promise){
        cached.promise = mongoose
            .connect(MONGODB_URI, {bufferCommands: false})
            .then((m) => m)
    }
    // If there is no cached connection, use this promise and mongodb_uri to make a new connection

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB