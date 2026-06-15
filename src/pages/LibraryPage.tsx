import { useState } from "react";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import { FileText, Trash2, CheckCircle, Archive } from "lucide-react";
import type { PostStatus } from "../types";
import { renderMarkdown } from "../utils/markdown";

export default function LibraryPage() {
  const { signOut, userEmail } = useAuth();
  const { state, isLoading, setPostStatus, deletePost, banner } = useWorkspaceData();
  const [filter, setFilter] = useState<"all" | PostStatus>("all");

  const filteredPosts = state.posts.filter((post) => filter === "all" || post.status === filter);

  const statusIcons: Record<PostStatus, typeof CheckCircle> = {
    draft: FileText,
    published: CheckCircle,
    archived: Archive,
  };

  const statusColors: Record<PostStatus, string> = {
    draft: "var(--accent)",
    published: "#10b981",
    archived: "#6f7d98",
  };

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        <div className="surface min-w-0 overflow-hidden">
          <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div>
              <p className="eyebrow">Biblioteca de posts</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Biblioteca de Contenidos
              </h1>
              <p className="mt-2 text-sm text-muted">
                Administra tus ideas, borradores y publicaciones. Edita estados, archiva ideas o limpia drafts sin perder contexto.
              </p>
            </div>
            {banner && (
              <div className="soft-card min-w-0 p-5 text-sm leading-7 text-muted break-words">
                {banner}
              </div>
            )}
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {(["all", "draft", "published", "archived"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              className={`workspace-filter ${filter === opt ? "!bg-[var(--accent)] !text-white border-transparent" : "text-[var(--text-primary)]"}`}
              style={{
                textTransform: "capitalize",
              }}
            >
              {opt === "all" ? "Todos" : opt === "draft" ? "Borradores" : opt === "published" ? "Publicados" : "Archivados"}
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {opt === "all"
                  ? state.posts.length
                  : state.posts.filter((p) => p.status === opt).length}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="surface p-6 text-sm font-semibold text-muted">
            Cargando biblioteca...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const Icon = statusIcons[post.status] || FileText;
              const color = statusColors[post.status];

              return (
                <article
                  key={post.id}
                  className="surface flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color }} />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                          {post.status}
                        </span>
                      </div>
                      <select
                        className="input !py-1 !px-2 text-xs w-auto min-w-24"
                        value={post.status}
                        onChange={(event) => void setPostStatus(post.id, event.target.value as PostStatus)}
                      >
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Archivado</option>
                      </select>
                    </div>

                    <div>
                      <p className="eyebrow">{post.type}</p>
                      <h3 className="mt-2 text-lg font-bold leading-6" style={{ color: "var(--text-primary)" }}>
                        {post.title}
                      </h3>
                      {post.hook && (
                        <p className="mt-2 text-sm italic text-muted border-l-2 border-[var(--accent-soft)] pl-3">
                          "{renderMarkdown(post.hook)}"
                        </p>
                      )}
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-xl bg-[color-mix(in_srgb,var(--panel-muted)_50%,transparent)] p-3 text-xs leading-5 text-muted whitespace-pre-wrap">
                      {renderMarkdown(post.content)}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 3).map((hashtag) => (
                        <span
                          key={hashtag}
                          className="badge-pill !text-[10px] !py-0.5 !px-2"
                          style={{ textTransform: "none", letterSpacing: "normal" }}
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => void deletePost(post.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition duration-200"
                      title="Eliminar post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="surface p-12 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              No hay publicaciones en esta sección
            </h3>
            <p className="text-sm text-muted">
              {filter === "all"
                ? "Aún no has generado posts. Dirígete al Workspace para crear tu primer post."
                : `No tienes publicaciones marcadas como "${filter}".`}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
