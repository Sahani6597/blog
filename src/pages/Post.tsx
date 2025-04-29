import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Post, Comment } from "@/services/blogService";
import { 
  getPostById, 
  getPostBySlug,
  getCommentsByPostId, 
  addComment,
  getRecommendedPosts 
} from "@/services/blogService";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, MessageSquare, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import RecommendedPosts from "@/components/blog/RecommendedPosts";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>(); // Get the post slug from the URL
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // User info from authentication context
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
          const [fetchedComments, fetchedRecommendedPosts] = await Promise.all([
            getCommentsByPostId(fetchedPost.id),
            fetchedPost.category ? getRecommendedPosts(fetchedPost.category, fetchedPost.id) : Promise.resolve([]),
          ]);
          setComments(fetchedComments);
          setRecommendedPosts(fetchedRecommendedPosts);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, toast]);

  const handleSubmitComment = async () => {
    if (!post || !user || !commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await addComment(post.id, user.id, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been published!",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800 hover:bg-gray-200";

    switch(category.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "lifestyle":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "business":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "travel":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "health":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "education":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case "entertainment":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200";
      case "food":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "personal-development":
        return "bg-teal-100 text-teal-800 hover:bg-teal-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatCategoryText = (category: string | undefined) => {
    if (!category) return "Uncategorized";
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-purple"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
  <title>{post.title}</title>
  <meta
    name="description"
    content={post.content.substring(0, 155).replace(/<[^>]*>/g, '')}
  />

  {/* Open Graph tags */}
  <meta property="og:title" content={post.title} />
  <meta
    property="og:description"
    content={post.content.substring(0, 155).replace(/<[^>]*>/g, '')}
  />
  <meta property="og:image" content={post.cover_image || '/default-og-image.jpg'} />
  <meta property="og:url" content={window.location.href} />
  <meta property="og:type" content="article" />

  {/* Twitter Card tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={post.title} />
  <meta
    name="twitter:description"
    content={post.content.substring(0, 155).replace(/<[^>]*>/g, '')}
  />
  <meta name="twitter:image" content={post.cover_image || '/default-og-image.jpg'} />
</Helmet>


      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blog-purple hover:text-blog-darkPurple transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Posts
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {post.cover_image && (
          <div className="w-full h-80 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {post.category && (
              <Badge className={getCategoryColor(post.category)}>
                {formatCategoryText(post.category)}
              </Badge>
            )}
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(post.created_at)}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="h-4 w-4 mr-1" />
              {post.author_name}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
          
          <div className="prose max-w-none blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      <RecommendedPosts 
        posts={recommendedPosts}
        getCategoryColor={getCategoryColor}
        formatCategoryText={formatCategoryText}
      />

      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </h3>

        {user ? (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-32 mb-4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-8">
            <p className="text-gray-600 mb-2">You need to be logged in to comment</p>
            <Link to="/login">
              <Button variant="outline">Login to Comment</Button>
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-blog-purple" />
                    {comment.username || 'Anonymous'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
                <Separator className="my-2" />
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostPage;
