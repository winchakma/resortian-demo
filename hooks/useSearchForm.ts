"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchFormData } from "@/types";

interface UseSearchFormOptions {
  initialValues?: Partial<SearchFormData>;
}

export function useSearchForm(options?: UseSearchFormOptions) {
  const router = useRouter();

  const [formData, setFormData] = useState<SearchFormData>({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
    ...options?.initialValues,
  });

  const updateField = useCallback(
    <K extends keyof SearchFormData>(field: K, value: SearchFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const params = new URLSearchParams();
    if (formData.location) params.set("location", formData.location);
    if (formData.checkIn) params.set("checkIn", formData.checkIn);
    if (formData.checkOut) params.set("checkOut", formData.checkOut);
    params.set("adults", String(formData.adults));
    params.set("children", String(formData.children));
    params.set("rooms", String(formData.rooms));
    router.push(`/hotels?${params.toString()}`);
  }, [formData, router]);

  return { formData, updateField, handleSubmit };
}
