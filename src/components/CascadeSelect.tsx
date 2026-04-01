"use client";

import { useEffect, useState } from "react";
import { AddressOption } from "@/types";

interface CascadeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fetchUrl: string | null;
  disabled?: boolean;
  placeholder?: string;
}

export default function CascadeSelect({
  label,
  value,
  onChange,
  fetchUrl,
  disabled = false,
  placeholder = "선택",
}: CascadeSelectProps) {
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fetchUrl) {
      setOptions([]);
      return;
    }

    setLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data: AddressOption[]) => {
        setOptions(data);
      })
      .catch(() => {
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchUrl]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span className="search-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="search-select"
      >
        <option value="">{loading ? "로딩중..." : placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
