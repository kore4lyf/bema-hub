"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, Send, Loader2, Lock, Users, Shield, Flag, MoreHorizontal, Edit, Trash2, Pin, Share, Bookmark, ThumbsUp, ThumbsDown } from "lucide-react";
import { useGetCommentsQuery, useCreateCommentMutation, useReplyToCommentMutation, type Comment } from "@/lib/api/blogApi";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "sonner";
import Link from "next/link";

interface CommentSectionProps {
  postId: number;
}

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReply: (parentId: number) => void;
  replyingTo: number | null;
}

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
}

function AuthenticationGate({ commentCount }: { commentCount: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200 dark:border-blue-800/30 overflow-hidden">
      <div className="p-8 text-center">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30"></div>
            <div className="relative bg-white dark:bg-gray-900 p-4 rounded-full">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Join the conversation
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
          Sign in to read comments and share your thoughts with the community.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Community discussion</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Verified members only</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signin">
            <Button className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="w-full sm:w-auto px-8 py-2.5 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Free to join • No spam • Respectful community
          </p>
        </div>
      </div>
    </div>
  );
}

function CommentForm({ postId, parentId, onSuccess, onCancel, placeholder = "Share your thoughts...", buttonText = "Post Comment" }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [replyToComment, { isLoading: isReplying }] = useReplyToCommentMutation();
  
  const isLoading = isCreating || isReplying;
  const maxLength = 2000;
  const remainingChars = maxLength - content.length;
  const isNearLimit = remainingChars < 100;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to comment");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (content.length > maxLength) {
      toast.error(`Comment is too long. Maximum ${maxLength} characters allowed.`);
      return;
    }

    const commentData = {
      post: postId,
      parent: parentId || 0,
      content: content.trim(),
    };

    try {
      if (parentId) {
        await replyToComment(commentData).unwrap();
        toast.success("Reply posted successfully!");
      } else {
        await createComment(commentData).unwrap();
        toast.success("Comment posted successfully!");
      }
      
      // Reset form
      setContent("");
      setIsExpanded(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to post comment:", error);
      toast.error(error?.data?.message || "Failed to post comment. Please try again.");
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setContent("");
    setIsExpanded(false);
    onCancel?.();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`transition-all duration-300 ${parentId ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4' : isExpanded ? 'bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg' : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-white dark:hover:bg-gray-950 hover:shadow-md'}`}>
      {/* User Avatar Header */}
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
          <img
            src={user?.avatar || '/placeholder.svg'}
            alt={user?.name || 'User'}
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {user?.name || user?.email || 'User'}
            </span>
            {user?.verified && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Commenting as {user?.role === 'administrator' ? 'admin' : 'member'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            id={`content-${parentId || 'main'}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={isExpanded ? 4 : 2}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 resize-none min-h-[60px] border-0 bg-transparent focus:bg-white dark:focus:bg-gray-900 p-3"
            required
          />
          
          {/* Character Counter */}
          {isExpanded && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <span>💡 Tip: Be respectful and constructive</span>
              </div>
              <span className={`font-medium ${isNearLimit ? 'text-orange-500' : remainingChars < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {remainingChars} characters left
              </span>
            </div>
          )}
        </div>
        
        {/* Action Bar */}
        {isExpanded && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Formatting Tools */}
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                <span className="text-sm font-bold">B</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                <span className="text-sm italic">I</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel} className="px-4 text-gray-600 hover:text-gray-800">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !content.trim() || content.length > maxLength} 
                size="sm" 
                className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {buttonText}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function CommentItem({ comment, postId, onReply, replyingTo }: CommentItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvatarUrl = () => {
    return comment.author_avatar_urls?.['48'] || comment.author_avatar_urls?.['96'] || '/placeholder.svg';
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to report comments");
      return;
    }
    toast.success("Comment reported. Thank you for helping keep our community safe.");
  };

  const isAuthor = user?.email === comment.author_email || user?.id === comment.author;
  const isAdmin = user?.role === 'administrator';

  return (
    <div className="group">
      <Card className="border-0 shadow-none bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all duration-200 rounded-lg">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
                <img
                  src={getAvatarUrl()}
                  alt={comment.author_name}
                  className="h-full w-full object-cover"
                />
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {comment.author_name}
                  </h4>
                  {(comment.author_role === 'administrator' || comment.author_name === 'root') && (
                    <Badge variant="default" className="text-xs px-2 py-0.5 bg-blue-600">
                      Admin
                    </Badge>
                  )}
                  {comment.author > 0 && comment.author_role === 'subscriber' && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Member
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formatDate(comment.date)}
                  </span>
                  {comment.parent === 0 && comment.id === 1 && (
                    <Pin className="h-3 w-3 text-blue-600" title="Pinned comment" />
                  )}
                </div>
                
                {/* More Actions Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActions(!showActions)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {isAuthor && (
                        <>
                          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                            <Edit className="h-3 w-3" /> Edit
                          </button>
                          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-red-600">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </>
                      )}
                      {!isAuthor && (
                        <button 
                          onClick={handleReport}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                        >
                          <Flag className="h-3 w-3" /> Report
                        </button>
                      )}
                      <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                        <Share className="h-3 w-3" /> Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-3 prose-p:mt-0"
                dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
              />
              
              {/* Engagement Actions */}
              <div className="flex items-center gap-4 pt-2">                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 h-auto px-2 py-1.5 font-medium transition-colors"
                >
                  <Reply className="h-3.5 w-3.5 mr-1.5" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {replyingTo === comment.id && (
        <div className="ml-16 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => onReply(0)}
            onCancel={() => onReply(0)}
            placeholder={`Reply to ${comment.author_name}...`}
            buttonText="Post Reply"
          />
        </div>
      )}
      
      {/* Click outside to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'staff'>('all');
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Always fetch comments to get count, but conditionally display
  const { data: comments = [], isLoading, error } = useGetCommentsQuery({ 
    post: postId,
    per_page: 100,
    order: sortBy === 'oldest' ? 'asc' : 'desc'
  });

  const handleReply = (commentId: number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to reply");
      return;
    }
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // Filter and sort comments
  const processedComments = comments
    .filter(comment => {
      if (filterBy === 'verified') return comment.author > 0; // Registered users have author ID > 0
      if (filterBy === 'staff') return comment.author_role === 'administrator' || comment.author_name === 'root';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        // Mock popularity based on comment length and recency
        const aScore = a.content.rendered.length + (new Date().getTime() - new Date(a.date).getTime()) / 100000;
        const bScore = b.content.rendered.length + (new Date().getTime() - new Date(b.date).getTime()) / 100000;
        return bScore - aScore;
      }
      return 0; // Default WordPress ordering
    });

  // Organize comments into parent and child relationships
  const organizedComments = processedComments.reduce((acc, comment) => {
    if (comment.parent === 0) {
      acc.parents.push(comment);
    } else {
      if (!acc.children[comment.parent]) {
        acc.children[comment.parent] = [];
      }
      acc.children[comment.parent].push(comment);
    }
    return acc;
  }, { parents: [] as Comment[], children: {} as Record<number, Comment[]> });

  // Analytics
  const totalReplies = Object.values(organizedComments.children).flat().length;
  const avgCommentsPerDay = comments.length > 0 ? 
    Math.round(comments.length / Math.max(1, Math.floor((new Date().getTime() - new Date(comments[0]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24)))) : 0;

  const renderComment = (comment: Comment) => {
    const replies = organizedComments.children[comment.id] || [];
    
    return (
      <div key={comment.id} className="space-y-6">
        <CommentItem
          comment={comment}
          postId={postId}
          onReply={handleReply}
          replyingTo={replyingTo}
        />
        
        {replies.length > 0 && (
          <div className="ml-16 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-6 relative">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            {replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onReply={handleReply}
                replyingTo={replyingTo}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <Separator className="mb-12" />
          <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-800">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Unable to load comments</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We're having trouble loading the comments. Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Separator className="mb-12" />
        
        <div className="space-y-12">
          {/* Enhanced Header - Always visible */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-center md:justify-start gap-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                Comments
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  ({comments.length})
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isAuthenticated 
                  ? "Share your thoughts and join the conversation"
                  : "Join our community to participate in the discussion"
                }
              </p>
              
              {/* Comment Analytics */}
              {comments.length > 0 && (
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{organizedComments.parents.length} top-level comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4" />
                    <span>{totalReplies} replies</span>
                  </div>
                  {avgCommentsPerDay > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{avgCommentsPerDay} comments/day avg</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sorting and Filtering Controls - Only for authenticated users */}
            {isAuthenticated && comments.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="popular">Most popular</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                    <select 
                      value={filterBy} 
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all">All comments</option>
                      <option value="verified">Members only</option>
                      <option value="staff">Admin responses</option>
                    </select>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Showing {organizedComments.parents.length} of {comments.length}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live updates</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Authentication Gate or Comments */}
          {!isAuthenticated ? (
            <AuthenticationGate commentCount={comments.length} />
          ) : (
            <>
              {/* Comment Form - Only for authenticated users */}
              <div className="max-w-2xl mx-auto md:mx-0">
                <CommentForm postId={postId} />
              </div>
              
              {/* Comments List - Only for authenticated users */}
              <div className="space-y-8">
                {isLoading ? (
                  <div className="text-center py-16 bg-gray-50/30 dark:bg-gray-900/10 rounded-xl">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600 mb-6" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading comments...</p>
                  </div>
                ) : organizedComments.parents.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50/30 dark:bg-gray-900/10 rounded-xl border border-gray-200 dark:border-gray-800">
                    <MessageCircle className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                    <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">No comments yet</h4>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                      Be the first to share your thoughts and start the conversation!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-3">
                      {organizedComments.parents.length} {organizedComments.parents.length === 1 ? 'comment' : 'comments'}
                    </div>
                    <div className="space-y-8">
                      {organizedComments.parents.map(renderComment)}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}