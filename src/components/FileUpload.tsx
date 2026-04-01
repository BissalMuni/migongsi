"use client";

import { useState, useRef } from "react";

interface UploadResponse {
  message?: string;
  count?: number;
  error?: string;
  details?: string[];
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
    details?: string[];
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "업로드 완료", type: "success" });
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setMessage({
          text: data.error || "업로드 실패",
          type: "error",
          details: data.details,
        });
      }
    } catch {
      setMessage({ text: "업로드 중 오류가 발생했습니다.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      {/* 서식 정보 */}
      <div className="upload-format-info">
        <h4>엑셀 업로드 서식 [한국부동산원 제공 서식 그대로 업로드(공시기준 별도 추가 필요)]</h4>
        <table className="format-table">
          <thead>
            <tr>
              <th>주택_일련번호</th>
              <th>소재지</th>
              <th>명칭</th>
              <th>동</th>
              <th>호</th>
              <th>전용면적(㎡)</th>
              <th>공시가격(원)</th>
              <th>공시기준</th>
              <th>이름</th>
              <th>생년월일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>서울 강남 삼성 영동대로128길 15</td>
              <td>아크로삼성</td>
              <td>101</td>
              <td>201</td>
              <td>104.9</td>
              <td>3092000000</td>
              <td>20260101</td>
              <td>홍길동</td>
              <td>19850101</td>
            </tr>
          </tbody>
        </table>
        <a href="/api/template" download className="btn-template">
          서식 다운로드
        </a>
      </div>

      {/* 파일 선택 */}
      <div className="upload-dropzone">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setMessage(null);
          }}
        />
        {file && (
          <p className="upload-file-info">
            선택된 파일: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn-upload"
      >
        {uploading ? "업로드 중..." : "업로드"}
      </button>

      {/* 결과 메시지 */}
      {message && (
        <div className={`upload-message ${message.type}`}>
          <p>{message.text}</p>
          {message.details && message.details.length > 0 && (
            <ul className="upload-error-list">
              {message.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
