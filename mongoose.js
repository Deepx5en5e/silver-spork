const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/url-shortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});

const URL = mongoose.model("URL", urlSchema);

app.get("/shorten", async (req, res) => {
  const originalUrl = req.query.url;

  const existingURL = await URL.findOne({ originalUrl });
  if (existingURL) {
    res.json({ shortUrl: existingURL.shortUrl });
    return;
  }

  const shortUrl = shortid.generate();

  const newURL = new URL({ originalUrl, shortUrl });
  await newURL.save();

  res.json({ shortUrl });
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  const url = await URL.findOne({ shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});
