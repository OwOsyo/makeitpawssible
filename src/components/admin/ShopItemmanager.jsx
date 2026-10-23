import { useCallback, useEffect, useState } from 'react';
import { Loader2, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
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
import ImageUploadField from './ImageUploadField';

const BLANK = { name: '', description: '', price: '', stock: 10, photo_url: '', active: true };

export default function ShopItemManager() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    const list = await base44.entities.ShopItem.list('-created_date');
    setItems(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function openCreate() {
    setEditing(null);
    setForm(BLANK);
    setDialogOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      stock: item.stock ?? 0,
      photo_url: item.photo_url || '',
      active: item.active !== false,
    });
    setDialogOpen(true);
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || form.price === '') return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      photo_url: form.photo_url,
      active: form.active,
    };
    try {
      if (editing) await base44.entities.ShopItem.update(editing.id, payload);
      else await base44.entities.ShopItem.create(payload);
      setDialogOpen(false);
      await load();
      toast({ title: editing ? 'Item updated' : 'Item added to the shop' });
    } catch (error) {
      toast({ title: 'Could not save the item', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await base44.entities.ShopItem.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
      toast({ title: 'Item deleted' });
    } catch (error) {
      toast({ title: 'Could not delete', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-[4px] border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-accent" strokeWidth={1.8} />
            <h2 className="font-heading text-xl text-foreground">Shop items</h2>
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
            Add, edit or remove what you sell. Inactive items are hidden from the shop.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] bg-foreground px-4 py-2.5 text-[12.5px] font-medium text-background"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[3px] bg-secondary">
                {item.photo_url && <Image src={item.photo_url} alt={item.name} className="h-full w-full" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-foreground">
                  {item.name}
                  {item.active === false && (
                    <span className="ml-2 rounded-[3px] bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  ${Number(item.price).toFixed(2)} · {item.stock || 0} in stock
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-foreground transition-colors hover:border-foreground/40"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  disabled={busyId === item.id}
                  aria-label={`Delete ${item.name}`}
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-6 text-center text-[13px] text-muted-foreground">
              No items yet — add your first key ring or sticker pack.
            </li>
          )}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : 'Add a shop item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="item-name">Name</Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Mochi key ring"
                className="mt-1.5"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="item-price">Price ($)</Label>
                <Input
                  id="item-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="item-stock">Stock</Label>
                <Input
                  id="item-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                rows={2}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Handmade clay key ring of our favourite tabby."
                className="mt-1.5"
              />
            </div>
            <ImageUploadField
              label="Product photo"
              value={form.photo_url}
              alt="Product photo"
              onChange={(url) => set('photo_url', url)}
            />
            <label className="flex items-center gap-2 text-[12.5px] text-foreground">
              <Checkbox
                checked={form.active}
                onCheckedChange={(v) => set('active', v === true)}
              />
              Show in the shop
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] bg-foreground px-4 py-3 text-[13px] font-medium text-background disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editing ? 'Save changes' : 'Add item'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the item from the shop permanently. Existing orders are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}