import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { BLOG_POSTS } from "@/lib/content";

export const Route = createFileRoute("/blog/")({ component: BlogIndex });

function BlogIndex() {
  return (
    <Shell>
      <h1 className="display text-4xl">Blog</h1>
      <p className="mt-2 text-base text-muted">Bài viết mẫu — kinh nghiệm và cẩm nang du lịch.</p>
      <ul className="mt-5 space-y-4">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug} className="overflow-hidden rounded-card bg-surface">
            <img src={post.image} alt="" className="h-40 w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold text-brand">{post.category}</p>
              <p className="text-xl font-semibold leading-snug">{post.title}</p>
              <p className="text-base text-muted">{post.excerpt}</p>
              <p className="text-sm text-muted">
                {post.date} · {post.readMin} phút · {post.author}
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
              >
                Đọc bài
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
