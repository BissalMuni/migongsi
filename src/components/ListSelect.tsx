"use client";

import { useEffect, useState } from "react";
import { AddressOption } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ListSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  fetchUrl: string | null;
  disabled?: boolean;
}

export default function ListSelect({
  label,
  value,
  onChange,
  fetchUrl,
  disabled = false,
}: ListSelectProps) {
  const isMobile = useIsMobile();
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fetchUrl) {
      setOptions([]);
      return;
    }

    setLoading(true);
    console.log("[ListSelect] fetching:", fetchUrl);
    fetch(fetchUrl)
      .then((res) => {
        console.log("[ListSelect] response status:", res.status, fetchUrl);
        return res.json();
      })
      .then((data: AddressOption[]) => {
        console.log("[ListSelect] data:", data, fetchUrl);
        setOptions(data);
        // PC에서만 자동 선택 (모바일은 네이티브 드롭다운이므로 사용자가 직접 선택)
        if (data.length === 1 && !value && window.innerWidth > 768) {
          onChange(data[0].value);
        }
      })
      .catch((err) => {
        console.error("[ListSelect] error:", err, fetchUrl);
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchUrl]);

  return (
    <div className="list-select-wrap">
      {label && <p className="list-select-label">{label}</p>}
      <select
        size={isMobile ? undefined : 10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          const target = e.target as HTMLOptionElement;
          if (target.tagName === "OPTION") {
            onChange(target.value);
          }
        }}
        disabled={disabled || loading}
        className="list-select"
      >
        {loading && <option disabled>로딩중...</option>}
        {!loading && isMobile && !value && options.length > 0 && (
          <option value="">선택하세요</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
