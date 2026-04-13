import { useEffect, useState, useRef } from "react";

interface StatItemProps {
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

function StatItem({ value, suffix, label, duration }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-2 tracking-tight">
        <AnimatedCounter value={value} suffix={suffix} duration={duration} />
      </div>
      <p className="text-muted-foreground text-sm tracking-wide uppercase">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    { value: 500, suffix: "+", label: "Homes Sold" },
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 99, suffix: "%", label: "Client Satisfaction" },
    { value: 50, suffix: "+", label: "5-Star Reviews" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              duration={2000 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
