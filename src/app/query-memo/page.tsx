"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

export default function QueryMemoPage() {
	const [input, setInput] = React.useState("");
	const queryClient = useQueryClient();

	const { data: connected, isLoading: isConnectLoading } = useQuery({
		queryKey: ["dbStatus"],
		queryFn: async () => {
			try {
				const response = await api.get("/api/connect");
				return response.data.status;
			} catch (error) {
				return false;
			}
		},
	});

	// 메모 목록 조회
	const { data: memos = [], isLoading } = useQuery({
		queryKey: ["memos"],
		queryFn: async () => {
			const response = await api.get("/api/memos");
			return response.data;
		},
		enabled: !!connected,
	});

	// 메모 추가
	const mutation = useMutation({
		mutationFn: (content: string) => api.post("/api/memos", { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memos"] });
		},
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!connected || !input.trim()) return;

		mutation.mutate(input);
		setInput("");
	};

	if (isLoading) return <div className="text-center p-10">로딩 중...</div>;

	return (
		<main className="max-w-2xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Memo Board (Query)
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
					className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
				>
					저장
				</button>
			</form>
			<div className="space-y-4">
				{memos.length === 0 ? (
					<p className="text-center text-gray-500">작성된 메모가 없습니다.</p>
				) : (
					memos.map((memo: any) => (
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
