import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { neighborhoods } from "@/lib/siteConfig";
import { motion } from "framer-motion";

export function NeighborhoodSection() {
  const displayNeighborhoods = neighborhoods.slice(0, 8);
  
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-custom">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-accent font-medium tracking-widest uppercase mb-3 text-xs">
              Communities
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Explore Neighborhoods
            </h2>
          </div>
          <Link 
            to="/neighborhoods"
            className="group flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View All Areas
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayNeighborhoods.map((neighborhood, index) => (
            <motion.div
              key={neighborhood.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/neighborhoods/${neighborhood.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] block"
              >
                <img
                  src={neighborhood.image}
                  alt={`${neighborhood.name} homes for sale`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    {neighborhood.name}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-1">
                    {neighborhood.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
