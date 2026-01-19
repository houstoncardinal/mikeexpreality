import { useEffect, useState, useRef } from "react";
import { Home, Calendar, ThumbsUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * value));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

function StatItem({ icon, value, suffix, label, duration }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        <AnimatedCounter value={value} suffix={suffix} duration={duration} />
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    {
      icon: <Home className="w-8 h-8 text-accent" />,
      value: 150,
      suffix: "+",
      label: "Homes Sold",
    },
    {
      icon: <Calendar className="w-8 h-8 text-accent" />,
      value: 10,
      suffix: "+",
      label: "Years Experience",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-accent" />,
      value: 99,
      suffix: "%",
      label: "Client Satisfaction",
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      value: 200,
      suffix: "+",
      label: "Happy Clients",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-accent font-medium tracking-wider uppercase mb-2">
            Our Track Record
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Results That Speak for Themselves
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by hundreds of families across Houston to help them find their dream homes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              duration={2000 + index * 200}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="gap-2">
            <Link to="/success-stories">
              View Our Success Stories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}