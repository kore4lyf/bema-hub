"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetTagsQuery, useCreateTagMutation } from "@/lib/api/blogApi";
import { X, Plus, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TagSelectorProps {
  selectedTags: number[];
  onTagsChange: (tags: number[]) => void;
  className?: string;
}

export function TagSelector({ selectedTags, onTagsChange, className }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [showCreateTag, setShowCreateTag] = useState(false);

  const { data: tags = [], isLoading, refetch } = useGetTagsQuery({
    search: searchValue || undefined,
    per_page: 50
  });

  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id));

  const handleSelectTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      onTagsChange([...selectedTags, tagId]);
    }
    setOpen(false);
  };

  const handleRemoveTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    try {
      const newTag = await createTag({
        name: newTagName.trim(),
        slug: newTagName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      }).unwrap();

      // Add the new tag to selected tags
      onTagsChange([...selectedTags, newTag.id]);
      
      // Reset form
      setNewTagName("");
      setShowCreateTag(false);
      setOpen(false);
      
      toast.success(`Tag "${newTag.name}" created successfully!`);
      
      // Refetch tags to include the new one
      refetch();
    } catch (error: any) {
      console.error('Failed to create tag:', error);
      toast.error(error?.data?.message || 'Failed to create tag');
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Selected Tags */}
        {selectedTagObjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Tag Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal"
            >
              <Tag className="h-4 w-4 mr-2" />
              {selectedTags.length === 0 
                ? "Add tags..." 
                : `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search tags..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {searchValue ? `No tags found for "${searchValue}"` : "No tags found"}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewTagName(searchValue);
                        setShowCreateTag(true);
                      }}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create "{searchValue || 'new tag'}"
                    </Button>
                  </div>
                </CommandEmpty>
                
                {availableTags.length > 0 && (
                  <CommandGroup heading="Available Tags">
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleSelectTag(tag.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          <span>{tag.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tag.count}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchValue && !showCreateTag && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setNewTagName(searchValue);
                        setShowCreateTag(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create "{searchValue}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>

            {/* Create New Tag Form */}
            {showCreateTag && (
              <div className="border-t p-3 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Create New Tag</label>
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      } else if (e.key === 'Escape') {
                        setShowCreateTag(false);
                        setNewTagName("");
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateTag}
                    disabled={isCreating || !newTagName.trim()}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        Create
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateTag(false);
                      setNewTagName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tags...
          </div>
        )}
      </div>
    </div>
  );
}