"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeViewRendererProps } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { Transaction } from 'prosemirror-state';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useUploadMediaMutation } from '@/lib/api/blogApi';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Upload, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Loader2,
  X,
  RotateCw,
  Move,
  Maximize,
  Minimize
} from 'lucide-react';
import { toast } from 'sonner';

// Conditional imports for BubbleMenu and FloatingMenu

interface AdvancedEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom Image Extension with resizing and alignment
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },

  addNodeView() {
    return (props) => {
      const { node, getPos, editor } = props;
      // Type assertion for updateAttributes since it's not in the props type
      const updateAttributes = (attrs: Record<string, any>) => {
        const pos = typeof getPos === 'function' ? getPos() : getPos;
        if (typeof pos === 'number') {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              ...attrs,
            })
          );
        }
      };
      
      const container = document.createElement('div');
      container.className = 'relative inline-block group';
      
      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.className = 'max-w-full h-auto rounded cursor-pointer';
      
      if (node.attrs.width) img.style.width = node.attrs.width;
      if (node.attrs.height) img.style.height = node.attrs.height;
      if (node.attrs.style) img.style.cssText += node.attrs.style;

      // Create resize handles
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity';
      
      // Create alignment buttons
      const alignmentControls = document.createElement('div');
      alignmentControls.className = 'absolute top-0 left-0 bg-white shadow-md rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1';
      alignmentControls.innerHTML = `
        <button data-align="left" class="p-1 hover:bg-gray-100 rounded text-xs">←</button>
        <button data-align="center" class="p-1 hover:bg-gray-100 rounded text-xs">⊙</button>
        <button data-align="right" class="p-1 hover:bg-gray-100 rounded text-xs">→</button>
        <button data-delete class="p-1 hover:bg-red-100 text-red-600 rounded text-xs">×</button>
      `;

      // Handle alignment clicks
      alignmentControls.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const align = target.getAttribute('data-align');
        
        if (align) {
          const alignmentStyles = {
            left: 'float: left; margin: 0 1rem 1rem 0;',
            center: 'display: block; margin: 1rem auto;',
            right: 'float: right; margin: 0 0 1rem 1rem;'
          };
          updateAttributes({ style: alignmentStyles[align as keyof typeof alignmentStyles] });
        } else if (target.hasAttribute('data-delete')) {
          const pos = getPos();
          if (typeof pos === 'number') {
            editor.commands.deleteRange({ from: pos, to: pos + 1 });
          }
        }
      });

      // Handle resize
      let isResizing = false;
      resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;

        const handleMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = Math.max(50, startHeight + deltaY);
          
          img.style.width = newWidth + 'px';
          img.style.height = newHeight + 'px';
          
          updateAttributes({ 
            width: newWidth + 'px', 
            height: newHeight + 'px' 
          });
        };

        const handleMouseUp = () => {
          isResizing = false;
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      });

      container.appendChild(img);
      container.appendChild(resizeHandle);
      container.appendChild(alignmentControls);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';
          if (updatedNode.attrs.width) img.style.width = updatedNode.attrs.width;
          if (updatedNode.attrs.height) img.style.height = updatedNode.attrs.height;
          if (updatedNode.attrs.style) img.style.cssText = updatedNode.attrs.style;
          return true;
        },
      };
    };
  },
});

// Custom extension for drag and drop
const DragDrop = Extension.create({
  name: 'dragDrop',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        props: {
          handleDOMEvents: {
            dragover: (view, event) => {
              event.preventDefault();
              return false;
            },
            drop: (view, event) => {
              event.preventDefault();
              const files = Array.from(event.dataTransfer?.files || []);
              const imageFiles = files.filter(file => file.type.startsWith('image/'));
              
              if (imageFiles.length > 0) {
                const pos = view.posAtCoords({ 
                  left: event.clientX, 
                  top: event.clientY 
                });
                
                if (pos) {
                  // Trigger upload for each image
                  imageFiles.forEach(file => {
                    (this.editor as any).commands.uploadAndInsertImage(file, pos.pos);
                  });
                }
              }
              return true;
            },
          },
        },
      }),
    ];
  },
});

export function AdvancedEditor({ content, onChange, placeholder = "Start writing..." }: AdvancedEditorProps) {
  const [uploadMedia] = useUploadMediaMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAndInsertImage = useCallback(async (file: File, position?: number) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('caption', '');
      formData.append('description', '');

      const response = await uploadMedia(formData).unwrap();
      
      const imageUrl = response.source_url || response.media_details?.sizes?.full?.source_url;
      if (imageUrl) {
        if (position !== undefined) {
          editor?.commands.insertContentAt(position, {
            type: 'image',
            attrs: { src: imageUrl, alt: response.alt_text || file.name }
          });
        } else {
          editor?.commands.setImage({ src: imageUrl, alt: response.alt_text || file.name });
        }
        toast.success('Image uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [uploadMedia]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-sm',
        },
        allowBase64: false,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      DragDrop,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Remove the custom command addition that was causing issues
  // editor.commands.uploadAndInsertImage = uploadAndInsertImage;

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => uploadAndInsertImage(file));
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  if (!editor) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists and Quote */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Media and Links */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <PopoverTrigger asChild>
              <Button
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                size="sm"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <Label htmlFor="link-url">Link URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setLink();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button onClick={setLink} size="sm" className="flex-1">
                    {editor.isActive('link') ? 'Update Link' : 'Add Link'}
                  </Button>
                  {editor.isActive('link') && (
                    <Button
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setShowLinkDialog(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Drag and Drop Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-4 border-2 border-dashed border-transparent transition-colors duration-200 rounded-lg flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 opacity-0 transition-opacity duration-200">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drop images here to upload</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bubble Menu for selected text */}
      {/* Removed due to import issues */}

      {/* Floating Menu for empty lines */}
      {/* Removed due to import issues */}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}