import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/siteConfig";
import { getBlogPostSchemas, BlogPostSchemaData } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string | null;
  read_time: number | null;
  published_at: string | null;
  created_at: string;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories (
            name,
            slug
          )
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        setError("Failed to load article");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Article not found");
        setLoading(false);
        return;
      }

      setPost(data as BlogPost);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <section className="pt-40 pb-16 bg-background">
          <div className="container-custom max-w-4xl">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <section className="pt-40 pb-16 min-h-screen bg-background">
          <div className="container-custom text-center">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              {error || "Article Not Found"}
            </h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button variant="royal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const publishDate = post.published_at || post.created_at;

  // Convert to BlogPostSchemaData format
  const blogPostSchemaData: BlogPostSchemaData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || post.title,
    content: post.content,
    author: post.author_name || siteConfig.agent.name,
    publishedAt: publishDate,
    featuredImage: post.featured_image || undefined,
    category: post.blog_categories?.name,
    readTime: post.read_time || undefined,
  };

  // Get centralized schemas
  const schemas = getBlogPostSchemas(blogPostSchemaData);

  return (
    <>
      <Helmet>
        <title>{post.title} | {siteConfig.name} Real Estate Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={`${siteConfig.url}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:url" content={`${siteConfig.url}/blog/${post.slug}`} />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:author" content={post.author_name || siteConfig.agent.name} />
        {post.blog_categories && (
          <meta property="article:section" content={post.blog_categories.name} />
        )}
      </Helmet>

      {/* Centralized Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        <article className="pt-40 pb-16 bg-background">
          <div className="container-custom max-w-4xl">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center text-accent hover:text-accent/80 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.blog_categories && (
              <Link
                to={`/blog?category=${post.blog_categories.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4"
              >
                <Tag className="h-3 w-3" />
                {post.blog_categories.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
              {post.author_name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(publishDate), "MMMM d, yyyy")}
              </span>
              {post.read_time && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min read
                </span>
              )}
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video rounded-xl overflow-hidden mb-10">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </Layout>
    </>
  );
};

export default BlogPostPage;
