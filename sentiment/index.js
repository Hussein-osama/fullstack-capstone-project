require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
// Task 1: import the natural library
const natural = require('natural');

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

app.post('/sentiment', async (req, res) => {

    // Task 4: extract the sentence parameter
    const { sentence } = req.query;

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Task 5: Set sentiment to negative or positive based on score rules
        if (analysisResult > 0) {
            sentiment = "positive";
        } else if (analysisResult < 0) {
            sentiment = "negative";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);

        // Task 6: Send a status code of 200 with both sentiment score and sentiment text
        res.status(200).json({
            sentimentScore: analysisResult,
            sentiment: sentiment
        });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        // Task 7: If there is an error, return an HTTP code of 500 and the JSON message
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});


app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
