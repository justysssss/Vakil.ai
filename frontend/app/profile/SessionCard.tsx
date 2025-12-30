"use client";

import Link from "next/link";
import { FileText, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { deleteChatSession } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SessionCardProps {
    chat: {
        id: string;
        createdAt: Date;
        document: {
            name: string;
            score: number | null;
        } | null;
    };
}

export default function SessionCard({ chat }: SessionCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this session?")) {
            setIsDeleting(true);
            const result = await deleteChatSession(chat.id);
            if (result.success) {
                router.refresh(); // Refresh server component
            } else {
                alert("Failed to delete session");
                setIsDeleting(false);
            }
        }
    };

    if (isDeleting) return null; // Optimistic hide

    return (
        <Link
            href={`/upload?chatId=${chat.id}`}
            className="group relative p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 transition-all duration-300 block"
        >
            <div className="flex justify-between items-start mb-4 pr-10">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <FileText className="w-5 h-5" />
                </div>
                {chat.document?.score != null && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${chat.document.score > 70
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : chat.document.score > 40
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                        Score: {chat.document.score}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-medium text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-1 pr-8">
                {chat.document?.name || "Untitled Document"}
            </h3>

            <div className="flex items-center gap-4 text-xs text-white/40">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(chat.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Navigation Arrow */}
            <div className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ChevronRight className="w-5 h-5 text-white/60" />
            </div>

            {/* Delete Button */}
            <button
                onClick={handleDelete}
                className="absolute top-5 right-5 p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all z-10"
                title="Delete Session"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </Link>
    );
}
