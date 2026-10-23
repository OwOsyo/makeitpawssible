import { useCallback, useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TeamManager() {
  const { user: me } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const load = useCallback(async () => {
    const list = await base44.entities.User.list();
    setUsers(
      [...list].sort((a, b) => (a.full_name || a.email || '').localeCompare(b.full_name || b.email || ''))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function invite(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await base44.users.inviteUser(email.trim(), role);
      toast({
        title: 'Invite sent',
        description: `${email.trim()} can join as ${role === 'admin' ? 'an administrator' : 'a team member'}.`,
      });
      setEmail('');
      await load();
    } catch (error) {
      toast({
        title: 'Could not send invite',
        description: 'Check the email address and try again.',
        variant: 'destructive',
      });
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(target, nextRole) {
    if (target.role === nextRole || target.id === me?.id) return;
    setBusyId(target.id);
    try {
      await base44.entities.User.update(target.id, { role: nextRole });
      await load();
      toast({
        title: `${target.email} is now ${nextRole === 'admin' ? 'an administrator' : 'a team member'}.`,
      });
    } catch (error) {
      toast({
        title: 'Could not change the role',
        description: 'Try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser() {
    if (!removeTarget) return;
    setBusyId(removeTarget.id);
    try {
      await base44.entities.User.delete(removeTarget.id);
      setRemoveTarget(null);
      await load();
      toast({ title: 'Member removed' });
    } catch (error) {
      toast({
        title: 'Could not remove member',
        description: 'Try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={invite} className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="font-heading text-xl text-foreground">Add a team member</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          They get an email invite to join the app. Administrators can manage cats, donations and page text.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@guiscn.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Role</Label>
            <div className="mt-1.5 inline-flex overflow-hidden rounded-[3px] border border-border">
              {[
                { key: 'admin', label: 'Admin' },
                { key: 'user', label: 'Member' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`px-4 py-2 text-[12px] transition-colors ${
                    role === r.key ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-foreground px-5 py-2.5 text-[13px] font-medium text-background disabled:opacity-50"
          >
            {inviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            Send invite
          </button>
        </div>
      </form>

      <div className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-heading text-xl text-foreground">
          <ShieldCheck className="h-4 w-4 text-accent" strokeWidth={1.8} />
          Team members
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {users.map((u) => {
              const isMe = u.id === me?.id;
              return (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-foreground">
                      {u.full_name || u.email}
                      {isMe && (
                        <span className="ml-2 rounded-[3px] bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex overflow-hidden rounded-[3px] border border-border">
                      <button
                        type="button"
                        onClick={() => changeRole(u, 'admin')}
                        disabled={isMe || busyId === u.id}
                        className={`px-3 py-1.5 text-[11.5px] disabled:opacity-40 ${
                          u.role === 'admin' ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => changeRole(u, 'user')}
                        disabled={isMe || busyId === u.id}
                        className={`px-3 py-1.5 text-[11.5px] disabled:opacity-40 ${
                          u.role !== 'admin' ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'
                        }`}
                      >
                        Member
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(u)}
                      disabled={isMe || busyId === u.id}
                      aria-label={`Remove ${u.email}`}
                      className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Members can decorate cats in the studio; administrators can manage everything.
        </p>
      </div>

      <AlertDialog open={!!removeTarget} onOpenChange={(v) => !v && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removeTarget?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes their account and access to the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={removeUser}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}