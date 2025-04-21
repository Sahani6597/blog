import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Mail, Settings } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Profile Settings - NextBlog</title>
        <meta name="description" content="Manage your NextBlog account settings, update your profile details, and customize your experience." />
      </Helmet>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl">Public Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-full md:w-1/3">
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarImage src={user?.avatar_url || ""} alt={user?.username || "User"} />
                      <AvatarFallback className="text-3xl bg-blog-purple text-white">
                        {user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="w-full md:w-2/3 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="max-w-md"
                        placeholder="Enter your username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 max-w-md">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input 
                        id="avatar"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="max-w-md"
                        placeholder="Enter avatar URL"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating} className="bg-blog-purple hover:bg-blog-darkPurple">
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Account settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
