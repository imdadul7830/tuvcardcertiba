import express from "express";

const app = express();
app.get("/crash", async (req, res) => {
  throw new Error("Application failed to respond simulation");
});

app.listen(8889, () => console.log("running"));
