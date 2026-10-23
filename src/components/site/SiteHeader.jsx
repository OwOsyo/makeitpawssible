import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PawPrint, LogOut, ShieldCheck, ShoppingBag, Sparkles, MessagesSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const HASH_LINKS = [
  { label: 'The colony', hash: '#cats' },
  { label: 'How we care', hash: '#care' },
];

export default function SiteHeader({ settings }) {
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const name = settings?.collective_name || 'Campus Cat Collective';
  const onHome = location.pathname === '/';
  const isAdmin = user?.role === 'admin';
  const hashHref = (hash) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-background/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-primary text-primary-foreground">
            <PawPrint className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-[17px] text-foreground">{name}</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Student guardians
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {HASH_LINKS.map((item) => (
            <a
              key={item.hash}
              href={hashHref(item.hash)}
              className="text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/studio"
            className="inline-flex items-center gap-1.5 text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Bedazzle
          </Link>
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessagesSquare className="h-3.5 w-3.5" strokeWidth={1.8} />
            Community
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.8} />
            Shop
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              Admin
            </Link>
          )}
          <a
            href={hashHref('#donate')}
            className="rounded-[3px] bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-all hover:brightness-95"
          >
            Donate
          </a>
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => base44.auth.logout('/login')}
            className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-border text-foreground md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {HASH_LINKS.map((item) => (
            <a
              key={item.hash}
              href={hashHref(item.hash)}
              onClick={() => setOpen(false)}
              className="block border-b border-border/70 py-3.5 font-heading text-lg text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/studio"
            onClick={() => setOpen(false)}
            className="block border-b border-border/70 py-3.5 font-heading text-lg text-foreground"
          >
            Bedazzle studio
          </Link>
          <Link
            to="/community"
            onClick={() => setOpen(false)}
            className="block border-b border-border/70 py-3.5 font-heading text-lg text-foreground"
          >
            Community wall
          </Link>
          <Link
            to="/shop"
            onClick={() => setOpen(false)}
            className="block border-b border-border/70 py-3.5 font-heading text-lg text-foreground"
          >
            Shop
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block border-b border-border/70 py-3.5 font-heading text-lg text-foreground"
            >
              Guardian desk
            </Link>
          )}
          <a
            href={hashHref('#donate')}
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-[3px] bg-accent px-5 py-3 text-center text-sm font-medium text-accent-foreground"
          >
            Donate now
          </a>
          <button
            type="button"
            onClick={() => base44.auth.logout('/login')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[3px] border border-border px-5 py-2.5 text-[13px] text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}