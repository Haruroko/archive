import { type CSSProperties, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface BackgroundSideBarProps {
  activeIndex: number;
  isAutoRotate: boolean;
  setIsAutoRotate: Dispatch<SetStateAction<boolean>>;
  previewBackgrounds: {
    id: string;
    src: string;
  }[];
  changeBackground: (nextIndex: number) => void;
}

const PANEL_WIDTH = 320;

export default function BackgroundSideBar({
  activeIndex,
  isAutoRotate,
  setIsAutoRotate,
  previewBackgrounds,
  changeBackground,
}: BackgroundSideBarProps) {
  return (
    <aside className="pointer-events-none absolute right-0 top-24 z-30 h-0 w-0 overflow-visible">
      <div className="group pointer-events-auto absolute right-0 top-0 h-0 w-0 overflow-visible">
        <div
          className="absolute right-0 top-0 flex items-center transition-transform duration-300 ease-out group-hover:-translate-x-[320px] group-focus-within:-translate-x-[320px]"
          style={{ "--panel-width": `${PANEL_WIDTH}px` } as CSSProperties}
        >
          <button
            type="button"
            className="flex h-24 w-10 items-center justify-center rounded-l-[20px] border border-r-0 border-white/70 bg-white/78 shadow-[0_10px_30px_rgba(94,125,177,0.18)] backdrop-blur-md"
          >
            <span className="text-lg font-black tracking-[0.1em] text-slate-600 [writing-mode:vertical-rl]">
              배경
            </span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-[320px] translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-within:translate-x-0">
          <InfoCard
            eyebrow="Background"
            title="배경 선택"
            body={
              isAutoRotate
                ? "자동 순환이 켜져 있습니다. 다음 배경은 랜덤이며 직전 배경은 바로 다시 나오지 않습니다."
                : "자동 순환이 꺼져 있습니다. 원하는 배경을 직접 골라 고정할 수 있습니다."
            }
            accent="from-sky-200 via-cyan-100 to-white"
          >
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/72 px-4 py-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.26em] text-slate-400">Auto Rotate</div>
                <div className="text-sm font-bold text-slate-700">{isAutoRotate ? "켜짐" : "꺼짐"}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoRotate((current) => !current)}
                className={`rounded-full px-4 py-2 text-sm font-black shadow-sm transition-colors cursor-pointer ${
                  isAutoRotate ? "bg-slate-800 text-white" : "bg-white text-slate-700"
                }`}
              >
                {isAutoRotate ? "자동 순환 중" : "자동 순환 끔"}
              </button>
            </div>

            <div className="mt-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-hide">
              <div className="grid grid-cols-3 gap-2 ">
                {previewBackgrounds.map((background, index) => (
                  <button
                    key={background.src}
                    type="button"
                    onClick={() => changeBackground(index)}
                    className={`cursor-pointer group/thumb overflow-hidden rounded-2xl border text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                      index === activeIndex ? "border-sky-400 ring-2 ring-sky-300/70" : "border-white/80"
                    }`}
                  >
                    <div
                      className="h-16 w-full bg-cover bg-center transition-transform duration-300 group-hover/thumb:scale-105"
                      style={{ backgroundImage: `url("${background.src}")` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </aside>
  );
}

function InfoCard({
  eyebrow,
  title,
  body,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`max-h-[calc(100vh-10rem)] overflow-hidden rounded-tl-none rounded-l-[30px] rounded-r-none border border-r-0 border-white/70 bg-gradient-to-br ${accent} p-4 shadow-[0_16px_42px_rgba(99,129,184,0.15)]`}
    >
      <div className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500/70">{eyebrow}</div>
      <div className="mt-2 text-xl font-black text-slate-800">{title}</div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{body}</p>
      {children}
    </div>
  );
}
