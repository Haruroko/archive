import Image from "next/image";
import { useState } from "react"

interface MenuType {
    img?: string;
    enName: string;
    name: string;
    link: string;
}

interface MenuButtonProps {
  menu: MenuType;
}

export default function Header() {
    const menuList: MenuType[] = [
        { img: " ", enName: "STUDENTS", name: "학생명부", link: "students" },
        { img: " ", enName: "FUTUREKNOWLEDGE", name: "미래시", link: "futureKnowledge" },
        { img: " ", enName: "NEWS", name: "업데이트", link: "news" },
        { img: " ", enName: "UNIVERSE", name: "세계관", link: "universe" },
        { img: " ", enName: "MOMOTALK", name: "모모톡", link: "momotalk" },
        { img: " ", enName: "SOCIAL", name: "FruLink", link: "social" },
    ]
    return (
        <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/60 bg-white px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-10">
                <Image width={150} height={0} src={"/logo.png"} alt="2" />
                {menuList.map((data, index) => {
                    return (
                        <MenuButton key={index} menu={data} />
                    )
                })}
            </div>
        </header>
    )
}

const MenuButton = ({ menu }: MenuButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer flex flex-col items-start group py-2 relative mt-1.5" // group 클래스 추가
    >
      {/* 영어 이름: Fade-in + Slide 효과 */}
      <p
        className={`text-[10px] font-extralight text-blue-500 transition-all duration-300 ease-out absolute -top-1 -translate-y-1/2
        ${hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
      >
        {menu.enName}
      </p>

      {/* 한국어 이름: 살짝 강조 */}
      <h1 className={`font-light text-base transition-colors duration-300
        ${hover ? "text-black underline underline-offset-8" : "text-slate-500"}`}
      >
        {menu.name}
      </h1>
    </div>
  );
};