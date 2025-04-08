import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Azure DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      `${AZURE_ENDPOINT}/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01`,
      {
        prompt,
        n: 1,
        size: "1024x1024"
      },
      {
        headers: {
          'api-key': AZURE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ Return the image URL directly
    const imageUrl = response.data.data[0].url;

    res.status(200).json({ photo: imageUrl });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;
