"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools } from '@/lib/pricing-data';

const toolSchema = z.object({
  toolId: z.string().min(1, "Select a tool"),
  plan: z.string().min(1, "Select a plan"),
  monthlySpend: z.number().min(0, "Must be >= 0"),
  seats: z.number().min(1, "Must be >= 1"),
});

const auditSchema = z.object({
  teamSize: z.number().min(1, "Team size must be at least 1"),
  primaryUseCase: z.enum(['coding', 'writing', 'research', 'data', 'mixed']),
  tools: z.array(toolSchema).min(1, "Add at least one tool"),
});

type AuditFormValues = z.infer<typeof auditSchema>;

export function AuditForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: '', plan: '', monthlySpend: 0, seats: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('spendpilot_audit');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setValue('teamSize', parsed.teamSize);
        if (parsed.primaryUseCase) setValue('primaryUseCase', parsed.primaryUseCase);
        if (parsed.tools && parsed.tools.length > 0) setValue('tools', parsed.tools);
      } catch (e) {
        console.error("Failed to parse localStorage", e);
      }
    }
    setIsLoaded(true);
  }, [setValue]);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line react-hooks/incompatible-library
      const subscription = watch((value) => {
        localStorage.setItem('spendpilot_audit', JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isLoaded]);

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit audit");

      const result = await response.json();
      router.push(`/results/${result.slug}`);
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const toolsList = getAllTools();
  const formTools = watch("tools");

  if (!isLoaded) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* General Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Team Size</label>
          <input
            type="number"
            {...register("teamSize", { valueAsNumber: true })}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.teamSize && <p className="text-xs text-destructive">{errors.teamSize.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Use Case</label>
          <select
            {...register("primaryUseCase")}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="coding">Software Development</option>
            <option value="writing">Content/Writing</option>
            <option value="research">Research</option>
            <option value="data">Data Analysis</option>
            <option value="mixed">Mixed/General</option>
          </select>
          {errors.primaryUseCase && <p className="text-xs text-destructive">{errors.primaryUseCase.message}</p>}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Tools List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Tools Stack</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ toolId: '', plan: '', monthlySpend: 0, seats: 1 })}>
            <Plus className="w-4 h-4 mr-2" /> Add Tool
          </Button>
        </div>

        {errors.tools && <p className="text-sm text-destructive">{errors.tools.root?.message || "Please check your tools"}</p>}

        <div className="space-y-4">
          {fields.map((field, index) => {
            const selectedToolId = formTools[index]?.toolId;
            const selectedToolData = toolsList.find(t => t.id === selectedToolId);

            return (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 relative group">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Tool</label>
                  <select
                    {...register(`tools.${index}.toolId`)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onChange={(e) => {
                      const newId = e.target.value;
                      const newTool = toolsList.find(t => t.id === newId);
                      setValue(`tools.${index}.toolId`, newId);
                      if (newTool && newTool.plans.length > 0) {
                        setValue(`tools.${index}.plan`, newTool.plans[0].name);
                      }
                    }}
                  >
                    <option value="">Select tool...</option>
                    {toolsList.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {errors.tools?.[index]?.toolId && <p className="text-xs text-destructive">{errors.tools[index]?.toolId?.message}</p>}
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Plan</label>
                  <select
                    {...register(`tools.${index}.plan`)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={!selectedToolData}
                  >
                    <option value="">Select plan...</option>
                    {selectedToolData?.plans.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Seats</label>
                  <input
                    type="number"
                    {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Monthly Spend ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="md:col-span-1 flex items-end justify-end pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="w-full md:w-11 h-11 text-muted-foreground hover:text-destructive border border-border/50 md:border-transparent mt-2 md:mt-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Stack...</> : "Run Optimization Engine"}
      </Button>
    </form>
  );
}
