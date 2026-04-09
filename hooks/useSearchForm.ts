"use client";

import { useState, useCallback } from "react";
import type { SearchFormData } from "@/types";

export function useSearchForm() {
  const [formData, setFormData] = useState<SearchFormData>({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const updateField = useCallback(
    <K extends keyof SearchFormData>(field: K, value: SearchFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    console.log("Search submitted:", formData);
  }, [formData]);

  return { formData, updateField, handleSubmit };
}
