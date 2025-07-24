import Rand, { PRNG } from "rand-seed";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";

interface CollectionsGroup {
    difficulty: number;
	group: string;
    members: [string, string, string, string];
}

// Fetch absurdle answers and guesses
const collections: CollectionsGroup[] = JSON.parse(readFileSync(
    path.resolve("./puzzles/collections.json"),
    "utf-8"
));

// Export data route
export function getCollectionsAnswers(_req: Request, res: Response) {
    // Establish daily random generator
    const seed = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    const randomGen = new Rand(seed, PRNG.sfc32);

    // Create phrase bank
    const phraseBank = new Set();

    // Get today's daily answers
    const group1 = collections[Math.floor(randomGen.next() * collections.length)];
    group1.members.forEach(s => phraseBank.add(s.toUpperCase()));
    let group2 = collections[Math.floor(randomGen.next() * collections.length)];
    while (true) {
        if (group2.members.some(s => phraseBank.has(s.toUpperCase())))
            group2 = collections[Math.floor(randomGen.next() * collections.length)];
        else {
            group2.members.forEach(s => phraseBank.add(s.toUpperCase()));
            break;
        }
    }
    let group3 = collections[Math.floor(randomGen.next() * collections.length)];
    while (true) {
        if (group3.members.some(s => phraseBank.has(s.toUpperCase())))
            group3 = collections[Math.floor(randomGen.next() * collections.length)];
        else {
            group3.members.forEach(s => phraseBank.add(s.toUpperCase()));
            break;
        }
    }
    let group4 = collections[Math.floor(randomGen.next() * collections.length)];
    while (true) {
        if (group4.members.some(s => phraseBank.has(s.toUpperCase())))
            group4 = collections[Math.floor(randomGen.next() * collections.length)];
        else {
            group4.members.forEach(s => phraseBank.add(s.toUpperCase()));
            break;
        }
    }
    let group5 = collections[Math.floor(randomGen.next() * collections.length)];
    while (true) {
        if (group5.members.some(s => phraseBank.has(s.toUpperCase())))
            group5 = collections[Math.floor(randomGen.next() * collections.length)];
        else {
            group5.members.forEach(s => phraseBank.add(s.toUpperCase()));
            break;
        }
    }

    res.json({
        groups: [group1, group2, group3, group4, group5]
    });
};