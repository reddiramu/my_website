import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Places table - popular destinations in India
export const places = pgTable("places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  importance: text("importance").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(), // e.g., "historical", "beach", "mountains", "spiritual"
});

// Reviews table - user reviews for places
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  placeId: varchar("place_id").notNull().references(() => places.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Places table - tracks which places users have explored or want to explore
export const userPlaces = pgTable("user_places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  placeId: varchar("place_id").notNull().references(() => places.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // "explored", "upcoming"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  userPlaces: many(userPlaces),
}));

export const placesRelations = relations(places, ({ many }) => ({
  reviews: many(reviews),
  userPlaces: many(userPlaces),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [reviews.placeId],
    references: [places.id],
  }),
}));

export const userPlacesRelations = relations(userPlaces, ({ one }) => ({
  user: one(users, {
    fields: [userPlaces.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [userPlaces.placeId],
    references: [places.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export const insertUserPlaceSchema = createInsertSchema(userPlaces).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["explored", "upcoming"]),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Place = typeof places.$inferSelect;
export type InsertPlace = z.infer<typeof insertPlaceSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type UserPlace = typeof userPlaces.$inferSelect;
export type InsertUserPlace = z.infer<typeof insertUserPlaceSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
