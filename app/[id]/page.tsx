"use client"

import { useEffect, useState } from "react";
import { allPosts, Post } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";

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
            console.log(id)
            const currentPost = allPosts.find(post => post._meta.fileName == id)
            currentPost && setPost(currentPost)
        }

        fetchPost()
    }, [id])

    return (
        <div>
            {
                post && <MDXContent code={post?.mdx} />
            }
        </div>
    )
}