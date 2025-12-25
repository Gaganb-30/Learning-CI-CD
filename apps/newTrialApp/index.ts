import express from 'express';

const app = express();

app.get("/", (req, res) => {
  return res.json({
    message: "Hello from newTrialApp",
  });
});

app.listen(3004, () => {
  console.log("Server is running at port : 3004");
});