import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, Users, Mail } from "lucide-react";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";

import tajMahalImg from "@assets/generated_images/Taj_Mahal_sunrise_hero_2ac0516e.png";
import jaipurImg from "@assets/generated_images/Jaipur_Pink_City_palace_9f7c1941.png";
import keralaImg from "@assets/generated_images/Kerala_backwaters_houseboat_scene_afc0f9db.png";
import varanasiImg from "@assets/generated_images/Varanasi_Ganges_ghats_sunset_0070a7b0.png";
import goaImg from "@assets/generated_images/Goa_beach_sunset_paradise_5959d8a4.png";
import himalayasImg from "@assets/generated_images/Himalayan_mountains_pristine_peaks_67a6bf52.png";
import mumbaiImg from "@assets/generated_images/Gateway_of_India_Mumbai_4c82f40b.png";
import rajasthanImg from "@assets/generated_images/Rajasthan_desert_fort_majestic_ad2319e2.png";

const popularPlaces = [
  {
    name: "Taj Mahal",
    location: "Agra",
    importance: "UNESCO World Heritage Site and one of the Seven Wonders of the World. A magnificent white marble mausoleum symbolizing eternal love.",
    image: tajMahalImg,
    category: "Historical"
  },
  {
    name: "Jaipur - Pink City",
    location: "Rajasthan",
    importance: "The capital of Rajasthan known for its stunning pink-hued architecture, royal palaces, and vibrant culture.",
    image: jaipurImg,
    category: "Cultural"
  },
  {
    name: "Kerala Backwaters",
    location: "Kerala",
    importance: "A network of tranquil lagoons and lakes offering unique houseboat experiences through lush tropical landscapes.",
    image: keralaImg,
    category: "Nature"
  },
  {
    name: "Varanasi",
    location: "Uttar Pradesh",
    importance: "One of the oldest living cities in the world and the spiritual capital of India, located on the banks of the sacred Ganges River.",
    image: varanasiImg,
    category: "Spiritual"
  },
  {
    name: "Goa Beaches",
    location: "Goa",
    importance: "Famous for pristine beaches, Portuguese heritage, vibrant nightlife, and a perfect blend of relaxation and adventure.",
    image: goaImg,
    category: "Beach"
  },
  {
    name: "Himalayas",
    location: "Northern India",
    importance: "The world's highest mountain range offering breathtaking landscapes, adventure sports, and serene spiritual retreats.",
    image: himalayasImg,
    category: "Mountains"
  },
  {
    name: "Gateway of India",
    location: "Mumbai",
    importance: "An iconic monument and symbol of Mumbai, built during the British Raj, overlooking the Arabian Sea.",
    image: mumbaiImg,
    category: "Historical"
  },
  {
    name: "Rajasthan Forts",
    location: "Rajasthan",
    importance: "Majestic hill forts showcasing the royal heritage, architectural brilliance, and warrior history of Rajasthan.",
    image: rajasthanImg,
    category: "Historical"
  }
];

const reviews = [
  {
    text: "India exceeded all my expectations! The diversity of culture, landscapes, and people is unmatched. Every region feels like a different country.",
    author: "Sarah Johnson",
    country: "United Kingdom"
  },
  {
    text: "The hospitality and warmth of Indian people made our journey unforgettable. From the Himalayas to the beaches of Goa, every moment was magical.",
    author: "Michael Chen",
    country: "Australia"
  },
  {
    text: "As a solo female traveler, I felt safe and welcomed everywhere. The historical sites are breathtaking and the food is absolutely incredible!",
    author: "Emma Rodriguez",
    country: "Spain"
  },
  {
    text: "The spiritual experience in Varanasi changed my life. India has a way of touching your soul that no other place can.",
    author: "David Thompson",
    country: "Canada"
  }
];

export default function Landing() {
  const { toast } = useToast();
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold font-mono" data-testid="text-logo">
              Exploring India
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" data-testid="button-login">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" data-testid="button-register">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono leading-tight" data-testid="text-hero-title">
                Discover the Magic of India
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
                Experience the vibrant tapestry of culture, history, and natural beauty that makes India one of the world's most captivating destinations. From ancient monuments to pristine beaches, snow-capped mountains to spiritual sanctuaries - your journey begins here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2" data-testid="button-hero-start">
                    <MapPin className="w-5 h-5" />
                    Start Exploring
                  </Button>
                </Link>
                <a href="#popular-places">
                  <Button size="lg" variant="outline" data-testid="button-hero-discover">
                    Discover Places
                  </Button>
                </a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <img 
                src={tajMahalImg} 
                alt="Taj Mahal at sunrise" 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Places Section */}
      <section id="popular-places" className="py-16 sm:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-mono mb-4" data-testid="text-places-title">
              Most Popular Destinations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore India's most iconic and breathtaking locations, each offering unique experiences and unforgettable memories.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularPlaces.map((place, index) => (
              <Card key={index} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-place-${index}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                    data-testid={`img-place-${index}`}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl font-sans" data-testid={`text-place-name-${index}`}>
                      {place.name}
                    </CardTitle>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap" data-testid={`badge-category-${index}`}>
                      {place.category}
                    </span>
                  </div>
                  <CardDescription className="text-sm font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {place.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed" data-testid={`text-place-importance-${index}`}>
                    {place.importance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono" data-testid="text-about-title">
              Why We Created This Platform
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed" data-testid="text-about-content">
              <p>
                India is a land of incredible diversity - from the snow-capped Himalayas to tropical beaches, from ancient temples to modern cities. However, planning a trip to India can be overwhelming for first-time visitors.
              </p>
              <p>
                We created Exploring India to be your trusted companion in discovering this magnificent country. Our platform brings together authentic reviews from fellow travelers, carefully curated destination guides, and practical information to help you plan the perfect Indian adventure.
              </p>
              <p className="font-sans font-medium text-foreground">
                Whether you're seeking spiritual enlightenment, historical wonders, natural beauty, or culinary adventures - we're here to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-mono mb-4" data-testid="text-reviews-title">
              What Travelers Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real experiences from travelers who explored India
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-review-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed italic" data-testid={`text-review-content-${index}`}>
                    "{review.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-sans font-semibold text-primary">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans font-medium text-sm" data-testid={`text-review-author-${index}`}>
                        {review.author}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-review-country-${index}`}>
                        {review.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono mb-4" data-testid="text-contact-title">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions or need travel advice? We're here to help!
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Your full name"
                    {...form.register("name")}
                    data-testid="input-contact-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                    data-testid="input-contact-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    {...form.register("message")}
                    data-testid="input-contact-message"
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={contactMutation.isPending}
                  data-testid="button-contact-submit"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-mono font-semibold mb-2">Exploring India</p>
            <p>Your trusted guide to discovering India's wonders</p>
            <p className="mt-4">© 2024 Exploring India. Helping travelers explore incredible India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
