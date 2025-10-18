import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, LogOut, Plus, CheckCircle2, Clock, MessageSquare, Compass } from "lucide-react";
import { useState } from "react";
import type { User, Place, Review, UserPlace } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema, insertUserPlaceSchema, type InsertReview, type InsertUserPlace } from "@shared/schema";
import { z } from "zod";

type PlaceWithReviews = Place & { reviews?: Review[] };
type UserPlaceWithPlace = UserPlace & { place?: Place };

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedPlaceForReview, setSelectedPlaceForReview] = useState<string | null>(null);

  // Fetch current user
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  // Fetch all places
  const { data: places = [], isLoading: placesLoading } = useQuery<PlaceWithReviews[]>({
    queryKey: ["/api/places"],
  });

  // Fetch user's places (explored and upcoming)
  const { data: userPlaces = [], isLoading: userPlacesLoading } = useQuery<UserPlaceWithPlace[]>({
    queryKey: ["/api/user-places"],
    enabled: !!user,
  });

  // Fetch user's reviews
  const { data: userReviews = [], isLoading: reviewsLoading } = useQuery<(Review & { place?: Place })[]>({
    queryKey: ["/api/reviews/user"],
    enabled: !!user,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

  const addUserPlaceMutation = useMutation({
    mutationFn: async (data: InsertUserPlace) => {
      return await apiRequest("POST", "/api/user-places", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-places"] });
      toast({
        title: "Success!",
        description: "Place added to your list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add place.",
        variant: "destructive",
      });
    }
  });

  const reviewForm = useForm<InsertReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      placeId: "",
      userId: "",
      rating: 5,
      comment: ""
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      return await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/places"] });
      setReviewDialogOpen(false);
      reviewForm.reset();
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    }
  });

  const onSubmitReview = (data: InsertReview) => {
    reviewMutation.mutate({
      ...data,
      userId: user!.id,
    });
  };

  const handleAddPlace = (placeId: string, status: "explored" | "upcoming") => {
    if (!user) return;
    addUserPlaceMutation.mutate({
      userId: user.id,
      placeId,
      status,
    });
  };

  const handleOpenReviewDialog = (placeId: string) => {
    setSelectedPlaceForReview(placeId);
    reviewForm.reset({
      placeId: placeId,
      userId: user!.id,
      rating: 5,
      comment: ""
    });
    setReviewDialogOpen(true);
  };

  const exploredPlaces = userPlaces.filter(up => up.status === "explored");
  const upcomingPlaces = userPlaces.filter(up => up.status === "upcoming");
  const explorePlaces = places.filter(p => 
    !userPlaces.some(up => up.placeId === p.id)
  );

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold font-mono" data-testid="text-logo">
              Exploring India
            </h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logoutMutation.mutate()}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-mono mb-2" data-testid="text-welcome">
            Welcome back, {user.username}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Continue your journey through incredible India
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover-elevate transition-all duration-300" data-testid="card-stat-explore">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium">
                Places to Explore
              </CardTitle>
              <Compass className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono" data-testid="text-stat-explore">
                {explorePlaces.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Discover new destinations
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300" data-testid="card-stat-explored">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium">
                Explored Places
              </CardTitle>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono" data-testid="text-stat-explored">
                {exploredPlaces.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Places you've visited
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300" data-testid="card-stat-reviews">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium">
                Your Reviews
              </CardTitle>
              <MessageSquare className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono" data-testid="text-stat-reviews">
                {userReviews.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Reviews you've shared
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300" data-testid="card-stat-upcoming">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sans font-medium">
                Upcoming Trips
              </CardTitle>
              <Clock className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono" data-testid="text-stat-upcoming">
                {upcomingPlaces.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Places you plan to visit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Explore More Places */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold font-mono mb-6" data-testid="text-section-explore">
            Explore More Places
          </h3>
          {placesLoading ? (
            <p className="text-muted-foreground">Loading places...</p>
          ) : explorePlaces.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  You've added all available places! Check back later for new destinations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {explorePlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-explore-${place.id}`}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={place.imageUrl} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg font-sans">{place.name}</CardTitle>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap">
                        {place.category}
                      </span>
                    </div>
                    <CardDescription className="text-sm font-sans flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {place.description}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAddPlace(place.id, "explored")}
                        disabled={addUserPlaceMutation.isPending}
                        data-testid={`button-mark-explored-${place.id}`}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Visited
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleAddPlace(place.id, "upcoming")}
                        disabled={addUserPlaceMutation.isPending}
                        data-testid={`button-mark-upcoming-${place.id}`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Plan Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Explored Places */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-mono" data-testid="text-section-explored">
              Your Explored Places
            </h3>
          </div>
          {userPlacesLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : exploredPlaces.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No explored places yet</p>
                <p className="text-sm text-muted-foreground">
                  Start exploring and mark the places you've visited!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploredPlaces.map((userPlace) => {
                const place = userPlace.place;
                if (!place) return null;
                const hasReviewed = userReviews.some(r => r.placeId === place.id);
                
                return (
                  <Card key={userPlace.id} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-explored-${place.id}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-sans">{place.name}</CardTitle>
                      <CardDescription className="text-sm font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!hasReviewed ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => handleOpenReviewDialog(place.id)}
                          data-testid={`button-add-review-${place.id}`}
                        >
                          <Star className="w-4 h-4" />
                          Add Review
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          ✓ Review submitted
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Your Reviews */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold font-mono mb-6" data-testid="text-section-reviews">
            Your Reviews
          </h3>
          {reviewsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : userReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No reviews yet</p>
                <p className="text-sm text-muted-foreground">
                  Share your experiences by reviewing places you've visited!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {userReviews.map((review) => (
                <Card key={review.id} className="hover-elevate transition-all duration-300" data-testid={`card-review-${review.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg font-sans">
                          {review.place?.name || "Unknown Place"}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Places */}
        <section>
          <h3 className="text-2xl font-bold font-mono mb-6" data-testid="text-section-upcoming">
            Upcoming Trips
          </h3>
          {userPlacesLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : upcomingPlaces.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No upcoming trips planned</p>
                <p className="text-sm text-muted-foreground">
                  Browse places above and mark the ones you want to visit!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingPlaces.map((userPlace) => {
                const place = userPlace.place;
                if (!place) return null;
                
                return (
                  <Card key={userPlace.id} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-upcoming-${place.id}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-sans">{place.name}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap">
                          {place.category}
                        </span>
                      </div>
                      <CardDescription className="text-sm font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed line-clamp-2">
                        {place.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Add Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent data-testid="dialog-add-review">
          <DialogHeader>
            <DialogTitle className="font-mono">Share Your Experience</DialogTitle>
            <DialogDescription>
              Tell us about your visit and help other travelers plan their journey
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-6">
            <input type="hidden" {...reviewForm.register("placeId")} />
            <input type="hidden" {...reviewForm.register("userId")} />
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select 
                onValueChange={(value) => reviewForm.setValue("rating", parseInt(value))}
                defaultValue="5"
              >
                <SelectTrigger data-testid="select-rating">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                  <SelectItem value="2">⭐⭐ Fair</SelectItem>
                  <SelectItem value="1">⭐ Poor</SelectItem>
                </SelectContent>
              </Select>
              {reviewForm.formState.errors.rating && (
                <p className="text-sm text-destructive">{reviewForm.formState.errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea 
                id="comment"
                placeholder="Share your experience, tips, and recommendations..."
                rows={5}
                {...reviewForm.register("comment")}
                data-testid="input-review-comment"
              />
              {reviewForm.formState.errors.comment && (
                <p className="text-sm text-destructive">{reviewForm.formState.errors.comment.message}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                data-testid="button-cancel-review"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={reviewMutation.isPending}
                data-testid="button-submit-review"
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
