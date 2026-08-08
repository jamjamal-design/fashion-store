export default function Loading() {
  return (
    <div className="section-shell py-8 md:py-12">
      <div className="space-y-4">
        <div className="h-4 w-28 rounded-full bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
        <div className="h-12 w-3/4 rounded-[1.5rem] bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
        <div className="h-5 w-full max-w-2xl rounded-full bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-surface rounded-[2rem] p-5 md:p-6">
          <div className="aspect-[4/3] rounded-[1.5rem] bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[1.25rem] bg-[rgba(var(--ink-rgb),0.06)] p-3 animate-shimmer">
                <div className="aspect-square rounded-[1rem] bg-[rgba(var(--ink-rgb),0.08)]" />
                <div className="mt-3 h-4 rounded-full bg-[rgba(var(--ink-rgb),0.08)]" />
                <div className="mt-2 h-3 w-2/3 rounded-full bg-[rgba(var(--ink-rgb),0.06)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-surface rounded-[2rem] p-6 md:p-8">
          <div className="h-3 w-24 rounded-full bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
          <div className="mt-4 h-10 w-4/5 rounded-[1.25rem] bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded-full bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
            <div className="h-4 w-5/6 rounded-full bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-12 rounded-[1rem] bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <div className="h-12 flex-1 rounded-full bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
            <div className="h-12 flex-1 rounded-full bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-surface rounded-[1.5rem] p-4">
            <div className="h-40 rounded-[1.25rem] bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
            <div className="mt-4 h-4 w-2/3 rounded-full bg-[rgba(var(--ink-rgb),0.08)] animate-shimmer" />
            <div className="mt-2 h-3 w-1/2 rounded-full bg-[rgba(var(--ink-rgb),0.06)] animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-[color:var(--gold)]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(201,168,76,0.18)] border-t-[color:var(--gold)]" />
        <span className="text-sm font-semibold text-muted">Loading the boutique experience…</span>
      </div>
    </div>
  );
}