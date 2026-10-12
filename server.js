
require('dotenv').config();

const { initDb } = require('./db/connect');
const app = require('./app');

const port = process.env.PORT || 8080;

initDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
    });
