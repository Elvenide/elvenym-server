import express from "express";
import fetch from "node-fetch";

import { getAbsurdleWords } from "./routes/absurdle";
import { getCollectionsAnswers } from "./routes/collections";
import { dataRouter } from "./routes/data";
import "./routes/client";

const app = express();
const port = 4201;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env['DISCORD_CLIENT_ID'],
      client_secret: process.env['DISCORD_CLIENT_SECRET'],
      grant_type: "authorization_code",
      code: req.body.code,
    } as Record<string, string>),
  });

  // Retrieve the access_token from the response
  const { access_token } = (await response.json() as any);

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.use("/api/data", dataRouter);
app.get("/api/absurdle/words", getAbsurdleWords);
app.get("/api/collections/answers", getCollectionsAnswers);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
