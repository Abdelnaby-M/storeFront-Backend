import express, {json} from "express"
import index from './routes/index';
import path from "path";


const app: express.Application = express();
var port: number = 3000;

if (process.env.ENV === "test") {
  port = 3001;
}

app.use(json());


// app.use(routerIndex);
index( app);



app.listen(port, (): void => {
    console.log(`Server is running on port: ${port}`);
});

app.get("/", 
(req: express.Request, res: express.Response): void => {
    res.sendFile(path.join(__dirname, "../index.html"))
  })

export default app
