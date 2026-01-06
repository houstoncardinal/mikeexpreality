import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  published_at: string | null;
  blog_categories: {
    name: string;
  } | null;
}

const AdminPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load posts");
      return;
    }

    setPosts((data || []) as BlogPost[]);
    setLoading(false);
  };

  const togglePublish = async (postId: string, currentState: boolean) => {
    const updates: any = {
      is_published: !currentState,
    };
    if (!currentState) {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", postId);

    if (error) {
      toast.error("Failed to update post");
      return;
    }

    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
    toast.success(currentState ? "Post unpublished" : "Post published");
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast.error("Failed to delete post");
      return;
    }

    setPosts(posts.filter((post) => post.id !== postId));
    toast.success("Post deleted");
  };

  return (
    <>
      <Helmet>
        <title>Blog Posts | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Blog Posts</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your blog content
              </p>
            </div>
            <Link to="/admin/posts/new">
              <Button variant="royal">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>

          <Card>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No blog posts yet. Create your first post to get started.
                </p>
                <Link to="/admin/posts/new">
                  <Button variant="royal">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Title
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {post.title}
                            </p>
                            {post.is_featured && (
                              <Badge variant="secondary" className="mt-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {post.blog_categories?.name || "Uncategorized"}
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            variant={post.is_published ? "default" : "secondary"}
                            className={
                              post.is_published
                                ? "bg-emerald-100 text-emerald-800"
                                : ""
                            }
                          >
                            {post.is_published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {format(new Date(post.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                togglePublish(post.id, post.is_published)
                              }
                              title={
                                post.is_published ? "Unpublish" : "Publish"
                              }
                            >
                              {post.is_published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Link to={`/admin/posts/${post.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePost(post.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminPosts;
