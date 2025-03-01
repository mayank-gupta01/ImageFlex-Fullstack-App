import dotenv from "dotenv"
import express, { Request, Response, Application } from "express"
import cors from 'cors'

dotenv.config();


const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cors());

//import routes
import { imageRouter } from "./routes/imageop.routes";

//routes declaration
app.use("/api/v1/image", imageRouter)


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});