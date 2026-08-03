// components/about-story-section.tsx
const STATS = [
  { value: "50K+", label: "Galleries created" },
  { value: "5M+", label: "Photos preserved" },
  { value: "120+", label: "Countries reached" },
  { value: "99.9%", label: "Uptime" },
];

export function AboutStorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-medium sm:text-4xl">Why we built FrameVault</h2>
          <p className="mt-4 text-muted-foreground">
            Every event photographer knows the drill: full memory cards,
            scattered drives, and a client waiting on a download link. We
            built FrameVault to collapse all of that into one fast, reliable
            vault — so a gallery goes from shoot to shareable in minutes, not
            days.
          </p>
          <p className="mt-4 text-muted-foreground">
            No more emailing oversized files or losing track of which drive
            holds which event. Upload once, invite the people who need
            access, and let FrameVault handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <p className="text-3xl font-medium text-primary">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
