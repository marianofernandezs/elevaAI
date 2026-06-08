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
        <h3 className="text-xl font-bold text-slate-950">Biblioteca de posts</h3>
        <p className="mt-2 text-sm text-slate-600">Edita estados, archiva ideas o limpia drafts sin perder contexto.</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{post.type}</p>
                <h4 className="mt-2 text-lg font-bold text-slate-950">{post.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{post.hook}</p>
              </div>
              <select
                className="input max-w-44"
                value={post.status}
                onChange={(event) => onUpdateStatus(post.id, event.target.value as PostStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.content}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((hashtag) => (
                  <span key={hashtag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {hashtag}
                  </span>
                ))}
              </div>
              <button type="button" className="text-sm font-semibold text-rose-600" onClick={() => onDelete(post.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
