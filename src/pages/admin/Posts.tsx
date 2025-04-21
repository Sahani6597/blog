import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getPosts, deletePost, createPost, updatePost, Post } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/categories";

const AdminPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "technology",
    cover_image: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const handleOpenCreateDialog = () => {
    setSelectedPost(null);
    setFormData({
      title: "",
      content: "",
      category: "technology",
      cover_image: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      cover_image: post.cover_image || "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      if (selectedPost) {
        console.log("Updating post with category:", formData.category);
        const updatedPost = await updatePost(selectedPost.id, {
          title: formData.title,
          content: formData.content,
          category: formData.category as any, // Using the selected category
          cover_image: formData.cover_image || undefined,
        });

        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );

        toast({
          title: "Post updated",
          description: "The post has been updated successfully.",
        });
      } else {
        console.log("Creating post with category:", formData.category);
        const newPost = await createPost({
          title: formData.title,
          content: formData.content,
          category: formData.category as any,
          author_id: user.id,
          author_name: user.username || "Anonymous",
          cover_image: formData.cover_image || undefined,
          excerpt: '',
          featured: false,
        });

        setPosts((prevPosts) => [newPost, ...prevPosts]);

        toast({
          title: "Post created",
          description: "The post has been created successfully.",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: `Failed to ${selectedPost ? "update" : "create"} post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await deletePost(selectedPost.id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== selectedPost.id));

      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryName = BLOG_CATEGORIES.find(c => c.slug === category)?.name || category;
    
    switch(category) {
      case "technology":
        return <Badge className="bg-blue-100 text-blue-800">Technology</Badge>;
      case "lifestyle":
        return <Badge className="bg-purple-100 text-purple-800">Lifestyle</Badge>;
      case "business":
        return <Badge className="bg-green-100 text-green-800">Business</Badge>;
      case "travel":
        return <Badge className="bg-yellow-100 text-yellow-800">Travel</Badge>;
      case "health":
        return <Badge className="bg-red-100 text-red-800">Health & Wellness</Badge>;
      case "education":
        return <Badge className="bg-indigo-100 text-indigo-800">Education</Badge>;
      case "entertainment":
        return <Badge className="bg-pink-100 text-pink-800">Entertainment</Badge>;
      case "food":
        return <Badge className="bg-orange-100 text-orange-800">Food</Badge>;
      case "personal-development":
        return <Badge className="bg-teal-100 text-teal-800">Personal Development</Badge>;
      default:
        return <Badge>{categoryName}</Badge>;
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-blog-purple hover:text-blog-darkPurple">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Manage Posts</h1>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-purple"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{getCategoryBadge(post.category)}</TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>{formatDate(post.created_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(post)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No posts found. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {selectedPost ? "update" : "create"} your post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter post content in HTML format"
                className="min-h-32"
              />
              <p className="text-sm text-gray-500">
                Use HTML tags for formatting: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL (optional)</Label>
              <Input
                id="cover_image"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              "{selectedPost?.title}" and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPosts;
