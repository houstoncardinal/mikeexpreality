import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "1",
    title: "Houston Real Estate Market Report: January 2025",
    excerpt: "A comprehensive analysis of Houston's real estate market trends, pricing data, and forecasts for the year ahead.",
    category: "Market Reports",
    author: "Houston Elite Team",
    date: "January 3, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "2",
    title: "Top 10 Neighborhoods for First-Time Homebuyers in Houston",
    excerpt: "Discover the best neighborhoods for first-time buyers with affordable homes, great schools, and strong appreciation potential.",
    category: "Neighborhood Guides",
    author: "Sarah Johnson",
    date: "December 28, 2024",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "3",
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Expert tips on staging your home to attract buyers and maximize your sale price in the competitive Houston market.",
    category: "Seller Tips",
    author: "Michael Chen",
    date: "December 20, 2024",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: "4",
    title: "Understanding Houston's Property Tax System",
    excerpt: "Everything you need to know about property taxes in Harris County and surrounding areas, including exemptions and protests.",
    category: "Buyer Resources",
    author: "Houston Elite Team",
    date: "December 15, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: "5",
    title: "Sugar Land vs Katy: Which Suburb Is Right for You?",
    excerpt: "A detailed comparison of two of Houston's most popular suburbs, including schools, amenities, and home prices.",
    category: "Neighborhood Guides",
    author: "Jennifer Martinez",
    date: "December 10, 2024",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: "6",
    title: "Investment Properties in Greater Houston: 2025 Guide",
    excerpt: "Where to invest in Houston real estate for maximum ROI, including emerging neighborhoods and rental market analysis.",
    category: "Investment",
    author: "David Chen",
    date: "December 5, 2024",
    readTime: "12 min read",
    featured: false,
  },
];

const categories = ["All", "Market Reports", "Neighborhood Guides", "Buyer Resources", "Seller Tips", "Investment"];

const Blog = () => {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <>
      <Helmet>
        <title>Houston Real Estate Blog | Market Reports, Buying & Selling Tips | Houston Elite</title>
        <meta
          name="description"
          content="Expert insights on Houston real estate. Read market reports, neighborhood guides, buying tips, and selling strategies from Houston's top realtors."
        />
        <link rel="canonical" href="https://houstonelite.com/blog" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Blog & Insights
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Real Estate Intelligence
                <span className="block text-gradient-gold">From the Experts</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                Market insights, neighborhood guides, and expert advice to help you make informed real estate decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background border-b border-border sticky top-20 z-40">
          <div className="container-custom">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground first:bg-accent first:text-accent-foreground"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-charcoal to-charcoal-light" />
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-4">
                      {post.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-secondary to-muted" />
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-4">
                      {post.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </Layout>

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Houston Elite Real Estate Blog",
          description: "Expert insights on Houston real estate market",
          url: "https://houstonelite.com/blog",
          publisher: {
            "@type": "Organization",
            name: "Houston Elite Real Estate",
          },
        })}
      </script>
    </>
  );
};

export default Blog;
