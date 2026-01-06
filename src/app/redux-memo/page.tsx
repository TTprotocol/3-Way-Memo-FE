"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux"; // store에 접근하기 위한 훅
import { RootState, AppDispatch } from "@/store/redux/store"; // RootState : 전역 상태 타입, AppDispatch : dispatch 타입
import { fetchMemos, addMemo } from "@/store/redux/memoSlice"; // memoSlice에서 정의한 액션들

export default function ReduxMemoPage() {
	const [input, setInput] = React.useState("");
	const dispatch = useDispatch<AppDispatch>(); // store.dispatch를 가져온다.
	const { memos } = useSelector((state: RootState) => state.memos); // useSelector로 store의 state에서 memos 슬라이스를 구독한다.

	React.useEffect(() => {
		dispatch(fetchMemos()); // 메모 목록을 조회하는 액션 함수 실행.
	}, [dispatch]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		await dispatch(addMemo(input)); // 메모를 추가하는 액션 함수 실행
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
				{/* memos의 상태가 바뀌면 이 렌더링 결과가 바뀌게 된다. */}
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
