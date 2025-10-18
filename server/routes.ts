import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { insertUserSchema, insertReviewSchema, insertUserPlaceSchema, insertContactMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";

// Extended session data type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "exploring-india-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: data.username,
        password: hashedPassword,
      });

      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get user" });
    }
  });

  // Places Routes
  app.get("/api/places", async (req, res) => {
    try {
      const allPlaces = await storage.getAllPlaces();
      res.json(allPlaces);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch places" });
    }
  });

  app.get("/api/places/:id", async (req, res) => {
    try {
      const place = await storage.getPlaceById(req.params.id);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
      res.json(place);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch place" });
    }
  });

  // Reviews Routes
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      
      // Verify the place exists
      const place = await storage.getPlaceById(data.placeId);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }

      const review = await storage.createReview({
        ...data,
        userId: req.session.userId!,
      });

      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  app.get("/api/reviews/user", requireAuth, async (req, res) => {
    try {
      const userReviews = await storage.getReviewsByUserId(req.session.userId!);
      res.json(userReviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/place/:placeId", async (req, res) => {
    try {
      const placeReviews = await storage.getReviewsByPlaceId(req.params.placeId);
      res.json(placeReviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch reviews" });
    }
  });

  // User Places Routes
  app.get("/api/user-places", requireAuth, async (req, res) => {
    try {
      const userPlacesList = await storage.getUserPlaces(req.session.userId!);
      res.json(userPlacesList);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch user places" });
    }
  });

  app.post("/api/user-places", requireAuth, async (req, res) => {
    try {
      const data = insertUserPlaceSchema.parse(req.body);
      
      // Verify the place exists
      const place = await storage.getPlaceById(data.placeId);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }

      const userPlace = await storage.createUserPlace({
        ...data,
        userId: req.session.userId!,
      });

      res.json(userPlace);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to add place" });
    }
  });

  // Contact Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
