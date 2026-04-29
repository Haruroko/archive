import Image from "next/image";
import { useEffect, useState } from "react";

export default function Splash() {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 2.5초 후에 페이드 아웃 애니메이션 시작
    const timer = setTimeout(() => setIsExiting(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white font-title-medium antialiased overflow-hidden transition-all
      ${isExiting ? "animate-splash-out pointer-events-none" : "opacity-100"}`} // <--- 이 부분 추가!
    >
      {/* 2. 장식용 배경 광원 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full max-w-7xl bg-cyan-100/30 blur-[150px] rounded-full" />
      </div>

      {/* 3. 로고 영역 */}
      <div className="relative mb-14 animate-floating overflow-visible">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-cyan-400/20 blur-3xl rounded-full" />
        <div className="relative h-20 w-[90vw] max-w-[480px] overflow-visible">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </div>

      {/* 4. 시스템 텍스트 */}
      <div className="text-center mb-12">
        <h1 className="font-title-black text-3xl italic tracking-tighter text-slate-900">
          WELCOME <span className="text-cyan-500">SCHALE</span>
        </h1>
        <p className="mt-2 font-sans text-[10px] tracking-[0.3em] text-slate-400 uppercase">
          Initializing Connection...
        </p>
      </div>

      {/* 5. 로딩바 */}
      <div className="relative w-72 max-w-[80vw]">
        <div className="h-[3px] w-full rounded-full bg-slate-100" />
        <div className="absolute top-0 left-0 h-[3px] animate-loading-fill rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
        <div className="mt-2.5 flex justify-center items-center text-[9px] font-mono tracking-wider text-slate-400">
          <span className="font-bold text-cyan-600/70 animate-pulse">CONNECTING</span>
        </div>
      </div>

      {/* 6. 하단 저작권 */}
      <div className="absolute bottom-12 font-title-light text-[10px] text-slate-400 tracking-widest uppercase opacity-70">
        © 대충 저작권
      </div>
    </div>
  );
}