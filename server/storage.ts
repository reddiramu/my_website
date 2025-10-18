// Based on javascript_database blueprint with extensions
import { 
  users, 
  places, 
  reviews, 
  userPlaces,
  contactMessages,
  type User, 
  type InsertUser,
  type Place,
  type InsertPlace,
  type Review,
  type InsertReview,
  type UserPlace,
  type InsertUserPlace,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Places
  getAllPlaces(): Promise<Place[]>;
  getPlaceById(id: string): Promise<Place | undefined>;
  createPlace(place: InsertPlace): Promise<Place>;

  // Reviews
  getReviewsByPlaceId(placeId: string): Promise<Review[]>;
  getReviewsByUserId(userId: string): Promise<(Review & { place: Place })[]>;
  createReview(review: InsertReview): Promise<Review>;

  // User Places
  getUserPlaces(userId: string): Promise<(UserPlace & { place: Place })[]>;
  createUserPlace(userPlace: InsertUserPlace): Promise<UserPlace>;

  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Places
  async getAllPlaces(): Promise<Place[]> {
    return await db.select().from(places);
  }

  async getPlaceById(id: string): Promise<Place | undefined> {
    const [place] = await db.select().from(places).where(eq(places.id, id));
    return place || undefined;
  }

  async createPlace(insertPlace: InsertPlace): Promise<Place> {
    const [place] = await db
      .insert(places)
      .values(insertPlace)
      .returning();
    return place;
  }

  // Reviews
  async getReviewsByPlaceId(placeId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.placeId, placeId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUserId(userId: string): Promise<(Review & { place: Place })[]> {
    const results = await db
      .select({
        review: reviews,
        place: places,
      })
      .from(reviews)
      .innerJoin(places, eq(reviews.placeId, places.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));

    return results.map(r => ({
      ...r.review,
      place: r.place,
    }));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  // User Places - returns UserPlace with populated place data
  async getUserPlaces(userId: string): Promise<(UserPlace & { place: Place })[]> {
    const results = await db
      .select({
        userPlace: userPlaces,
        place: places,
      })
      .from(userPlaces)
      .innerJoin(places, eq(userPlaces.placeId, places.id))
      .where(eq(userPlaces.userId, userId))
      .orderBy(desc(userPlaces.createdAt));

    return results.map(r => ({
      ...r.userPlace,
      place: r.place,
    }));
  }

  async createUserPlace(insertUserPlace: InsertUserPlace): Promise<UserPlace> {
    const [userPlace] = await db
      .insert(userPlaces)
      .values(insertUserPlace)
      .returning();
    return userPlace;
  }

  // Contact Messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
