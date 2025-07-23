import type { Request, Response } from "express";
import express, { static as staticMiddleware } from "express";
import path from "node:path";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use("/", staticMiddleware("dist/client/browser"));

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.resolve("./dist/client/browser/index.html"));
});

const apiProxy = createProxyMiddleware({
    target: "http://localhost:4201/api",
    changeOrigin: true
});
app.use("/api", apiProxy);

app.listen(4200, () => {
    console.log("Client listening at port 4200");
});