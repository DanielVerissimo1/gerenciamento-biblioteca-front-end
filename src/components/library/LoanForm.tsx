import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Livro } from "@/models/Livro";

const schema = z.object({
  livroId: z.coerce.number().int().positive("Selecione um livro"),
  nomeAluno: z.string().trim().min(2, "Informe o nome do aluno").max(120),
});

export type LoanFormValues = z.infer<typeof schema>;

export function LoanForm({
  livrosDisponiveis,
  onSubmit,
  submitting,
}: {
  livrosDisponiveis: Livro[];
  onSubmit: (values: LoanFormValues) => void;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { livroId: 0, nomeAluno: "" },
  });

  const selected = watch("livroId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Livro</Label>
        <Select
          value={selected ? String(selected) : ""}
          onValueChange={(v) => setValue("livroId", Number(v), { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um livro disponível" />
          </SelectTrigger>
          <SelectContent>
            {livrosDisponiveis.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum livro disponível
              </div>
            )}
            {livrosDisponiveis.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>
                #{l.id} — {l.titulo} ({l.autor})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.livroId && <p className="text-xs text-destructive">{errors.livroId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nomeAluno">Nome do aluno</Label>
        <Input id="nomeAluno" placeholder="Ex.: Maria Silva" {...register("nomeAluno")} />
        {errors.nomeAluno && (
          <p className="text-xs text-destructive">{errors.nomeAluno.message}</p>
        )}
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Registrando..." : "Registrar empréstimo"}
      </Button>
    </form>
  );
}