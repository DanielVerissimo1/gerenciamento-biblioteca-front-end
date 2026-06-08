import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Livro } from "@/models/Livro";

const schema = z.object({
  titulo: z.string().trim().min(1, "Informe o título").max(200),
  autor: z.string().trim().min(1, "Informe o autor").max(120),
  genero: z.string().trim().min(1, "Informe o gênero").max(80),
});

export type BookFormValues = z.infer<typeof schema>;

export function BookForm({
  initial,
  onSubmit,
  submitting,
  submitLabel = "Salvar",
}: {
  initial?: Livro | null;
  onSubmit: (values: BookFormValues) => void;
  submitting?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { titulo: "", autor: "", genero: "" },
  });

  useEffect(() => {
    reset({
      titulo: initial?.titulo ?? "",
      autor: initial?.autor ?? "",
      genero: initial?.genero ?? "",
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" placeholder="Ex.: Dom Casmurro" {...register("titulo")} />
        {errors.titulo && <p className="text-xs text-destructive">{errors.titulo.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="autor">Autor</Label>
        <Input id="autor" placeholder="Ex.: Machado de Assis" {...register("autor")} />
        {errors.autor && <p className="text-xs text-destructive">{errors.autor.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="genero">Gênero</Label>
        <Input id="genero" placeholder="Ex.: Romance" {...register("genero")} />
        {errors.genero && <p className="text-xs text-destructive">{errors.genero.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}