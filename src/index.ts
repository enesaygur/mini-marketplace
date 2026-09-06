import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Mini Marketplace çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
