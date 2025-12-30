"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid"; // npm install nanoid
import { asc, desc, eq } from "drizzle-orm";
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
  } catch {
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
  } catch {
    return { success: false, error: "Failed to save message" };
  }
}

export async function getUserChats(userId: string) {
  try {
    const userChats = await db.query.chat.findMany({
      where: eq(chat.userId, userId),
      with: {
        document: true
      },
      orderBy: [desc(chat.createdAt)]
    });
    return { success: true, chats: userChats };
  } catch (error) {
    console.error("Failed to fetch user chats:", error);
    return { success: false, error: "Failed to fetch chats" };
  }
}

export async function getChatMessages(chatId: string) {
  try {
    const messages = await db.query.message.findMany({
      where: eq(message.chatId, chatId),
      orderBy: [asc(message.createdAt)]
    });

    return { success: true, messages: messages }
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function getChat(chatId: string) {
  try {
    const chatSession = await db.query.chat.findFirst({
      where: eq(chat.id, chatId),
      with: {
        document: true
      }
    });

    if (!chatSession) {
      return { success: false, error: "Chat not found" };
    }

    return { success: true, chat: chatSession };
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    return { success: false, error: "Failed to fetch chat" };
  }
}

export async function deleteChatSession(chatId: string) {
  try {
    // 1. Get the chat to find the documentId
    const chatToDelete = await db.query.chat.findFirst({
      where: eq(chat.id, chatId),
    });

    if (!chatToDelete) return { success: false, error: "Chat not found" };

    // 2. Delete the chat (Messages will cascade delete due to schema)
    await db.delete(chat).where(eq(chat.id, chatId));

    // 3. Delete the associated document (orphan cleanup)
    // NOTE: If you plan to have multiple chats per document, removing the document here might be wrong.
    // But for this app's flow (1 doc = 1 chat), it's cleaner to remove the document too.
    await db.delete(document).where(eq(document.id, chatToDelete.documentId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete chat:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}