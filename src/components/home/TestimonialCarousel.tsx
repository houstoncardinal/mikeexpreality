import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sarah & James Mitchell",
    location: "Sugar Land, TX",
    image: "/imgi_10_7120993268281597033.jpg",
    rating: 5,
    text: "Mike found us our dream home in Sugar Land within 3 weeks! His knowledge of the Houston market is incredible. We couldn't be happier with our new place.",
    homeType: "Single Family Home",
  },
  {
    id: 2,
    name: "David Chen",
    location: "Katy, TX",
    image: "/imgi_12_-7189515740131590123.jpg",
    rating: 5,
    text: "As a first-time buyer, I was nervous about the process. Mike made everything so easy and stress-free. He really takes the time to understand what you're looking for.",
    homeType: "New Construction",
  },
  {
    id: 3,
    name: "The Rodriguez Family",
    location: "Pearland, TX",
    image: "/imgi_13_-3252337621568236283.jpg",
    rating: 5,
    text: "We needed a home near good schools for our kids. Mike's expertise in the area helped us find the perfect neighborhood. Our kids love their new school!",
    homeType: "Family Home",
  },
  {
    id: 4,
    name: "Marcus Thompson",
    location: "Missouri City, TX",
    image: "/imgi_14_1887428145382298790.jpg",
    rating: 5,
    text: "Mike sold our home above asking price in just 5 days! His marketing strategy and negotiation skills are top-notch. Highly recommend!",
    homeType: "Home Seller",
  },
  {
    id: 5,
    name: "Jennifer & Alex Park",
    location: "Cypress, TX",
    image: "/imgi_16_-8442027838136868696.jpg",
    rating: 5,
    text: "Working with Mike was the best decision we made. He went above and beyond, even helping us find contractors after we closed. True professional!",
    homeType: "Luxury Home",
  },
];

interface TestimonialCarouselProps {
  className?: string;
  compact?: boolean;
}

export function TestimonialCarousel({ className, compact = false }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  if (compact) {
    return (
      <div className={cn("relative", className)}>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-primary/30 flex-shrink-0" />
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{currentTestimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < currentTestimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{currentTestimonial.name}</span>
                    <span className="text-xs text-muted-foreground">• {currentTestimonial.location}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === index
                    ? "bg-primary w-4"
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold mb-1">What Our Clients Say</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">5.0 Average Rating</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-background border border-border hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-background border border-border hover:border-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground leading-relaxed mb-4">
                  "{currentTestimonial.text}"
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < currentTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{currentTestimonial.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {currentTestimonial.location}
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {currentTestimonial.homeType}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                currentIndex === index
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
