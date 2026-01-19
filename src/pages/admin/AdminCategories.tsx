import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(500).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load categories");
      return;
    }

    setCategories(data || []);
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!editingId) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);

    let error;
    if (editingId) {
      const result = await supabase
        .from("blog_categories")
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
        })
        .eq("id", editingId);
      error = result.error;
    } else {
      const result = await supabase.from("blog_categories").insert({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
      });
      error = result.error;
    }

    setSaving(false);

    if (error) {
      if (error.message.includes("duplicate")) {
        toast.error("A category with this name or slug already exists");
      } else {
        toast.error("Failed to save category");
      }
      return;
    }

    toast.success(editingId ? "Category updated" : "Category created");
    resetForm();
    fetchCategories();
  };

  const editCategory = (category: Category) => {
    setEditingId(category.id);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure? Posts in this category will be uncategorized.")) {
      return;
    }

    const { error } = await supabase
      .from("blog_categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      toast.error("Failed to delete category");
      return;
    }

    setCategories(categories.filter((c) => c.id !== categoryId));
    toast.success("Category deleted");
  };

  const resetForm = () => {
    form.reset({ name: "", slug: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <Helmet>
        <title>Categories | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="py-6 lg:py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Categories
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize your blog posts with categories
              </p>
            </div>
            {!showForm && (
              <Button variant="royal" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-foreground">
                  {editingId ? "Edit Category" : "New Category"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Category name"
                      {...form.register("name")}
                      onChange={handleNameChange}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="category-slug"
                      {...form.register("slug")}
                    />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this category"
                    rows={2}
                    {...form.register("description")}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="royal" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Categories List */}
          <Card>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No categories yet. Create your first category to organize your blog.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Slug
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-foreground">
                          {category.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {category.slug}
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground line-clamp-1 max-w-xs">
                          {category.description || "—"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
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
    </>
  );
};

export default AdminCategories;
