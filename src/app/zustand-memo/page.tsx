"use client";

import React from "react";
import Link from "next/link";
import { useMemoStore } from "@/store/zustand/useMemoStore";
import { Home, Pen, Check, X } from "lucide-react";

export default function ZustandMemo() {
	const connected = useMemoStore((state) => state.connected);
	const memos = useMemoStore((state) => state.memos);
	const { isConnect, fetchMemos, addMemo, updateMemo, deleteMemo } =
		useMemoStore();

	const [input, setInput] = React.useState("");
	const [editingId, setEditingId] = React.useState<number | null>(null);
	const [editText, setEditText] = React.useState("");

	React.useEffect(() => {
		const init = async () => {
			const connectCheck = await isConnect();
			if (connectCheck) fetchMemos();
		};

		init();
	}, []);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await addMemo(input);
		setInput("");
	};

	// 수정 모드 진입 함수
	const startEdit = (id: number, content: string) => {
		setEditingId(id);
		setEditText(content);
	};

	// 실제 수정을 요청하는 함수
	const handleUpdate = async (id: number) => {
		if (!editText.trim()) return;

		await updateMemo(id, editText);
		setEditingId(null);
		setEditText("");
	};

	const handleDelete = async (id: number) => {
		await deleteMemo(id);
		// await fetchMemos();
	};

	return (
		<main className="max-w-2xl mx-auto p-8">
			<Link href="/">
				<Home />
			</Link>
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
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							submit(e);
						}
					}}
					placeholder="메모를 입력하세요."
					className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
				/>
				<button
					className={`text-white px-6 py-3 rounded-lg hover:bg-amber-700, connected ${connected ? "bg-amber-400" : "bg-gray-500"}`}
					disabled={connected}
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
							className={`p-4 bg-white shadow rounded-lg border flex justify-between items-center transition-colors ${
								editingId === memo.id
									? "border-purple-400 bg-purple-50"
									: "border-gray-100"
							}`}
						>
							{editingId === memo.id ? (
								// 수정 모드 UI
								<div className="flex-1 flex gap-2 mr-4">
									<input
										type="text"
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className="flex-1 p-1 border-b-2 border-purple-400 outline-none text-gray-800 bg-transparent"
										autoFocus
									/>
								</div>
							) : (
								// 일반 모드 UI
								<div>
									<p className="text-gray-800">{memo.content}</p>
									<span className="text-xs text-gray-400">
										{memo.create_date &&
											new Date(memo.create_date).toLocaleString()}
									</span>
								</div>
							)}

							<div className="flex gap-4">
								{editingId === memo.id ? (
									<>
										<button onClick={() => handleUpdate(memo.id)}>
											<Check color="green" size={20} strokeWidth={2} />
										</button>
										<button onClick={() => setEditingId(null)}>
											<X color="gray" size={20} strokeWidth={2} />
										</button>
									</>
								) : (
									<>
										<button onClick={() => startEdit(memo.id, memo.content)}>
											<Pen color="black" size={20} strokeWidth={1} />
										</button>
										<button onClick={() => handleDelete(memo.id)}>
											<X color="black" size={20} strokeWidth={1} />
										</button>
									</>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</main>
	);
}
