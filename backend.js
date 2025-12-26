import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars, preferring .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config(); // Fallback to .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://swatimk1123_db_user:rJvO5bQP7EWFgvBm@cluster0.qeqcv6c.mongodb.net/?appName=Cluster0";

// Connect to MongoDB
// Note: useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas Cluster0 successfully.");
    }).catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });

// Example Schema
const CaseSchema = new mongoose.Schema({
    patientId: String,
    date: { type: Date, default: Date.now },
    status: String,
    analysisResult: Object,
    notes: String
});

const Case = mongoose.model('Case', CaseSchema);

// API Routes
app.get('/api/cases', async (req, res) => {
    try {
        const cases = await Case.find();
        res.json(cases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cases', async (req, res) => {
    try {
        const newCase = new Case(req.body);
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
