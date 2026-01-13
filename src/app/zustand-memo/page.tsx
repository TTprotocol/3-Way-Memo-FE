"use client";

import React from "react";
import { useMemoStore } from "@/store/zustand/useMemoStore";

export default function ZustandMemo() {
	const [input, setInput] = React.useState("");
	const { memos, fetchMemos, addMemo } = useMemoStore();

	React.useEffect(() => {
		fetchMemos();
	}, [fetchMemos]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await addMemo(input);
		setInput("");
	};

	return (
		<main className="max-w-2xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Memo Board (Zustand)
			</h1>

			<form onSubmit={submit} className="mb-8 flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
					}}
					placeholder="메모를 입력하세요."
					className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
				/>
				<button
					type="submit"
					className="bg-amber-400 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
				>
					저장
				</button>
			</form>
			<div className="space-y-4">
				{memos.length === 0 ? (
					<p className="text-center text-gray-500">작성된 메모가 없습니다.</p>
				) : (
					memos.map((memo) => (
						<div
							key={memo.id}
							className="p-4 bg-white shadow rounded-lg border border-gray-100"
						>
							<p className="text-gray-800 ">{memo.content}</p>
							<span className="text-xs text-gray-400">
								{new Date(memo.create_date).toLocaleString()}
							</span>
						</div>
					))
				)}
			</div>
		</main>
	);
}
