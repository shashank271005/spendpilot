"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

const leadSchema = z.object({
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  role: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function EmailCapture({ auditId }: { auditId: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, auditId }),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error submitting email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="font-semibold text-lg">Report Sent</h3>
        <p className="text-muted-foreground text-sm">We've emailed you a copy of your audit results.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl border border-border/50">
      <h3 className="font-semibold text-lg mb-2">Save Your Results</h3>
      <p className="text-muted-foreground text-sm mb-6">Enter your email to receive a copy of this audit report and get connected with our credit partners if applicable.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input 
            type="email" 
            placeholder="work@company.com" 
            {...register("email")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Company (Optional)" 
            {...register("companyName")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input 
            type="text" 
            placeholder="Role (Optional)" 
            {...register("role")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Email Me My Report"}
        </Button>
      </form>
    </div>
  );
}
