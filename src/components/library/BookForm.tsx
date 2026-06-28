import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          placeholder="Ex.: Dom Casmurro"
          aria-invalid={Boolean(errors.titulo)}
          aria-describedby={errors.titulo ? "titulo-error" : undefined}
          autoFocus
          {...register("titulo")}
        />
        {errors.titulo && (
          <p id="titulo-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.titulo.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="autor">Autor</Label>
        <Input
          id="autor"
          placeholder="Ex.: Machado de Assis"
          aria-invalid={Boolean(errors.autor)}
          aria-describedby={errors.autor ? "autor-error" : undefined}
          {...register("autor")}
        />
        {errors.autor && (
          <p id="autor-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.autor.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="genero">Gênero</Label>
        <Input
          id="genero"
          placeholder="Ex.: Romance"
          aria-invalid={Boolean(errors.genero)}
          aria-describedby={errors.genero ? "genero-error" : "genero-help"}
          {...register("genero")}
        />
        {!errors.genero && (
          <p id="genero-help" className="text-xs text-muted-foreground">
            Use um gênero objetivo para facilitar futuras buscas.
          </p>
        )}
        {errors.genero && (
          <p id="genero-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.genero.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? <Loader2 className="animate-spin" /> : <Save />}
        {submitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
