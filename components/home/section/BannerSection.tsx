import { ClockIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

const featuredEvent = {
    category: "이벤트 스토리",
    title: "불인의 길",
    subtitle: "~패션쇼 경호 임무!의 서~",
    startDate: "2026-04-28",
    endDate: "2026-05-12",
    image: "/banner/ninjaEvent.png",
};


const pickupStudents = [
    {
        name: "츠쿠요",
        role: "드레스",
        image: "/background/134b852a7d66b32430d51cf61d9b229091d36a31818f5855f0412684cf1a4846.jpeg",
        tags: ["관통", "경장", "스트라이커"],
        likes: 61,
    },
    {
        name: "미치루",
        role: "드레스",
        image: "/background/3b02e696076295fbd3aac22d336ae92c83e3f57bf0a29c8bd5ff8b58ba5a67a3.jpeg",
        tags: ["폭발", "경장", "스페셜"],
        likes: 258,
    },
];

const upcomingEvents = [
    {
        title: "호버크래프트",
        subtitle: "총력전 #82 · 야외",
        startsIn: "6일 후 시작",
        tag: "중장갑",
        image: "/banner/hovercraft.webp",
    },
    {
        title: "세트의 분노",
        subtitle: "제약해제결전 #22 · 야외",
        startsIn: "27일 후 종료",
        tag: "경장갑",
        image: "/banner/furyofset.jpg",
    },
];

export default function BannerSection() {
    const getDaysLeft = (endDate: string) => {
        const now = new Date();

        const kstNow = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
        );

        const end = new Date(endDate);

        const diff = end.getTime() - kstNow.getTime();

        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <section className="relative z-10 w-full p-6 lg:p-10">
            <div className="mx-auto w-full max-w-full flex items-end ml-0 justify-start">
                <div className="mx-auto w-full max-w-5xl flex flex-col items-start ml-0">
                    <h2 className="text-4xl font-black text-gray-100 sm:text-4xl leading-none">이벤트 목록</h2>
                    <article className="group relative w-full max-w-[780px] mt-5 aspect-[16/9] min-h-[280px] overflow-hidden rounded-[8px] bg-slate-900 shadow-[0_18px_42px_rgba(15,23,42,0.24)]">
                        <Image
                            src={featuredEvent.image}
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 780px) 100vw, 960px"
                            className="object-cover transition-transform duration-500 group-hover:scale-101 group-hover:brightness-50 brightness-70 group-hover:transition-all group-hover:ease-in-out group-hover:duration-300"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.48)_54%,rgba(15,23,42,0.92)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7 flex flex-col h-full justify-between">
                            <p className="text-base font-bold" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{featuredEvent.category}</p>
                            <div>
                                <h3
                                    className="mt-3 text-3xl font-semibold leading-tight tracking-tighter sm:text-4xl"
                                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                                >
                                    {featuredEvent.title}
                                </h3>
                                <p className="text-sm font-light tracking-widest" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                                >{featuredEvent.subtitle}</p>
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-base font-normal text-white/86">
                                    <span>{featuredEvent.startDate + ' ~ ' + featuredEvent.endDate}</span>
                                    <span className="inline-flex items-center gap-2 border-l border-white/30 pl-4 text-white">
                                        <ClockIcon width={20} height={20} />
                                        {/* <span className="text-xs font-bold text-white/58">종료까지</span> */}
                                        <p className="text-sm font-black whitespace-nowrap">{getDaysLeft(featuredEvent.endDate) + "일 남음"}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
                <div className="mt-10 grid gap-4 lg:grid-cols-2 w-full">
                    {upcomingEvents.map((event) => (
                        <article
                            key={event.title}
                            className="relative min-h-[250px] overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                        >
                            <Image src={event.image} alt="" fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover opacity-35" />
                            <div className="absolute inset-0 bg-white/30" />
                            <div className="relative flex min-h-[250px] flex-col justify-between p-5">
                                <div>
                                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-600 shadow-sm">
                                        {event.startsIn}
                                    </span>
                                </div>
                                <div className="flex items-end justify-between w-full">
                                    <div className="flex flex-col gap-y-0">
                                        <div className="text-sm font-extralight text-slate-700 leading-none">{event.subtitle}</div>
                                        <div className="text-2xl font-bold text-slate-950">{event.title}</div>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-700 shadow-sm">
                                            {event.tag}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
