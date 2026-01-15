import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/siteConfig";
import { getBlogIndexSchemas } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  read_time: number | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
      .order("name");
    setCategories(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        author_name,
        read_time,
        is_featured,
        published_at,
        created_at,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (!error) {
      setPosts((data || []) as BlogPost[]);
    }
    setLoading(false);
  };

  const handleCategoryFilter = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  const filteredPosts = activeCategory === "all"
    ? posts
    : posts.filter((post) => post.blog_categories?.slug === activeCategory);

  const featuredPosts = filteredPosts.filter((post) => post.is_featured);
  const regularPosts = filteredPosts.filter((post) => !post.is_featured);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMMM d, yyyy");
  };

  // Get centralized schemas
  const schemas = getBlogIndexSchemas();

  return (
    <>
      <Helmet>
        <title>Houston Real Estate Blog | Market Reports, Buying & Selling Tips | {siteConfig.name}</title>
        <meta
          name="description"
          content="Expert insights on Houston real estate. Read market reports, neighborhood guides, buying tips, and selling strategies from Houston's top realtors."
        />
        <link rel="canonical" href={`${siteConfig.url}/blog`} />
      </Helmet>

      {/* Centralized Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero */}
        <section className="pt-40 pb-16 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Blog & Insights
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Real Estate Intelligence
                <span className="block text-gradient-silver">From the Experts</span>
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
              <button
                onClick={() => handleCategoryFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.slug
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <section className="py-16 bg-background">
            <div className="container-custom">
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : filteredPosts.length === 0 ? (
          <section className="py-16 bg-background">
            <div className="container-custom text-center">
              <p className="text-muted-foreground text-lg">
                No articles found{activeCategory !== "all" ? " in this category" : ""}. Check back soon!
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="py-16 bg-background">
                <div className="container-custom">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Featured Articles</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {featuredPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow h-full">
                          <div className="aspect-video bg-gradient-to-br from-charcoal to-charcoal-light overflow-hidden">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary to-accent/50" />
                            )}
                          </div>
                          <div className="p-6">
                            {post.blog_categories && (
                              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-4">
                                {post.blog_categories.name}
                              </span>
                            )}
                            <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at || post.created_at)}
                              </span>
                              {post.read_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {post.read_time} min read
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Posts */}
            {regularPosts.length > 0 && (
              <section className="section-padding bg-secondary">
                <div className="container-custom">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                    {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow h-full">
                          <div className="aspect-video overflow-hidden">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                            )}
                          </div>
                          <div className="p-6">
                            {post.blog_categories && (
                              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-4">
                                {post.blog_categories.name}
                              </span>
                            )}
                            <h3 className="font-serif text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author_name || "Houston Elite Team"}
                              </span>
                              {post.read_time && <span>{post.read_time} min read</span>}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default Blog;
