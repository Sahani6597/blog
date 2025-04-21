import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/constants/categories";

interface CategoryTabsProps {
  activeTab: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ activeTab, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="max-w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => onCategoryChange("all")}
          className="rounded-full whitespace-nowrap flex-shrink-0"
        >
          All
        </Button>
        {BLOG_CATEGORIES.map((category) => (
          <Button
            key={category.slug}
            variant={activeTab === category.slug ? "default" : "outline"}
            onClick={() => onCategoryChange(category.slug)}
            className="rounded-full whitespace-nowrap flex-shrink-0"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs; 