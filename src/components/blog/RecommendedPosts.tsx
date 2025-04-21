import { Link } from "react-router-dom";
import type { Post } from "@/services/blogService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface RecommendedPostsProps {
  posts: Post[];
  getCategoryColor: (category?: string) => string;
  formatCategoryText: (category?: string) => string;
}

const RecommendedPosts = ({ posts, getCategoryColor, formatCategoryText }: RecommendedPostsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h3 className="text-xl font-semibold mb-6">Recommended Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {post.cover_image && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}
            <CardHeader className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(post.category)}>
                  {formatCategoryText(post.category)}
                </Badge>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.created_at)}
                </div>
              </div>
              <Link 
                to={`/post/${post.id}`} 
                className="text-lg font-semibold hover:text-blog-purple transition-colors line-clamp-2"
              >
                {post.title}
              </Link>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecommendedPosts; 