import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { MapPin } from "lucide-react";
import { z } from "zod";

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      return await apiRequest("POST", "/api/auth/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "Welcome to Exploring India. You can now sign in.",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Username may already be taken.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: RegisterData) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-card">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2" data-testid="button-back-home">
              <MapPin className="w-5 h-5" />
              <span className="font-mono font-bold text-xl">Exploring India</span>
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-mono text-center" data-testid="text-register-title">
              Start Your Journey
            </CardTitle>
            <CardDescription className="text-center">
              Create an account to explore and save your favorite destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  placeholder="Choose a username"
                  {...form.register("username")}
                  data-testid="input-username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...form.register("password")}
                  data-testid="input-password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...form.register("confirmPassword")}
                  data-testid="input-confirm-password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={registerMutation.isPending}
                data-testid="button-submit"
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto font-sans" data-testid="link-login">
                  Sign in here
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
