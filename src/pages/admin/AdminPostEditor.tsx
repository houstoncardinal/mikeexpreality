import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  featured_image: z.string().url().optional().or(z.literal("")),
  category_id: z.string().optional(),
  author_name: z.string().max(100).optional(),
  read_time: z.number().min(1).max(120).optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const isEditing = id && id !== "new";

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category_id: "",
      author_name: "",
      read_time: 5,
      is_featured: false,
      is_published: false,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Post not found");
      navigate("/admin/posts");
      return;
    }

    form.reset({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || "",
      content: data.content,
      featured_image: data.featured_image || "",
      category_id: data.category_id || "",
      author_name: data.author_name || "",
      read_time: data.read_time || 5,
      is_featured: data.is_featured || false,
      is_published: data.is_published || false,
    });
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!isEditing || !form.getValues("slug")) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = async (data: PostFormData) => {
    setSaving(true);

    const postData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      featured_image: data.featured_image || null,
      category_id: data.category_id || null,
      author_name: data.author_name || null,
      read_time: data.read_time || 5,
      is_featured: data.is_featured,
      is_published: data.is_published,
    };

    if (data.is_published && !isEditing) {
      postData.published_at = new Date().toISOString();
    }

    if (!isEditing) {
      postData.author_id = user?.id;
    }

    let error;
    if (isEditing) {
      const result = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", id);
      error = result.error;
    } else {
      const result = await supabase.from("blog_posts").insert(postData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      if (error.message.includes("duplicate")) {
        toast.error("A post with this slug already exists");
      } else {
        toast.error("Failed to save post");
      }
      return;
    }

    toast.success(isEditing ? "Post updated" : "Post created");
    navigate("/admin/posts");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "Edit Post" : "New Post"} | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/admin/posts")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                {isEditing ? "Edit Post" : "New Post"}
              </h1>
            </div>
            <Button type="submit" variant="royal" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    {...form.register("title")}
                    onChange={handleTitleChange}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/blog/</span>
                    <Input
                      id="slug"
                      placeholder="post-url-slug"
                      {...form.register("slug")}
                    />
                  </div>
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description for previews and SEO..."
                    rows={3}
                    {...form.register("excerpt")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (HTML)</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here. HTML is supported."
                    rows={20}
                    className="font-mono text-sm"
                    {...form.register("content")}
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h2 className="font-medium text-foreground">Publish Settings</h2>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Published</Label>
                  <Switch
                    id="is_published"
                    checked={form.watch("is_published")}
                    onCheckedChange={(checked) =>
                      form.setValue("is_published", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured</Label>
                  <Switch
                    id="is_featured"
                    checked={form.watch("is_featured")}
                    onCheckedChange={(checked) =>
                      form.setValue("is_featured", checked)
                    }
                  />
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h2 className="font-medium text-foreground">Details</h2>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch("category_id") || ""}
                    onValueChange={(value) => form.setValue("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    placeholder="Author name"
                    {...form.register("author_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    min={1}
                    max={120}
                    {...form.register("read_time", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    placeholder="https://..."
                    {...form.register("featured_image")}
                  />
                </div>
              </Card>
            </div>
          </div>
        </form>
      </AdminLayout>
    </>
  );
};

export default AdminPostEditor;
