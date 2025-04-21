
import { Link } from "react-router-dom";

export function NavLinks() {
  return (
    <>
      <Link to="/" className="text-gray-700 hover:text-blog-purple transition-colors">
        Home
      </Link>
      <Link to="/forum" className="text-gray-700 hover:text-blog-purple transition-colors">
        Forum
      </Link>
      <Link to="/?category=technology" className="text-gray-700 hover:text-blog-purple transition-colors">
        Technology
      </Link>
      <Link to="/?category=lifestyle" className="text-gray-700 hover:text-blog-purple transition-colors">
        Lifestyle
      </Link>
    </>
  );
}
