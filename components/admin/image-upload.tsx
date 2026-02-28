"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("File is not an image.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            onChange(data.url);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full relative border-2 border-dashed rounded-sm p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-foreground/20 hover:border-primary/50 bg-background/50 hover:bg-background"
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-mono">Uploading...</span>
                    </div>
                ) : value && value.length > 0 ? (
                    <div className="space-y-4 w-full flex flex-col items-center">
                        {/* Preview of the physically uploaded image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="max-h-32 rounded-sm object-cover shadow-md" />
                        <div className="flex flex-col text-center">
                            <span className="text-xs font-mono text-foreground/80 mb-1 truncate max-w-xs">{value}</span>
                            <span className="text-[10px] text-foreground/50">Click or Drag to replace image</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground/60">
                        <UploadCloud className="w-8 h-8 opacity-70 mb-2" />
                        <span className="text-sm font-medium">Click to upload or drag and drop</span>
                        <span className="text-xs font-mono opacity-80">SVG, PNG, JPG or GIF (max. 5MB)</span>
                    </div>
                )}
            </div>
            {/* Input field just in case they want to paste a URL instead */}
            <div className="relative">
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-background border border-foreground/20 rounded-sm px-3 py-2 text-xs focus:border-primary focus:outline-none placeholder:text-foreground/20 italic"
                    placeholder="Or paste an external image URL here..."
                />
            </div>
        </div>
    );
}
