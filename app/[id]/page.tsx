"use client"

import { useEffect, useState } from "react";
import { allPosts, Post } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null)
    const [post, setPost] = useState<Post | null>(null)

    useEffect(() => {
        const fetchId = async () => {
            const { id } = await params
            const decodedId = decodeURIComponent(id);
            setId(decodedId)
        }

        fetchId()
    }, [])

    useEffect(() => {
        const fetchPost = () => {
            const currentPost = allPosts.find(post => post._meta.fileName == id)
            currentPost && setPost(currentPost)
        }

        fetchPost()
    }, [id])

    return (
        <main className="min-h-screen max-w-3xl mx-auto px-6 py-16">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors"
            >
                <span>&larr;</span>
                <span>돌아가기</span>
            </Link>

            {post && (
                <article>
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                            {post.date}
                        </time>
                    </header>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <MDXContent code={post.mdx} />
                    </div>
                </article>
            )}
        </main>
    )
}