require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Add this line here, to register your auth routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('Server is running!');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
