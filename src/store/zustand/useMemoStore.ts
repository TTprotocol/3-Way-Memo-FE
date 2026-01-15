import { create } from "zustand";
import api from "@/api/axios";
import { MemoZustandState } from "@/type/memo";

import useSnackbarStore from "./useSnackbar";

const { addSnackbar } = useSnackbarStore.getState();

export const useMemoStore = create<MemoZustandState>((set) => ({
	connected: false,
	memos: [],

	isConnect: async () => {
		const response = await api.get("/api/connect");
		set({ connected: response.data.status });
		response.data.status
			? addSnackbar("연결되었습니다")
			: addSnackbar("연결이 확인되지 않습니다", "error");
		return response.data.status;
	},

	fetchMemos: async () => {
		const response = await api.get("/api/memos");
		addSnackbar("조회 성공");
		set({ memos: response.data });
	},

	addMemo: async (content: string) => {
		const response = await api.post("/api/memos", { content });
		addSnackbar("저장되었습니다");
		set((state) => ({ memos: [response.data, ...state.memos] }));
	},

	updateMemo: async (id: number, content: string) => {
		const response = await api.put("/api/memos", { id, content });
		addSnackbar("수정되었습니다");
		set((state) => ({
			memos: state.memos.map((item) => {
				if (item.id === response.data.id) return response.data;
				else return item;
			}),
		}));
	},

	deleteMemo: async (id: number) => {
		const response = await api.delete(`/api/memos/${id}`);
		set((state) => ({
			memos: state.memos.filter((item) => item.id !== Number(response.data.id)),
		}));
		addSnackbar("삭제되었습니다");
	},
}));
