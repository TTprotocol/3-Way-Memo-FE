"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux"; // store에 접근하기 위한 훅
import { Memo } from "@/type/memo";
import { RootState, AppDispatch } from "@/store/redux/store"; // RootState : 전역 상태 타입, AppDispatch : dispatch 타입
import {
	isConnected,
	fetchMemos,
	addMemo,
	updateMemo,
	deleteMemo,
} from "@/store/redux/memoSlice"; // memoSlice에서 정의한 액션들
import { Home, Pen, Check, X } from "lucide-react";

export default function ReduxMemoPage() {
	const dispatch = useDispatch<AppDispatch>(); // store.dispatch를 가져온다.
	const { connected, memos } = useSelector((state: RootState) => state.memos); // useSelector로 store의 state에서 memos 슬라이스를 구독한다.

	const [input, setInput] = React.useState("");
	const [editingId, setEditingId] = React.useState<number | null>(null);
	const [editText, setEditText] = React.useState("");

	React.useEffect(() => {
		const init = async () => {
			// DB 연결을 확인하는 액션 함수 실행
			const result = await dispatch(isConnected());

			// 메모 목록을 조회하는 액션 함수 실행.
			if (isConnected.fulfilled.match(result) && result.payload === true) {
				dispatch(fetchMemos());
			}
		};

		init();
	}, [dispatch]);

	// 저장 함수
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await dispatch(addMemo(input)); // 메모를 추가하는 액션 함수 실행
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

		await dispatch(updateMemo({ id, content: editText } as Memo));
		setEditingId(null);
		setEditText("");
	};

	// 삭제
	const handleDelete = async (id: number) => {
		await dispatch(deleteMemo(id));
		await dispatch(fetchMemos());
	};

	return (
		<main className="max-w-2xl mx-auto p-8">
			<Link href="/">
				<Home />
			</Link>
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
				<button
					type="submit"
					className={`text-white px-6 py-3 rounded-lg hover:bg-purple-700 ${connected ? "bg-purple-400" : "bg-gray-500"}`}
					disabled={!connected}
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
