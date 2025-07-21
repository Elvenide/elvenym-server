
export interface GameStats {
    wins?: number;
    losses?: number;
    info?: Record<string, any>;
}

export interface UserGameData {
    absurdle: GameStats;
    collections: GameStats;
}

export const games: UserGameData = {
    absurdle: {},
    collections: {}
};

export interface User {
    id: string;
    avatar?: string; // Discord avatar URL
    data: UserGameData;
}

export interface Group {
    id: string;
    userIds: string[];
}

export interface Database {
    // Users mapped by Discord user ID
    users: { [id: string]: User };
    // Groups mapped by Discord guild/DM ID
    groups: { [id: string]: Group };
}

export interface AdaptedGroup extends Group {
    users: { [id: string]: User };
}