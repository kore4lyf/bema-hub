"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/api/blogApi";
import { toast } from "sonner";

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CategorySelector({ value, onValueChange, placeholder = "Select category" }: CategorySelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: categories = [], refetch } = useGetCategoriesQuery();

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/wp/v2/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        toast.success(`Category "${newCategoryName}" created successfully!`);
        onValueChange(newCategory.id.toString());
        setNewCategoryName("");
        setIsDialogOpen(false);
        refetch();
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name} ({category.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateCategory} 
                disabled={!newCategoryName.trim() || isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
