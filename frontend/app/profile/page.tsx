import { auth } from "@/lib/auth";
import { getUserChats } from "@/lib/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import SessionCard from "./SessionCard";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return redirect("/");
    }

    const { chats } = await getUserChats(session.user.id);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {(session.user as unknown as { isPro?: boolean }).isPro && (
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 opacity-75 blur-sm" />
                            )}

                            {session.user.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className={`relative w-20 h-20 rounded-full object-cover ${(session.user as unknown as { isPro?: boolean }).isPro ? "border-2 border-amber-400" : "border border-white/10"}`}
                                />
                            ) : (
                                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-violet-500/20 ${(session.user as unknown as { isPro?: boolean }).isPro ? "border-2 border-amber-400" : "border border-white/10"}`}>
                                    {session.user.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold mb-1">{session.user.name}</h1>
                                {(session.user as unknown as { isPro?: boolean }).isPro && (
                                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-300/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <p className="text-white/50 flex items-center gap-2">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-violet-400" />
                        Previous Sessions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {chats && chats.length > 0 ? (
                            chats.map((chat) => (
                                <SessionCard key={chat.id} chat={chat} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center rounded-2xl bg-white/5 border border-white/5 border-dashed">
                                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white/50">No sessions found</h3>
                                <p className="text-sm text-white/30 mt-1">
                                    Upload a document to start your first session.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
