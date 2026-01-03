"use client";

import React from "react";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchMemos, addMemo } from "@/store/redux/memoSlice";

export default function ReduxMemoPage() {
	const [input, setInput] = React.useState("");
	const dispatch = useDispatch<AppDispatch>();
	const { memos } = useSelector((state: RootState) => state.memos);

	React.useEffect(() => {
		dispatch(fetchMemos());
	}, [dispatch]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await dispatch(addMemo(input));
		setInput("");
	};

	return (
		<main className="max-w-2xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Memo Board (Redux)
			</h1>

			<form onSubmit={submit} className="mb-8 flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="메모를 입력하세요."
					className="flex-1 p-3 border rounded-lg text-white"
				/>
				<button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
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
