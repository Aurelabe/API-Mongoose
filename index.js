const express = require('express');
const connectDB = require('./mongodb');
const routes = require('./routes');

connectDB();

const app = express();
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
