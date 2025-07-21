import type { Request, Response } from "express";
import { Router } from "express";
import { Db } from "../db/db";
import { games, UserGameData } from "../db/schema";

const app = Router();

// Export data routes

app.get("/group/:group", function getGroup(req: Request, res: Response) {
    const id: string = req.params['group'];
    res.json(
        Db.group(id)
    );
});

app.post("/user", function addUser(req: Request, res: Response) {
    const id: string = req.body.userId;
    const avatar: string|undefined = req.body.avatar;
    const groupId: string = req.body.groupId;

    Db.addUser(id, groupId, avatar);
    res.json({ success: 1 });
});

app.post("/win/add", function incrementWin(req: Request, res: Response) {
    const id: string = req.body.userId;
    const game: string = req.body.game;

    if (!(game in games))
        return res.json({ success: 0 });

    Db.incrementWins(id, game as keyof UserGameData);
    return res.json({ success: 1 });
});

app.post("/loss/add", function incrementLoss(req: Request, res: Response) {
    const id: string = req.body.userId;
    const game: string = req.body.game;

    if (!(game in games))
        return res.json({ success: 0 });

    Db.incrementLosses(id, game as keyof UserGameData);
    return res.json({ success: 1 });
});

app.post("/info", function incrementLoss(req: Request, res: Response) {
    const id: string = req.body.userId;
    const game: string = req.body.game;
    const info: Record<string, any> = req.body.info;

    if (!(game in games))
        return res.json({ success: 0 });

    Db.setInfo(id, game as keyof UserGameData, info);
    return res.json({ success: 1 });
});



export const dataRouter = app;