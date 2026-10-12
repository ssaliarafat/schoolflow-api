
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;
let database;
let connectionPromise;

const initDb = async () => {
    if (database) {
        return database;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = (async () => {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('MONGODB_URI is not configured.');
        }

        const newClient = new MongoClient(uri, {
            serverSelectionTimeoutMS: 15000
        });

        try {
            await newClient.connect();

            client = newClient;
            database = client.db('schoolflow');

            console.log('Connected to MongoDB');

            return database;
        } catch (error) {
            await newClient.close().catch(() => { });
            throw error;
        }
    })();

    try {
        return await connectionPromise;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    } finally {
        connectionPromise = undefined;
    }
};

const getDb = () => database;

const closeDb = async () => {
    // Wait for an ongoing connection attempt before closing.
    if (connectionPromise) {
        await connectionPromise.catch(() => { });
    }

    if (client) {
        const clientToClose = client;
        client = undefined;
        database = undefined;

        await clientToClose.close();
    } else {
        database = undefined;
    }
};

module.exports = { initDb, getDb, closeDb };
