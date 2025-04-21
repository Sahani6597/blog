
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart, ExternalLink, MessageSquare, Flag } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your blog content and users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center text-blog-purple">
              <FileText className="h-5 w-5 mr-2" />
              Blog Posts
            </CardTitle>
            <CardDescription>
              Manage your blog content
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500">
              Create, edit, and organize your blog posts. Keep your content fresh and engaging.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/posts" className="w-full">
              <Button variant="outline" className="w-full border-blog-purple text-blog-purple hover:bg-blog-purple hover:text-white">
                Manage Posts
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center text-blog-purple">
              <MessageSquare className="h-5 w-5 mr-2" />
              Forum Management
            </CardTitle>
            <CardDescription>
              Monitor forum activity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500">
              Moderate forum discussions, manage topics, and ensure community guidelines are followed.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/forum" className="w-full">
              <Button variant="outline" className="w-full border-blog-purple text-blog-purple hover:bg-blog-purple hover:text-white">
                View Forum
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center text-blog-purple">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-500">
              Review user accounts, manage roles, and maintain community standards.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/users" className="w-full">
              <Button variant="outline" className="w-full border-blog-purple text-blog-purple hover:bg-blog-purple hover:text-white">
                Manage Users
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blog-purple/10 to-blog-purple/5">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blog-purple">6</div>
            <p className="text-sm text-gray-600 mt-1">Published articles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blog-purple/10 to-blog-purple/5">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blog-purple">7</div>
            <p className="text-sm text-gray-600 mt-1">Registered members</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blog-purple/10 to-blog-purple/5">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Forum Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blog-purple">4</div>
            <p className="text-sm text-gray-600 mt-1">Active discussions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
