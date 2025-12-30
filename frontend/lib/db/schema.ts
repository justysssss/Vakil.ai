import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

// User table for Better Auth
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Session table for Better Auth
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

// Account table for OAuth providers
export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Verification table for email verification
export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const document = pgTable("document", {
    id: text("id").primaryKey(), // Generate a CUID or UUID here
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    
    name: text("name").notNull(), // e.g. "Contract_v1.pdf"
    fileUrl: text("file_url"), // Optional: If you upload to AWS S3/Uploadthing later
    
    // This stores the raw text extracted from PDF for RAG context
    extractedText: text("extracted_text"), 
    
    // Stores the JSON result from your /analyze endpoint (Risks, Summary)
    // We use jsonb for efficient querying if needed later
    analysis: jsonb("analysis"), 
    
    // Store the safety score (0-100) for easy dashboard sorting
    score: integer("score"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 2. Chat: Represents a conversation thread about a specific document
export const chat = pgTable("chat", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    documentId: text("document_id")
        .notNull()
        .references(() => document.id, { onDelete: "cascade" }),
    
    title: text("title"), // e.g. "Question about Non-Compete"
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 3. Message: The actual messages inside a chat
export const message = pgTable("message", {
    id: text("id").primaryKey(),
    chatId: text("chat_id")
        .notNull()
        .references(() => chat.id, { onDelete: "cascade" }),
    
    role: text("role").notNull(), // 'user' or 'assistant'
    content: text("content").notNull(), // The actual text message
    
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- OPTIONAL: RELATIONS DEFINITIONS (If you use Drizzle Queries) ---

export const usersRelations = relations(user, ({ many }) => ({
	documents: many(document),
    chats: many(chat),
}));

export const documentsRelations = relations(document, ({ one, many }) => ({
	user: one(user, {
		fields: [document.userId],
		references: [user.id],
	}),
    chats: many(chat),
}));

export const chatsRelations = relations(chat, ({ one, many }) => ({
    document: one(document, {
        fields: [chat.documentId],
        references: [document.id]
    }),
    user: one(user, {
        fields: [chat.userId],
        references: [user.id]
    }),
    messages: many(message)
}));

export const messagesRelations = relations(message, ({ one }) => ({
    chat: one(chat, {
        fields: [message.chatId],
        references: [chat.id]
    })
}));