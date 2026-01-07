import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { neighborhoods } from "@/lib/siteConfig";
import { motion } from "framer-motion";

export function NeighborhoodSection() {
  const displayNeighborhoods = neighborhoods.slice(0, 7);
  
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-[0.3em] uppercase mb-4 text-sm">
            Explore Communities
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              Neighborhood
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From bustling urban centers to serene suburban retreats, find the community that fits your lifestyle.
          </p>
        </motion.div>

        {/* Neighborhoods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayNeighborhoods.map((neighborhood, index) => (
            <motion.div
              key={neighborhood.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/neighborhoods/${neighborhood.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] block shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-[1.02]"
              >
                {/* Background Image with enhanced zoom */}
                <img
                  src={neighborhood.image}
                  alt={`${neighborhood.name} neighborhood`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                  loading="lazy"
                />
                
                {/* Multi-layer luxury overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Animated accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-accent/30 transition-all duration-500" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />

                {/* Content with enhanced styling */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Location pin badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                    <MapPin className="h-3 w-3 text-accent" />
                    <span className="text-xs text-white/90 font-medium">Houston, TX</span>
                  </div>
                  
                  {/* Title with text shadow for readability */}
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transform group-hover:-translate-y-1 transition-transform duration-500">
                    {neighborhood.name}
                  </h3>
                  
                  {/* Description with backdrop */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/5 transform group-hover:-translate-y-1 transition-all duration-500 delay-75">
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-2 drop-shadow-md">
                      {neighborhood.description}
                    </p>
                  </div>

                  {/* Animated CTA */}
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all duration-500">
                    <span className="drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]">Explore Area</span>
                    <div className="w-8 h-8 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                      <ArrowRight className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* View All Card - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              to="/neighborhoods"
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] flex items-center justify-center transition-all duration-700 hover:scale-[1.02] shadow-xl hover:shadow-2xl block"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--accent),0.2),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-20 h-20 border border-white/10 rounded-full group-hover:scale-150 group-hover:border-accent/30 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border border-white/10 rounded-full group-hover:scale-150 group-hover:border-accent/30 transition-all duration-1000 delay-100" />
              
              <div className="text-center p-6 relative z-10">
                <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-3 font-medium">
                  More Areas
                </p>
                <h3 className="font-serif text-2xl font-bold text-white mb-6 drop-shadow-lg">
                  View All<br />Neighborhoods
                </h3>
                <div className="w-14 h-14 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center mx-auto group-hover:bg-accent group-hover:scale-110 transition-all duration-500 border border-accent/30">
                  <ArrowRight className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
