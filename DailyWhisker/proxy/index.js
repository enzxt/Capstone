/**
 * Sets up an Express server that provides a proxy endpoint for fetching external resources
 * and returns them with CORS headers to the client.
 * 
 * In testing
 */
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).send("Missing 'url' query parameter.");
        }

        const response = await fetch(url);
        if (!response.ok) {
            return res
                .status(response.status)
                .send(`Failed to fetch resource: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        const buffer = await response.buffer();

        res.setHeader("Content-Type", contentType || "application/octet-stream");
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.send(buffer);
    } catch (error) {
        console.error("Error in /proxy route:", error);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
