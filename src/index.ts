import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import router from "./route";
const bodyParser = require('body-parser');

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5000;

    app.use(
      cors({
        credentials: true,
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Origin", "Content-Type", "Authorization", "Accept"],
        preflightContinue: true,
      })
    );

    app.get("/", (req, res) => {
      res.send("Hello, World! Express on Railways!");
    });


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
      console.log(`Received ${req.method} request for ${req.url}`);
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      next();
    });
    
    app.use("/api/v1", router); //group route

    app.listen(port, () => {
      console.log("Server running on port" + port);
    });
  })
  .catch((error) => console.log(error));
