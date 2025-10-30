"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, Users, Gift, Plus, X, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/custom/Navbar";

interface Milestone {
  target: number;
  label: string;
  reward: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    startDate: "",
    endDate: "",
    featuredImage: "",
    status: "draft"
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone>({
    target: 0,
    label: "",
    reward: ""
  });

  const categories = [
    "Album Launch",
    "Community Building",
    "Live Event",
    "Music Video",
    "Merchandise",
    "Charity Drive",
    "Fan Engagement",
    "Creative Project"
  ];

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const campaign = {
        ...formData,
        milestones,
        status,
        createdAt: new Date().toISOString(),
        creator: "Current User" // TODO: Get from auth context
      };
      
      console.log("Creating campaign:", campaign);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMilestone = () => {
    if (currentMilestone.target > 0 && currentMilestone.label && currentMilestone.reward) {
      setMilestones(prev => [...prev, { ...currentMilestone }].sort((a, b) => a.target - b.target));
      setCurrentMilestone({ target: 0, label: "", reward: "" });
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground">
            Launch a campaign to engage your community and achieve your creative goals
          </p>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your campaign title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign goals and what supporters can expect..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Participation Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., 1000 participants"
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  placeholder="https://example.com/campaign-image.jpg"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Campaign Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="milestoneTarget">Participants Target</Label>
                  <Input
                    id="milestoneTarget"
                    type="number"
                    placeholder="500"
                    value={currentMilestone.target || ""}
                    onChange={(e) => setCurrentMilestone(prev => ({ ...prev, target: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestoneLabel">Milestone Label</Label>
                  <Input
                    id="milestoneLabel"
                    placeholder="Early Bird Reward"
                    value={currentMilestone.label}
                    onChange={(e) => setCurrentMilestone(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestoneReward">Reward Description</Label>
                  <Input
                    id="milestoneReward"
                    placeholder="Exclusive badge + bonus points"
                    value={currentMilestone.reward}
                    onChange={(e) => setCurrentMilestone(prev => ({ ...prev, reward: e.target.value }))}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={addMilestone}
                disabled={!currentMilestone.target || !currentMilestone.label || !currentMilestone.reward}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>

              {milestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Campaign Milestones</h4>
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{milestone.target} participants</Badge>
                          <span className="font-medium">{milestone.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.reward}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Campaign Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">{formData.title || "Your Campaign Title"}</h2>
                <p className="text-muted-foreground mb-4">{formData.description || "Your campaign description will appear here..."}</p>
                
                {formData.goal && (
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Goal: {formData.goal}</span>
                  </div>
                )}

                {(formData.startDate || formData.endDate) && (
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {formData.startDate && `Starts: ${formData.startDate}`}
                      {formData.startDate && formData.endDate && " • "}
                      {formData.endDate && `Ends: ${formData.endDate}`}
                    </span>
                  </div>
                )}

                {milestones.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          <Badge variant="secondary" className="mb-1">{milestone.target}</Badge>
                          <div className="font-medium">{milestone.label}</div>
                          <div className="text-muted-foreground">{milestone.reward}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center py-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/campaigns")}
            >
              Cancel
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={isSubmitting || !formData.title || !formData.description}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={isSubmitting || !formData.title || !formData.description}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Launching..." : "Launch Campaign"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}