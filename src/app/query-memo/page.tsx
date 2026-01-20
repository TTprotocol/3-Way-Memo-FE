"use client";

import React from "react";
import api from "@/api/axios";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Home, Pen, Check, X } from "lucide-react";

export default function QueryMemoPage() {
	const queryClient = useQueryClient();
	const [input, setInput] = React.useState("");
	const [editingId, setEditingId] = React.useState<number | null>(null);
	const [editText, setEditText] = React.useState("");

	// db 연결 확인
	const { data: connected, isLoading: isConnectLoading } = useQuery({
		queryKey: ["connected"],
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
	const { data: memos = [] } = useQuery({
		queryKey: ["memos"],
		queryFn: async () => {
			const response = await api.get("/api/memos");
			return response.data;
		},
		enabled: !!connected,
	});

	// 메모 추가
	const addMutation = useMutation({
		mutationFn: (content: string) => api.post("/api/memos", { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memos"] });
		},
	});

	// 메모 수정
	const updateMutation = useMutation({
		mutationFn: ({ id, content }: { id: number; content: string }) =>
			api.put("/api/memos", { id, content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memos"] });
			setEditingId(null);
			setEditText("");
		},
	});

	// 메모 삭제
	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/api/memos/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memos"] });
		},
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!connected || !input.trim()) return;

		addMutation.mutate(input);
		setInput("");
	};

	const startEdit = (id: number, content: string) => {
		setEditingId(id);
		setEditText(content);
	};

	const handleUpdate = (id: number) => {
		if (!editText.trim()) return;
		updateMutation.mutate({ id, content: editText });
	};

	return (
		<main className="max-w-2xl mx-auto p-8">
			<Link href="/">
				<Home />
			</Link>
			<h1 className="text-3xl font-bold mb-8 text-center">
				Memo Board (Query)
			</h1>

			{/* 입력 폼 */}
			<form onSubmit={submit} className="mb-8 flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="메모를 입력하세요."
					className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
				/>
				<button
					type="submit"
					className={`text-white px-6 py-3 rounded-lg hover:bg-rose-700, connected ${connected ? "bg-rose-400" : "bg-gray-500"}`}
					disabled={!connected}
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
							className={`p-4 bg-white shadow rounded-lg border flex justify-between items-center transition-colors ${
								editingId === memo.id
									? "border-purple-400 bg-purple-50"
									: "border-gray-100"
							}`}
						>
							{editingId === memo.id ? (
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
								<div>
									<p className="text-gray-800">{memo.content}</p>
									<span className="text-xs text-gray-400">
										{new Date(memo.create_date).toLocaleString()}
									</span>
								</div>
							)}

							<div className="flex gap-4">
								{editingId === memo.id ? (
									<>
										<button onClick={() => handleUpdate(memo.id)}>
											<Check color="green" size={20} />
										</button>
										<button onClick={() => setEditingId(null)}>
											<X color="gray" size={20} />
										</button>
									</>
								) : (
									<>
										<button onClick={() => startEdit(memo.id, memo.content)}>
											<Pen color="black" size={20} />
										</button>
										<button onClick={() => deleteMutation.mutate(memo.id)}>
											<X color="black" size={20} />
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

/**
 * useQuery
 *  - 가장 기본적인 쿼리 훅. 서버의 상태를 구독하고 가져오는 역할.
 *  - 자동으로 실행되기에 별도로 실행할 필요가 없다.
 *  - `const 반환 = useQuery<데이터 타입>(옵션)` 형태로 사용한다.
 *
 * queryKey
 *  - 고유한 쿼리 키(식별자)로, 이 키를 기준으로 데이터를 캐싱한다.
 *  - 배열 형태로 저장된다.
 *
 * queryFn
 *  - 데이터를 가져오는 쿼리 함수로, 반드시 데이터를 반환하거나 오류를 던져야 한다.
 *  - 또한 기본적으로 쿼리 함수에서 사용하는 변수는 쿼리 키에 포함되어야 한다.
 *
 * select
 *  - (사용되지는 않았지만) 선택 함수를 통해 가져온 데이터를 변형할 수 있다.
 *  - 즉, 데이터를 받아 와 그 데이터를 컴포넌트에 전달하기 전에 실행된다.
 *
 * placeholderData
 *  - 쿼리 무효화로 인한 일시적인 undefined 상태에서는 데이터 출력 화면이 깜빡일 수 있다.
 *  - 이러한 현상을 방지하기 위해 쿼리 함수가 호출되는 pending 상태에서 임시료 표시할 데이터를 지정할 수 있다.
 *
 * useMutation
 *  - 데이터 변경 작업을 위한 useMutation 훅. 서버의 상태를 '변경'하라는 명령을 내리는 역할이다.
 *  - useQuery가 가져오기 위한 훅이라면, useMutation는 보내기 위한 훅이다.
 *  - const 반환 = useMutation(옵션) 형태로 사용한다.
 *
 * mutationFn
 *  - 변경을 수행할 비동기 함수
 *
 * queryClient
 *  - TanStack Query의 모든 상태를 담고 있는 중앙 저장소 객체.
 *  - 캐시된 데이터를 관리하고, 쿼리 상태(로딩, 에러 등)를 추적하며, 전역 설정을 보관한다.
 */
