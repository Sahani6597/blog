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
        <title>Blog420 - Daily Updates on News, Sports, Politics & More</title>
        <meta name="description" content="Blog420 delivers reliable and engaging content on current events, politics, sports, tech, lifestyle, and more. Stay informed with fresh insights and community-driven discussions." />
        <meta name="keywords" content="Blog420, news blog, sports updates, political analysis, tech news, lifestyle tips, trending topics, daily blog, current affairs" />
        <meta name="author" content="Blog420 Editorial Team" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        <meta property="og:title" content="Blog420 - Your Daily Dose of Insightful Content" />
        <meta property="og:description" content="Explore trending news, in-depth articles, and real opinions on sports, politics, tech, and more. Join the conversation on Blog420." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blog420.vercel.app/" />
        <meta property="og:image" content="https://media-hosting.imagekit.io/eae9f0b2b67140e2/screenshot_1746028551189.png?Expires=1840636551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GkdPRgul9YhHY6EKECSWqr8X9Jfrx0kf1Y4LbcjnRuRDVr--uH5grBG7K2jO6KIh08EladLGswW3HYWsrE4D82zyPYQOjgXaVgRdj3TFAPxPGjGthoRYZEJdBKlPGg8G4R7je9y1XAC~TBZC7IrJW4g0iP5VzKLjB1uyWrFqVnVWxVyXI0hFvxJNkgwdG-zxS4f4A2LjEu14QAO2wnKJ4yPmf7GUsprf~V-~0zg7Qqx~qRcNV8zcBHo4xWNW~GZlmS0Yd6FY5TNiHTuyv~RlI5dnOxj689I9NNjrw4uquham7VexJFEZ1Rn8ByCAx9patYvkKXdaAgSRpEYnLV6KBQ__" />
        <meta property="og:site_name" content="Blog420" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog420 - Fresh News, Honest Takes, and Smart Reads" />
        <meta name="twitter:description" content="Stay updated with the latest in news, sports, tech, and politics. Blog420 is your trusted source for thoughtful articles and trending updates." />
        <meta name="twitter:image" content="https://media-hosting.imagekit.io/e43155f430614b1d/fav.png" />
        <meta name="twitter:site" content="@Blog420" />
        
        <link rel="canonical" href="https://blog420.vercel.app/" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Blog420",
            "url": "https://blog420.vercel.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://blog420.vercel.app/post/{search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <div className="space-y-8">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blog-darkText">
            Blog420 
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your source for insights on technology, lifestyle, business, and more 🚀
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
