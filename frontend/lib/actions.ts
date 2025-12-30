"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid"; // npm install nanoid
import { eq } from "drizzle-orm";
import { chat, document, message } from "./db/schema";



export interface Risk {
  clause: string;
  risk_level: "High" | "Medium" | "Low";
  reason: string;
  suggestion: string;
}

export interface AnalysisResult {
  summary: string;
  risks: Risk[];
  score: number;
  full_text?: string; // It's optional here because we store it in a separate column too
}

// 1. Save the Analyzed Document
export async function saveDocument(
  userId: string,
  fileName: string,
  text: string,
  analysisResult: AnalysisResult,
  score: number
) {
  try {
    const docId = nanoid();

    await db.insert(document).values({
      id: docId,
      userId: userId,
      name: fileName,
      extractedText: text, // Storing the full text for future RAG
      analysis: analysisResult, // Storing the full JSON
      score: score,
    });

    return { success: true, docId };
  } catch (error) {
    console.error("Failed to save doc:", error);
    return { success: false, error: "Failed to save document" };
  }
}

// 2. Create or Get a Chat Session for a Document
export async function createChatSession(userId: string, documentId: string) {
  try {
    // Check if chat already exists for this doc (Optional: remove if you want multiple chats per doc)
    const existingChat = await db.query.chat.findFirst({
        where: (chats, { eq, and }) => and(eq(chats.documentId, documentId), eq(chats.userId, userId))
    });

    if (existingChat) return { success: true, chatId: existingChat.id };

    const chatId = nanoid();
    await db.insert(chat).values({
      id: chatId,
      userId: userId,
      documentId: documentId,
      title: "New Conversation",
    });

    return { success: true, chatId };
  } catch (error) {
    return { success: false, error: "Failed to create chat" };
  }
}

// 3. Save a Message (User or AI)
export async function saveMessage(chatId: string, role: "user" | "assistant", content: string) {
  try {
    await db.insert(message).values({
      id: nanoid(),
      chatId: chatId,
      role: role,
      content: content,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save message" };
  }
}