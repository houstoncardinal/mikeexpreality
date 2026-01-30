import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  variant?: "footer" | "inline" | "card";
  className?: string;
}

export function NewsletterForm({ variant = "footer", className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Save to leads table
      const { error: dbError } = await supabase.from("leads").insert({
        name: "Newsletter Subscriber",
        email,
        lead_source: "newsletter_signup",
        message: "Subscribed to exclusive listings newsletter",
        status: "new",
      });

      if (dbError) {
        console.error("Error saving newsletter lead:", dbError);
        // Check if it's a duplicate
        if (dbError.code === "23505") {
          toast.info("You're already subscribed! Check your inbox for updates.");
          setIsSuccess(true);
          return;
        }
        throw dbError;
      }

      // Send notification email
      await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: "Newsletter Subscriber",
          email,
          leadSource: "Newsletter Signup",
          message: "New subscriber for exclusive listings newsletter",
        },
      });

      // Track in Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "newsletter_signup", {
          source: variant,
        });
      }

      setIsSuccess(true);
      toast.success("Welcome! You'll receive exclusive listings in your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && variant !== "card") {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className={variant === "footer" ? "text-primary-foreground" : "text-foreground"}>
          You're subscribed! Check your email.
        </span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Get Exclusive Listings</h3>
            <p className="text-xs text-muted-foreground">Be first to see new properties</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              You're subscribed!
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-4 max-w-md mx-auto", className)}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={cn(
          variant === "footer" && "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
        )}
      />
      <Button variant="gold" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
    </form>
  );
}
