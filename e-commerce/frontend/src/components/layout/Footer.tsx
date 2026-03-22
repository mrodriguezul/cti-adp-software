export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">LP</span>
            </div>
            <span className="text-sm font-semibold text-foreground">LPA eComms</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LPA eComms. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
