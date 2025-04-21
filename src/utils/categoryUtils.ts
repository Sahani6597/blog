export const getCategoryColor = (category?: string) => {
  if (!category) return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  
  switch(category.toLowerCase()) {
    case "technology":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "lifestyle":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "business":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "travel":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "health":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "education":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "entertainment":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200";
    case "food":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "personal-development":
      return "bg-teal-100 text-teal-800 hover:bg-teal-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const formatCategoryText = (category?: string) => {
  if (!category) return "Uncategorized";
  
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}; 