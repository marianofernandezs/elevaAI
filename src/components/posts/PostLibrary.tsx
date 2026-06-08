import type { GeneratedPost, PostStatus } from "../../types";

interface PostLibraryProps {
  posts: GeneratedPost[];
  onUpdateStatus: (id: string, status: PostStatus) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function PostLibrary({ posts, onUpdateStatus, onDelete }: PostLibraryProps) {
  return (
    <section className="surface p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Biblioteca de posts</h3>
        <p className="mt-2 text-sm text-muted">Edita estados, archiva ideas o limpia drafts sin perder contexto.</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="soft-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="eyebrow">{post.type}</p>
                <h4 className="mt-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{post.title}</h4>
                <p className="mt-2 text-sm text-muted">{post.hook}</p>
              </div>
              <select
                className="input w-full md:max-w-44"
                value={post.status}
                onChange={(event) => onUpdateStatus(post.id, event.target.value as PostStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{post.content}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((hashtag) => (
                  <span key={hashtag} className="badge-pill" style={{ letterSpacing: "0.02em", textTransform: "none" }}>
                    {hashtag}
                  </span>
                ))}
              </div>
              <button type="button" className="text-sm font-semibold" style={{ color: "#d96b6b" }} onClick={() => onDelete(post.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
