import { supabase } from "@/integrations/supabase/client";
import { BLOG_CATEGORIES } from "@/constants/categories";
import type { BlogCategory } from "@/constants/categories";

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured: boolean;
  author_id: string;
  author_name?: string;  // Not in DB, computed from join
  created_at: string;
  updated_at: string;
  cover_image?: string;
  slug?: string;
  category?: BlogCategory;  // Optional since it might not be in all records
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  username?: string;
}

export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// This function maps database post format to our frontend Post interface
const mapPostFromDB = (post: any, authorName?: string): Post => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    featured: post.featured || false,
    author_id: post.author_id,
    author_name: authorName || 'Anonymous',
    created_at: post.created_at,
    updated_at: post.updated_at,
    cover_image: post.cover_image,
    slug: post.slug,
    category: post.category
  };
};

// Function to create a new post
export const createPost = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> => {
  try {
    const slug = postData.slug || postData.title.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    const newPost = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || '',
      featured: postData.featured || false,
      author_id: postData.author_id,
      slug: slug,
      cover_image: postData.cover_image,
      category: postData.category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([newPost])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapPostFromDB(data, postData.author_name);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Function to update an existing post
export const updatePost = async (
  id: string,
  postData: Partial<Omit<Post, 'id' | 'created_at' | 'author_id' | 'author_name'>>
): Promise<Post> => {
  try {
    const updatedPost = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      featured: postData.featured,
      cover_image: postData.cover_image,
      slug: postData.slug || undefined,
      category: postData.category,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('posts')
      .update(updatedPost)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.author_id)
      .single();

    return mapPostFromDB(data, authorProfile?.username);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Function to get all posts
export const getPosts = async (category?: string): Promise<Post[]> => {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw error;
    }

    // Fetch all unique author IDs
    const authorIds = [...new Set(posts.map(post => post.author_id))];
    
    // Get author names in a single query
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', authorIds);

    // Create a map of author IDs to usernames
    const authorMap = new Map(profiles?.map(profile => [profile.id, profile.username]) || []);

    // Map posts with author names
    return posts.map(post => mapPostFromDB(post, authorMap.get(post.author_id)));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Function to get a single post by ID
export const getPostById = async (id: string): Promise<Post> => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', post.author_id)
      .single();

    return mapPostFromDB(post, authorProfile?.username);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Function to get comments for a post
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:author_id (username)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return comments.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      author_id: comment.author_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      username: comment.profiles?.username || 'Anonymous'
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Function to add a comment to a post
export const addComment = async (
  postId: string,
  userId: string,
  commentText: string
): Promise<Comment> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    const newComment = {
      post_id: postId,
      author_id: userId,
      content: commentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      post_id: data.post_id,
      author_id: data.author_id,
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at,
      username: profile?.username || 'Anonymous'
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Function to delete a post
export const deletePost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Function to get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return users.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role || 'user',
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to update user role
export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // First delete all user's posts and comments
    await supabase.from('comments').delete().eq('user_id', userId);
    await supabase.from('posts').delete().eq('author_id', userId);
    
    // Then delete the user profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Function to get recommended posts based on category and current post ID
export const getRecommendedPosts = async (category: string, currentPostId: string, limit: number = 3): Promise<Post[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .neq('id', currentPostId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Fetch all unique author IDs
    const authorIds = [...new Set(posts.map(post => post.author_id))];
    
    // Get author names in a single query
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', authorIds);

    // Create a map of author IDs to usernames
    const authorMap = new Map(profiles?.map(profile => [profile.id, profile.username]) || []);

    // Map posts with author names
    return posts.map(post => mapPostFromDB(post, authorMap.get(post.author_id)));
  } catch (error) {
    console.error('Error fetching recommended posts:', error);
    throw error;
  }
};
