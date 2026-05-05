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
import { GripVertical, Pencil, Trash2, Plus, Loader2, Tag, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from "@/hooks/use-categories";
import { useDashboardStore } from "@/stores/dashboard";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
  isVisible: boolean;
  sortOrder: number;
}

function SortableCategoryItem({
  category,
  onToggleVisible,
  onEditClick,
  onDelete,
  isEditing,
  editForm,
  onSaveEdit,
  onCancelEdit,
  onEditFormChange,
}: {
  category: Category;
  onToggleVisible: (cat: Category) => void;
  onEditClick: (cat: Category) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editForm: { name: string; description: string; isVisible: boolean };
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditFormChange: (field: string, value: string | boolean) => void;
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

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-4">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-warm-gray">Nombre</Label>
              <Input
                value={editForm.name}
                onChange={(e) => onEditFormChange("name", e.target.value)}
                className="mt-1 rounded-xl border-sand bg-white text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
              />
            </div>
            <div>
              <Label className="text-xs text-warm-gray">Descripción</Label>
              <Input
                value={editForm.description}
                onChange={(e) => onEditFormChange("description", e.target.value)}
                className="mt-1 rounded-xl border-sand bg-white text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={editForm.isVisible}
                onCheckedChange={(checked) => onEditFormChange("isVisible", checked)}
              />
              <span className="text-sm text-coffee">Visible en la carta</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onCancelEdit}
                className="rounded-xl border-sand"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSaveEdit}
                className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-white p-3.5 transition-shadow ${
        isDragging
          ? "border-terracotta/30 shadow-lg opacity-90"
          : "border-sand shadow-sm hover:shadow-md"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-warm-gray transition-colors hover:bg-sand/60 active:cursor-grabbing"
        aria-label="Reordenar categoría"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-coffee">{category.name}</p>
        {category.description && (
          <p className="truncate text-xs text-warm-gray">{category.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Switch
          checked={category.isVisible}
          onCheckedChange={() => onToggleVisible(category)}
          aria-label={`${category.isVisible ? "Ocultar" : "Mostrar"} ${category.name}`}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEditClick(category)}
          className="h-8 w-8 rounded-lg text-warm-gray hover:bg-sand/60 hover:text-coffee"
          aria-label={`Editar ${category.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(category.id)}
          className="h-8 w-8 rounded-lg text-warm-gray hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${category.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
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
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", description: "", isVisible: true });
  const [editForm, setEditForm] = useState({ name: "", description: "", isVisible: true });

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

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({
      name: cat.name,
      description: cat.description || "",
      isVisible: cat.isVisible,
    });
  };

  const handleSaveEdit = async () => {
    if (!activeBusinessId || !editingId) return;
    try {
      await updateCategory.mutateAsync({
        businessId: activeBusinessId,
        id: editingId,
        data: editForm,
      });
      toast.success("Categoría actualizada");
      setEditingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!activeBusinessId) return;
    if (!confirm("¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;
    try {
      await deleteCategory.mutateAsync({ businessId: activeBusinessId, id });
      toast.success("Categoría eliminada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;
    try {
      await createCategory.mutateAsync({
        businessId: activeBusinessId,
        data: createForm,
      });
      toast.success("Categoría creada");
      setIsCreating(false);
      setCreateForm({ name: "", description: "", isVisible: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Tag className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para gestionar las categorías de tu menú.
          </p>
        </div>
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-deep"
        >
          Ir a Mi Negocio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-coffee">Categorías</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Organiza tu menú en categorías. Arrastra para reordenar.
          </p>
        </div>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva categoría
          </Button>
        )}
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-4"
        >
          <p className="mb-3 text-sm font-semibold text-coffee">Nueva categoría</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-warm-gray">Nombre</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Ej: Entradas"
                required
                className="mt-1 rounded-xl border-sand bg-white text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
              />
            </div>
            <div>
              <Label className="text-xs text-warm-gray">Descripción</Label>
              <Input
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Opcional"
                className="mt-1 rounded-xl border-sand bg-white text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={createForm.isVisible}
                onCheckedChange={(checked) =>
                  setCreateForm({ ...createForm, isVisible: checked })
                }
              />
              <span className="text-sm text-coffee">Visible en la carta</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
                className="rounded-xl border-sand"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createCategory.isPending}
                className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
              >
                {createCategory.isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Crear
              </Button>
            </div>
          </div>
        </form>
      )}

      {items.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sand bg-white py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/40">
            <Tag className="h-6 w-6 text-warm-gray" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-coffee">Sin categorías aún</p>
            <p className="max-w-xs text-sm text-warm-gray">
              Las categorías ayudan a tus clientes a encontrar lo que buscan más rápido.
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="rounded-xl border-sand"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear primera categoría
          </Button>
        </div>
      ) : (
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
                  onToggleVisible={handleToggleVisible}
                  onEditClick={handleEditClick}
                  onDelete={handleDelete}
                  isEditing={editingId === category.id}
                  editForm={editForm}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onEditFormChange={(field, value) =>
                    setEditForm((prev) => ({ ...prev, [field]: value }))
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
