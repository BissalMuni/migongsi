"use client";

import { useState, useEffect, useCallback } from "react";
import ListSelect from "./ListSelect";
import AuthModal from "./AuthModal";

interface RoadNameSearchProps {
  onSearch: (params: Record<string, string>) => void;
  authenticated?: boolean;
  authDong?: string;
  authHo?: string;
}

interface DetailsResponse {
  names: string[];
  dongs: string[];
  hos: string[];
}

export default function RoadNameSearch({ onSearch, authenticated, authDong, authHo }: RoadNameSearchProps) {
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [roadName, setRoadName] = useState("");

  const [names, setNames] = useState<string[]>([]);
  const [dongs, setDongs] = useState<string[]>([]);
  const [hos, setHos] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedHo, setSelectedHo] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchDetails = useCallback(
    (name: string, dong: string) => {
      if (!sido || !sigungu || !roadName) return;
      const params = new URLSearchParams({ sido, sigungu, roadName });
      if (name) params.set("name", name);
      if (dong) params.set("dong", dong);
      fetch(`/api/address/details?${params}`)
        .then((res) => res.json())
        .then((data: DetailsResponse) => {
          setNames(data.names);
          setDongs(data.dongs);
          setHos(data.hos);
          setLoaded(true);
        })
        .catch(() => {});
    },
    [sido, sigungu, roadName]
  );

  // 도로명 선택 시 초기 로드
  useEffect(() => {
    if (!sido || !sigungu || !roadName) {
      setNames([]);
      setDongs([]);
      setHos([]);
      setSelectedName("");
      setSelectedDong("");
      setSelectedHo("");
      setLoaded(false);
      return;
    }
    setSelectedName("");
    setSelectedDong("");
    setSelectedHo("");
    fetchDetails("", "");
  }, [sido, sigungu, roadName, fetchDetails]);

  const handleNameChange = (v: string) => {
    setSelectedName(v);
    setSelectedHo("");
    fetchDetails(v, selectedDong);
  };

  const handleDongChange = (v: string) => {
    setSelectedDong(v);
    setSelectedHo("");
    fetchDetails(selectedName, v);
  };

  const handleConfirm = () => {
    // 인증 안 된 상태면 모달 표시
    if (!authenticated) {
      if (!selectedDong || !selectedHo) {
        alert("동과 호를 선택해주세요.");
        return;
      }
      setShowAuthModal(true);
      return;
    }

    // 인증된 상태: 인증된 동/호만 조회 가능
    const dong = authDong || selectedDong;
    const ho = authHo || selectedHo;

    const params: Record<string, string> = {};
    if (sido) params.sido = sido;
    if (sigungu) params.sigungu = sigungu;
    if (roadName) params.roadName = roadName;
    if (selectedName) params.name = selectedName;
    if (dong) params.dong = dong;
    if (ho) params.ho = ho;
    params.page = "1";
    onSearch(params);
  };

  return (
    <div>
      {/* 1단계: 시/도 → 시/군/구 → 도로명 */}
      <div className="listbox-area">
        <div className="listbox-headers">
          <span className="listbox-header col-sido">시/도 선택</span>
          <span className="listbox-header col-sigungu">시/군/구 선택</span>
          <span className="listbox-header col-road">도로명 선택</span>
        </div>
        <div className="listbox-row">
          <div className="listbox-col col-sido">
            <ListSelect
              value={sido}
              onChange={(v) => {
                setSido(v);
                setSigungu("");
                setRoadName("");
              }}
              fetchUrl="/api/address/sido"
            />
          </div>
          <div className="listbox-col col-sigungu">
            <ListSelect
              value={sigungu}
              onChange={(v) => {
                setSigungu(v);
                setRoadName("");
              }}
              fetchUrl={
                sido
                  ? `/api/address/sigungu?sido=${encodeURIComponent(sido)}`
                  : null
              }
              disabled={!sido}
            />
          </div>
          <div className="listbox-col col-road">
            <ListSelect
              value={roadName}
              onChange={setRoadName}
              fetchUrl={
                sido && sigungu
                  ? `/api/address/road?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`
                  : null
              }
              disabled={!sigungu}
            />
          </div>
        </div>
      </div>

      {/* 2단계: 단지명/동/호 선택 */}
      {loaded && (
        <div className="filter-area">
          <div className="listbox-headers">
            <span className="listbox-header col-name">단지명</span>
            <span className="listbox-header col-dong">동</span>
            <span className="listbox-header col-ho">호</span>
          </div>
          <div className="listbox-row">
            <div className="listbox-col col-name">
              <select
                size={8}
                value={selectedName}
                onChange={(e) => handleNameChange(e.target.value)}
                onClick={(e) => {
                  const target = e.target as HTMLOptionElement;
                  if (target.tagName === "OPTION") handleNameChange(target.value);
                }}
                className="list-select"
              >
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="listbox-col col-dong">
              <select
                size={8}
                value={selectedDong}
                onChange={(e) => handleDongChange(e.target.value)}
                onClick={(e) => {
                  const target = e.target as HTMLOptionElement;
                  if (target.tagName === "OPTION") handleDongChange(target.value);
                }}
                className="list-select"
              >
                {dongs.map((d) => (
                  <option key={d} value={d}>
                    {d || "동명없음"}
                  </option>
                ))}
              </select>
            </div>
            <div className="listbox-col col-ho">
              <select
                size={8}
                value={selectedHo}
                onChange={(e) => setSelectedHo(e.target.value)}
                onClick={(e) => {
                  const target = e.target as HTMLOptionElement;
                  if (target.tagName === "OPTION") setSelectedHo(target.value);
                }}
                className="list-select"
              >
                {hos.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="confirm-area">
            <button onClick={handleConfirm} className="btn-confirm">
              공동주택가격(안) 확인
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          dong={selectedDong}
          ho={selectedHo}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
