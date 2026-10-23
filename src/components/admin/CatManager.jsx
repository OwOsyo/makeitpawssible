import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { HEALTH_STATUSES, statusMeta } from '@/lib/health';
import CatFormDialog from './CatFormDialog';

export default function CatManager({ cats, loading, onChanged }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (current) await base44.entities.Cat.update(current.id, payload);
      else await base44.entities.Cat.create(payload);
      setOpen(false);
      await onChanged();
      toast({ title: current ? `${payload.name} updated` : `${payload.name} added` });
    } catch (error) {
      toast({ title: 'Could not save', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setSaving(true);
    try {
      await base44.entities.Cat.delete(id);
      setOpen(false);
      setDeleteTarget(null);
      await onChanged();
      toast({ title: 'Profile deleted' });
    } catch (error) {
      toast({ title: 'Could not delete', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(cat, status) {
    setBusyId(cat.id);
    try {
      await base44.entities.Cat.update(cat.id, { health_status: status });
      await onChanged();
    } catch (error) {
      toast({ title: 'Could not update status', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">
          {cats.length} profile{cats.length === 1 ? '' : 's'} · changes appear on the landing page immediately.
        </p>
        <button
          type="button"
          onClick={() => {
            setCurrent(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-[3px] bg-foreground px-4 py-2.5 text-[12.5px] font-medium text-background"
        >
          <Plus className="h-3.5 w-3.5" />
          Add a cat
        </button>
      </div>

      <div className="mt-5 divide-y divide-border overflow-hidden rounded-[4px] border border-border bg-card">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profiles…
          </div>
        )}

        {!loading &&
          cats.map((cat) => {
            const status = statusMeta(cat.health_status);
            return (
              <div key={cat.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:p-4">
                <img
                  src={cat.photo_url}
                  alt={cat.name}
                  className="h-12 w-12 shrink-0 rounded-[3px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-heading text-[16px] text-foreground">
                    {cat.name}
                    {cat.ready_for_adoption && (
                      <span className="rounded-full border border-primary/30 bg-[#A8DADC]/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#1D3557]">
                        Adoptable
                      </span>
                    )}
                    {cat.featured && (
                      <span className="rounded-full border border-accent/30 bg-[#E63946]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#E63946]">
                        Featured
                      </span>
                    )}
                    {cat.active === false && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {cat.location || 'No location'} · {cat.age_label || 'Age unknown'}
                  </p>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <Select
                      value={cat.health_status}
                      onValueChange={(v) => handleStatus(cat, v)}
                      disabled={busyId === cat.id}
                    >
                      <SelectTrigger className="h-9 w-[135px] text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(HEALTH_STATUSES).map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrent(cat);
                      setOpen(true);
                    }}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-foreground transition-colors hover:border-foreground/40 sm:ml-0"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(cat)}
                    aria-label={`Delete ${cat.name}'s profile`}
                    className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <CatFormDialog
        open={open}
        cat={current}
        saving={saving}
        onOpenChange={setOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.name} from the dashboard?</AlertDialogTitle>
            <AlertDialogDescription>
              Use this when a cat has been adopted or has moved off campus. This permanently deletes
              their profile and health chart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep profile</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDelete(deleteTarget.id)}
            >
              Delete profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}