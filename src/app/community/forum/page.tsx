"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, Search, MessageSquare, Flame, Pin, Clock, ThumbsUp, Eye, Plus, Users, Loader2 } from "lucide-react";

const CATEGORIES = [
	{ id: "all", label: "Tout", emoji: "🌐" },
	{ id: "PRODUCTION", label: "Production", emoji: "🎹" },
	{ id: "MARKETING", label: "Marketing", emoji: "📈" },
	{ id: "EQUIPMENT", label: "Équipement", emoji: "🔌" },
	{ id: "COLLABORATION", label: "Collaboration", emoji: "🤝" },
	{ id: "OTHER", label: "Général", emoji: "💬" },
];

interface Post {
	id: string;
	title: string;
	content: string;
	category: string;
	createdAt: string;
	author: {
		id: string;
		displayName: string | null;
		username: string;
		avatar: string | null;
		sellerProfile: { artistName: string } | null;
	};
	_count: { comments: number };
	views: number;
	likes: number;
	pinned: boolean;
}

export default function ForumPage() {
	const { user } = useAuth();
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newPost, setNewPost] = useState({ title: "", content: "", category: "PRODUCTION" });
	const [submitting, setSubmitting] = useState(false);

	const fetchPosts = async () => {
		try {
			const params = new URLSearchParams({ limit: "50" });
			if (activeCategory !== "all") params.set("category", activeCategory);
			if (searchQuery) params.set("search", searchQuery);
			const res = await fetch(`/api/forum/posts?${params}`);
			if (res.ok) {
				const d = await res.json();
				setPosts(d.posts || []);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [activeCategory, searchQuery]);

	const handleCreatePost = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setSubmitting(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch("/api/forum/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(newPost),
			});
			if (res.ok) {
				setShowModal(false);
				setNewPost({ title: "", content: "", category: "PRODUCTION" });
				fetchPosts();
			}
		} finally {
			setSubmitting(false);
		}
	};

	const pinned = posts.filter((p) => p.pinned);
	const regular = posts.filter((p) => !p.pinned);

	const timeAgo = (d: string) => {
		const diff = Date.now() - new Date(d).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 60) return `Il y a ${mins}min`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `Il y a ${hrs}h`;
		return `Il y a ${Math.floor(hrs / 24)}j`;
	};

	const PostRow = ({ post }: { post: Post }) => {
		const authorName = post.author.sellerProfile?.artistName || post.author.displayName || post.author.username;
		return (
			<div className="glass rounded-2xl p-5 hover:bg-white/5">
				<div className="flex items-start gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2 flex-wrap">
							{post.pinned && <Pin className="w-4 h-4 text-brand-gold flex-shrink-0" />}
							{post._count.comments > 20 && <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />}
							<Link href={`/community/forum`} className="font-bold hover:text-brand-gold">
								{post.title}
							</Link>
						</div>
						<div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
							<span>{authorName}</span>
							<span className="glass px-2 py-0.5 rounded">
								{CATEGORIES.find((c) => c.id === post.category)?.label || post.category}
							</span>
							<span className="flex items-center gap-1">
								<MessageSquare className="w-3 h-3" />
								{post._count.comments}
							</span>
							<span className="flex items-center gap-1">
								<Eye className="w-3 h-3" />
								{(post.views || 0).toLocaleString()}
							</span>
							<span className="flex items-center gap-1">
								<ThumbsUp className="w-3 h-3" />
								{post.likes || 0}
							</span>
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{timeAgo(post.createdAt)}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="relative min-h-screen bg-gradient-premium">
			<Navbar />
			<main className="pt-20">
				<div className="mx-auto max-w-7xl px-6 py-12">
					<Link href="/community" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-6">
						<ChevronLeft className="w-5 h-5" />
						Retour à la communauté
					</Link>
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
						<div>
							<h1 className="text-4xl md:text-5xl font-bold font-display text-gradient">Forum</h1>
							<p className="text-slate-400 mt-2">Échangez, apprenez et partagez avec la communauté SUMVIBES</p>
						</div>
						{user && (
							<button onClick={() => setShowModal(true)} className="btn-primary px-6 py-3 rounded-full font-semibold flex items-center gap-2">
								<Plus className="w-5 h-5" /> Nouveau post
							</button>
						)}
					</div>

					<div className="flex gap-2 flex-wrap mb-6">
						{CATEGORIES.map((c) => (
							<button
								key={c.id}
								onClick={() => setActiveCategory(c.id)}
								className={`px-4 py-2 rounded-full text-sm font-semibold ${
									activeCategory === c.id ? "bg-brand-gold text-brand-purple" : "glass hover:bg-white/10"
								}`}
							>
								{c.emoji} {c.label}
							</button>
						))}
					</div>

					<div className="glass rounded-2xl p-4 mb-6">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
							<input
								type="text"
								placeholder="Rechercher un sujet..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 placeholder-slate-500"
							/>
						</div>
					</div>

					{loading ? (
						<div className="text-center py-20">
							<Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto" />
						</div>
					) : (
						<>
							{pinned.length > 0 && (
								<div className="mb-6 space-y-3">
									{pinned.map((p) => (
										<PostRow key={p.id} post={p} />
									))}
								</div>
							)}
							{regular.length > 0 ? (
								<div className="space-y-3">
									{regular.map((p) => (
										<PostRow key={p.id} post={p} />
									))}
								</div>
							) : (
								<div className="glass rounded-2xl p-12 text-center">
									<MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4" />
									<p className="text-slate-400">Aucun post pour l'instant.</p>
									{user && (
										<button onClick={() => setShowModal(true)} className="btn-primary px-6 py-3 rounded-full mt-4">
											Créer le premier post
										</button>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</main>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
					<div className="glass rounded-3xl p-8 max-w-lg w-full">
						<h2 className="text-2xl font-bold mb-6">Nouveau post</h2>
						<form onSubmit={handleCreatePost} className="space-y-4">
							<input
								type="text"
								required
								placeholder="Titre du post *"
								value={newPost.title}
								onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold"
							/>
							<select
								value={newPost.category}
								onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold"
							>
								{CATEGORIES.filter((c) => c.id !== "all").map((c) => (
									<option key={c.id} value={c.id}>
										{c.label}
									</option>
								))}
							</select>
							<textarea
								required
								rows={5}
								placeholder="Contenu du post *"
								value={newPost.content}
								onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold resize-none"
							/>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="flex-1 glass py-3 rounded-xl font-semibold hover:bg-white/10"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={submitting}
									className="flex-1 btn-primary py-3 rounded-xl font-semibold disabled:opacity-50"
								>
									{submitting ? "Publication..." : "Publier"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<footer className="border-t border-white/10 px-6 py-8">
				<div className="mx-auto max-w-7xl text-center text-slate-500 text-sm">© 2026 SUMVIBES by SAS BE GREAT.</div>
			</footer>
		</div>
	);
}
