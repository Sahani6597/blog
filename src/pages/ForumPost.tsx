import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  is_resolved: boolean;
  category: string;
  author_name: string;
  views_count: number;
  replies_count: number;
};

type ForumReply = {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  is_solution: boolean;
  author_name: string;
};

const ForumPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPostAndReplies();
    }
  }, [id]);

  const fetchPostAndReplies = async () => {
    setIsLoading(true);
    try {
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (postError || !postData) {
        navigate('/forum');
        return;
      }

      let author_name = "Anonymous";
      if (postData.author_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', postData.author_id)
          .maybeSingle();
        author_name = profile?.username || author_name;
      }

      setPost({
        ...postData,
        is_resolved: postData.is_resolved || false,
        views_count: postData.views_count || 0,
        author_name,
        replies_count: 0,
      });

      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      let repliesFinal: ForumReply[] = [];
      if (repliesData && repliesData.length > 0) {
        const replyAuthorIds = [
          ...new Set(repliesData.map((r: any) => r.author_id).filter(Boolean)),
        ];
        let authorUsernameMap: { [key: string]: string } = {};
        if (replyAuthorIds.length > 0) {
          const { data: replyProfiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', replyAuthorIds);

          if (replyProfiles) {
            authorUsernameMap = replyProfiles.reduce((acc, curr) => {
              acc[curr.id] = curr.username || 'Anonymous';
              return acc;
            }, {} as { [key: string]: string });
          }
        }
        repliesFinal = repliesData.map((reply: any) => ({
          ...reply,
          is_solution: reply.is_solution ?? false,
          author_name: authorUsernameMap[reply.author_id] || "Anonymous",
        }));
      }

      setReplies(repliesFinal);
    } catch (error) {
      console.error('Error fetching post/replies:', error);
      navigate('/forum');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to reply to posts",
        variant: "destructive"
      });
      return;
    }

    if (!newReply.trim()) {
      toast({
        title: "Empty reply",
        description: "Please write something before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: id,
          content: newReply,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully"
      });
      
      setNewReply("");
      fetchPostAndReplies();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-gray-500">Post not found</h3>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Blog420 Forum`}</title>
        <meta
          name="description"
          content={`${post.content.substring(0, 155)}...`}
        />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${post.title} | Blog420 Forum`} />
        <meta property="og:description" content={post.content.substring(0, 155)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={post.created_at} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${post.title} | Blog420 Forum`} />
        <meta name="twitter:description" content={post.content.substring(0, 155)} />
        
        {/* Schema.org markup for Forum Post */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            "headline": post.title,
            "datePublished": post.created_at,
            "author": {
              "@type": "Person",
              "name": post.author_name
            },
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/CommentAction",
              "userInteractionCount": replies.length
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={post.is_resolved ? "secondary" : "secondary"}>
                    {post.is_resolved ? "Resolved" : "Open"}
                  </Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Posted by {post.author_name} • {formatDate(post.created_at)}
              </div>
              
              <div className="prose max-w-none">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Replies ({replies.length})
          </h2>

          {replies.map((reply) => (
            <Card key={reply.id} className="relative">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-muted-foreground">
                    {reply.author_name} • {formatDate(reply.created_at)}
                  </div>
                  {reply.is_solution && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Solution
                    </Badge>
                  )}
                </div>
                <div className="prose max-w-none">
                  {reply.content}
                </div>
              </CardContent>
            </Card>
          ))}

          {user && (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <Textarea
                    placeholder="Write your reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    rows={4}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ForumPostPage;
