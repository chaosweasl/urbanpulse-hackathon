"use client";
import type { Pulse } from "@/types";

export interface PulseFormProps {
  pulse?: Pulse; // Optional pulse for edit mode
  onSuccess?: () => void;
}
