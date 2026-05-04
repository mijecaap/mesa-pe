"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from "@/hooks/use-categories";
import { useDashboardStore } from "@/stores/dashboard";

interface Category {
  id: string;
  name: string;
  description?: string;
  isVisible: boolean;
  sortOrder: number;
}

function SortableCategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-card p-4 ${isDragging ? "shadow-lg opacity-80" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        <p className="font-medium">{category.name}</p>
        {category.description && (
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>
      <Switch
        checked={category.isVisible}
        onCheckedChange={(checked) =>
          onEdit({ ...category, isVisible: checked })
        }
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(category)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(category.id)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

export default function CategoriesPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: categories, isLoading } = useCategories(activeBusinessId ?? undefined);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();

  const [items, setItems] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", isVisible: true });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (categories) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(categories);
    }
  }, [categories]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      if (activeBusinessId) {
        reorderCategories.mutate({
          businessId: activeBusinessId,
          data: {
            categories: newItems.map((item, index) => ({
              id: item.id,
              sortOrder: index,
            })),
          },
        });
      }
    }
  };

  const handleToggleVisible = (cat: Category) => {
    if (!activeBusinessId) return;
    updateCategory.mutate({
      businessId: activeBusinessId,
      id: cat.id,
      data: { isVisible: !cat.isVisible },
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (!activeBusinessId) return;
    handleDelete(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          businessId: activeBusinessId,
          id: editingCategory.id,
          data: form,
        });
        toast.success("Categoría actualizada");
      } else {
        await createCategory.mutateAsync({
          businessId: activeBusinessId,
          data: form,
        });
        toast.success("Categoría creada");
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setForm({ name: "", description: "", isVisible: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!activeBusinessId) return;
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategory.mutateAsync({ businessId: activeBusinessId, id });
      toast.success("Categoría eliminada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Selecciona un negocio para gestionar categorías.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setForm({ name: "", description: "", isVisible: true });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar categoría" : "Nueva categoría"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isVisible}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isVisible: checked })
                  }
                />
                <Label>Visible</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingCategory ? "Actualizar" : "Crear"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                onEdit={handleToggleVisible}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
