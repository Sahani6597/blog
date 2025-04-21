
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">NextBlog</h3>
            <p className="text-gray-600">
              Your trusted source for quality content across various categories.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=sports" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/?category=news" className="text-gray-600 hover:text-blog-purple transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/?category=politics" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Politics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blog-purple transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {year} NextBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
