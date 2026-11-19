import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { getPost } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({ component: BlogPostPage });

function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const post = getPost(slug);

  if (!post) {
    return (
      <Shell>
        <p className="text-lg">Không thấy bài viết.</p>
        <Link to="/blog" className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand">
          Về blog
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <img src={post.image} alt="" className="h-56 w-full rounded-card object-cover" />
      <p className="mt-4 text-sm font-semibold text-brand">{post.category}</p>
      <h1 className="display text-4xl leading-tight">{post.title}</h1>
      <p className="mt-2 text-base text-muted">
        {post.date} · {post.readMin} phút · {post.author}
      </p>
      <div className="mt-5 space-y-4 text-lg leading-relaxed">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <Link to="/blog" className="mt-8 flex h-14 w-full items-center justify-center rounded-full border border-line bg-surface text-lg font-semibold">
        Các bài khác
      </Link>
    </Shell>
  );
}
