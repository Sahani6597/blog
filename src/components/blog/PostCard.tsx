import { Link } from "react-router-dom";
import type { Post } from "@/services/blogService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

interface PostCardProps {
  post: Post;
  getCategoryColor: (category?: string) => string;
  formatCategoryText: (category?: string) => string;
}

const PostCard = ({ post, getCategoryColor, formatCategoryText }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    const strippedText = text.replace(/<[^>]*>/g, '');
    return strippedText.length <= maxLength 
      ? strippedText 
      : strippedText.slice(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.cover_image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge className={getCategoryColor(post.category)}>
            {formatCategoryText(post.category)}
          </Badge>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.created_at)}
          </div>
        </div>
        <CardTitle className="mt-2 text-xl hover:text-blog-purple transition-colors">
          <Link to={`/post/${post.slug || post.id}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-gray-600">
          {truncateText(post.content, 150)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-3 w-3 mr-1" />
          {post.author_name}
        </div>
        <Link to={`/post/${post.slug || post.id}`}>
          <Button variant="ghost" size="sm" className="text-blog-purple hover:text-blog-darkPurple">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard; 