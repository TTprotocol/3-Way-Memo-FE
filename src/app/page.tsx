"use client";

import React from "react";
import Link from "next/link";

export default function Main() {
	const tools = [
		{
			name: "Redux Toolkit",
			href: "/redux-memo",
			description: "엄격하고 체계적인 전역 상태 관리",
			color: "hover:border-purple-500 hover:shadow-purple-500/20",
			textColor: "text-purple-400",
		},
		{
			name: "Zustand",
			href: "/zustand-memo",
			description: "가볍고 유연한 최신 상태 관리",
			color: "hover:border-amber-500 hover:shadow-amber-500/20",
			textColor: "text-amber-400",
		},
		{
			name: "TanStack Query",
			href: "/query-memo",
			description: "강력한 서버 데이터 동기화",
			color: "hover:border-rose-500 hover:shadow-rose-500/20",
			textColor: "text-rose-400",
		},
	];

	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100">
			<div className="max-w-4xl w-full space-y-12">
				<header className="text-center space-y-4">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
						3-Way Memo Board
					</h1>
					<p className="text-slate-400 text-lg">
						탐색하고 싶은 상태관리 라이브러리를 선택하세요.
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{tools.map((tool) => (
						<Link
							key={tool.name}
							href={tool.href}
							className={`group relative p-8 rounded-2xl border border-slate-800 bg-slate-900/50 
                transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${tool.color}`}
						>
							<div className="flex flex-col h-full justify-between space-y-4">
								<div>
									<h2 className={`text-2xl font-bold mb-2 ${tool.textColor}`}>
										{tool.name}
									</h2>
									<p className="text-slate-400 text-sm leading-relaxed">
										{tool.description}
									</p>
								</div>
								<div className="pt-4">
									<span className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-slate-500 group-hover:text-slate-200 transition-colors">
										입장하기 &rarr;
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
