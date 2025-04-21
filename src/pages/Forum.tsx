import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  is_resolved: boolean | null;
  views_count: number | null; 
  category: string;
  replies_count: number;
  author_name: string;
};

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data: forumPosts, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!forumPosts) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      const authorIds = [...new Set(forumPosts.map((post: any) => post.author_id))];
      let profilesMap: { [key: string]: string } = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', authorIds);

        if (profiles) {
          profilesMap = profiles.reduce((acc, curr) => {
            acc[curr.id] = curr.username || 'Anonymous';
            return acc;
          }, {} as { [key: string]: string });
        }
      }

      const postIds = forumPosts.map((post: any) => post.id);
      let repliesCountMap: { [key: string]: number } = {};
      if (postIds.length > 0) {
        const { data: replies } = await supabase
          .from('forum_replies')
          .select('post_id, id');

        if (replies) {
          repliesCountMap = replies.reduce((acc, curr) => {
            acc[curr.post_id] = (acc[curr.post_id] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
        }
      }

      const formattedPosts = forumPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author_id: post.author_id,
        created_at: post.created_at,
        is_resolved: post.is_resolved || false,
        views_count: post.views_count || 0,
        category: post.category,
        replies_count: repliesCountMap[post.id] || 0,
        author_name: profilesMap[post.author_id] || "Anonymous",
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Community Forum - Ask Questions & Get Help | NextBlog</title>
        <meta name="description" content="Join our Community Forum to ask questions, share knowledge, and connect with others on technology, lifestyle, and more topics." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
            <p className="text-gray-600">Ask questions and help others</p>
          </div>
          {user && (
            <Button onClick={() => navigate('/forum/new')} size="lg">
              <Plus className="mr-2" />
              Ask a Question
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Link 
                        to={`/forum/post/${post.id}`}
                        className="text-xl font-semibold hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Posted by {post.author_name}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={post.is_resolved ? "secondary" : "secondary"}>
                        {post.is_resolved ? "Resolved" : "Open"}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies_count}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="w-4 h-4" />
                        <span>{post.category}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-500">No questions yet</h3>
            <p className="text-gray-400 mt-2">Be the first to ask a question!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ForumPage;
