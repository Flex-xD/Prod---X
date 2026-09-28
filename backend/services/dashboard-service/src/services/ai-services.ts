import axios from "axios";
import AiCache from "../models/AiCache";
import { toDateKey } from "../utils/date";
import { logger } from "../shared";
import mongoose from "mongoose";
import { FALLBACK_TIPS, systemPrompt } from "../constants";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";


const pickFallbackTip = (userId: string): string => {
    const seed = Array.from(userId).reduce((acc, c) => acc + c.charCodeAt(0), 0) + new Date().getUTCDate();
    return FALLBACK_TIPS[seed % FALLBACK_TIPS.length];
};

const buildFallbackActivityMessage = (summary: {
    tasksCompletedToday: number;
    tasksCreatedToday: number;
    focusSecondsToday: number;
    currentStreak: number;
}): string => {
    const { tasksCompletedToday, tasksCreatedToday, focusSecondsToday, currentStreak } = summary;
    const focusMins = Math.round(focusSecondsToday / 60);

    if (tasksCompletedToday === 0 && tasksCreatedToday === 0 && focusSecondsToday === 0) {
        return currentStreak > 0
            ? `You're on a ${currentStreak}-day streak — start something today to keep it alive!`
            : "Nothing logged yet today. Create a task or start a focus timer to get going.";
    }

    const parts: string[] = [];
    if (tasksCompletedToday > 0) parts.push(`completed ${tasksCompletedToday} task${tasksCompletedToday > 1 ? "s" : ""}`);
    if (focusMins > 0) parts.push(`focused for ${focusMins} min`);
    if (tasksCreatedToday > 0 && tasksCompletedToday === 0) parts.push(`added ${tasksCreatedToday} new task${tasksCreatedToday > 1 ? "s" : ""}`);

    return `Today you've ${parts.join(" and ")}. Keep the streak going!`;
};

const callOpenRouter = async (systemPrompt: string, userPrompt: string): Promise<string | null> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return null;

    try {
        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: OPENROUTER_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 100,
                temperature: 0.9,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
                    "X-Title": "ProdX",
                },
                timeout: 8000,
            }
        );

        const content: string | undefined = response.data?.choices?.[0]?.message?.content;
        return content?.trim() || null;
    } catch (error) {
        logger.error("❌ OpenRouter call failed, falling back : ", { error: (error as Error).message });
        return null;
    }
};

export const aiService = {
    getDailyTip: async (userId: mongoose.Types.ObjectId): Promise<string> => {
        const date = toDateKey();
        const existing = await AiCache.findOne({ userId, date, kind: "tip" });
        if (existing) return existing.content;

        const aiTip = await callOpenRouter(systemPrompt, "Give me today's productivity tip.");
        const content = aiTip || pickFallbackTip(userId.toString());

        const saved = await AiCache.findOneAndUpdate(
            { userId, date, kind: "tip" },
            { content, source: aiTip ? "ai" : "fallback" },
            { upsert: true, new: true }
        );
        return saved.content;
    },

    getDailyActivityMessage: async (
        userId: mongoose.Types.ObjectId,
        summary: { tasksCompletedToday: number; tasksCreatedToday: number; focusSecondsToday: number; currentStreak: number }
    ): Promise<string> => {
        const date = toDateKey();

        const systemPrompt =
            "You are a friendly, upbeat companion inside a productivity app called ProdX. " +
            "Given the user's activity numbers for today, write ONE encouraging sentence (max 24 words) " +
            "summarizing what they've done and gently motivating them. No greeting, no quotes, no emoji, output only the sentence.";

        const userPrompt = `Tasks completed today: ${summary.tasksCompletedToday}. Tasks created today: ${summary.tasksCreatedToday}. Focus minutes today: ${Math.round(summary.focusSecondsToday / 60)}. Current streak: ${summary.currentStreak} days.`;

        const aiMessage = await callOpenRouter(systemPrompt, userPrompt);
        const content = aiMessage || buildFallbackActivityMessage(summary);

        const saved = await AiCache.findOneAndUpdate(
            { userId, date, kind: "activity" },
            { content, source: aiMessage ? "ai" : "fallback" },
            { upsert: true, new: true }
        );
        return saved.content;
    },

    invalidateTodaysActivityMessage: async (userId: mongoose.Types.ObjectId) => {
        await AiCache.deleteOne({ userId, date: toDateKey(), kind: "activity" });
    },
};