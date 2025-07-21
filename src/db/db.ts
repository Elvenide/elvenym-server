import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { AdaptedGroup, Database, games, GameStats, UserGameData } from "./schema";

// Fetch data file

const dataPath = path.resolve("./data/db.json");
if (!existsSync(dataPath))
    writeFileSync(dataPath, JSON.stringify({ users: {}, groups: {} }));
const dataFile: Database = JSON.parse(readFileSync(
    dataPath,
    "utf-8"
));

// Data access utility

export class Db {
    private static save() {
        writeFileSync(dataPath, JSON.stringify(dataFile, null, "\t"), "utf-8");
    }

    private static user(id: string) {
        return dataFile.users[id];
    }

    public static group(id: string) {
        const group: AdaptedGroup = {
            ...dataFile.groups[id],
            users: {}
        };

        for (const userId of group.userIds)
            group.users[userId] = this.user(userId);
        
        return group;
    }

    private static stats(userId: string) {
        return this.user(userId).data;
    }

    public static incrementWins(userId: string, game: keyof UserGameData) {
        const gameData: UserGameData = this.stats(userId);
        gameData[game].wins = (gameData[game].wins ?? 0) + 1;
        dataFile.users[userId].data = gameData;
        this.save();
    }

    public static incrementLosses(userId: string, game: keyof UserGameData) {
        const gameData: UserGameData = this.stats(userId);
        gameData[game].losses = (gameData[game].losses ?? 0) + 1;
        dataFile.users[userId].data = gameData;
        this.save();
    }

    public static setInfo(userId: string, game: keyof UserGameData, info: Record<string, any>) {
        const gameData: UserGameData = this.stats(userId);
        gameData[game].info = info;
        dataFile.users[userId].data = gameData;
        this.save();
    }

    private static addGroup(groupId: string, userId: string) {
        if (!(groupId in dataFile.groups) || !dataFile.groups[groupId])
            dataFile.groups[groupId] = {
                id: groupId,
                userIds: [userId]
            };
        else if (!dataFile.groups[groupId].userIds.includes(userId))
            dataFile.groups[groupId].userIds.push(userId);
    } 

    public static addUser(userId: string, groupId: string, avatar?: string) {
        this.addGroup(groupId, userId);
        
        if (!(userId in dataFile.users) || !dataFile.users[userId]) {
            // Create new user with new data

            const newGameData: Record<string, GameStats> = {};
            for (const key in games)
                newGameData[key] = {};
            const gameData = newGameData as Record<keyof UserGameData, GameStats>;
            
            dataFile.users[userId] = {
                id: userId,
                avatar,
                data: gameData
            };
        }
        else
            dataFile.users[userId].avatar = avatar;

        this.save();
    }
}