import Rand, { PRNG } from "rand-seed";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";

// Fetch absurdle answers and guesses
const answerPossibilities = JSON.parse(readFileSync(
    path.resolve("./puzzles/absurdle_answers.json"),
    "utf-8"
));
const guesses = JSON.parse(readFileSync(
    path.resolve("./puzzles/absurdle_guesses.json"),
    "utf-8"
));

// Export data route
export function getAbsurdleWords(_req: Request, res: Response) {
    // Establish daily random generator
    const seed = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    const randomGen = new Rand(seed, PRNG.sfc32);

    // Get today's daily answer
    const answer = answerPossibilities[Math.floor(randomGen.next() * answerPossibilities.length)];

    res.json({
        answer,
        guesses
    });
};