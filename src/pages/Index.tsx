import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getPosts, type Post } from "@/services/blogService";
import { Helmet } from "react-helmet-async";
import PostCard from "@/components/blog/PostCard";
import CategoryTabs from "@/components/blog/CategoryTabs";
import { getCategoryColor, formatCategoryText } from "@/utils/categoryUtils";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeTab, setActiveTab] = useState(categoryParam || "all");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts(activeTab === 'all' ? undefined : activeTab);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  const handleCategoryChange = (category: string) => {
    setActiveTab(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <>
      <Helmet>
        <title>NextBlog - Insights on Technology, Lifestyle, Business, and More</title>
        <meta 
          name="description" 
          content="Your source for insights on technology, lifestyle, business, and more. Explore expert articles in tech, lifestyle, travel, and more." 
        />
      </Helmet>

      <div className="space-y-8">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blog-darkText">
            Blog420
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your source for insights on technology, lifestyle, business, and more
          </p>
        </section>

        {/* Category Navigation */}
        <section>
          <CategoryTabs 
            activeTab={activeTab} 
            onCategoryChange={handleCategoryChange} 
          />

          {/* Posts Grid */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-purple"></div>
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    getCategoryColor={getCategoryColor}
                    formatCategoryText={formatCategoryText}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-500">No posts found</h3>
                <p className="text-gray-400 mt-2">Check back later for new content</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
