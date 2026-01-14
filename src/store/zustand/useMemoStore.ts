import { create } from "zustand";
import api from "@/api/axios";
import { MemoZustandState } from "@/type/memo";

export const useMemoStore = create<MemoZustandState>((set) => ({
	connected: false,
	memos: [],

	isConnect: async () => {
		const response = await api.get("/api/connect");
		set({ connected: response.data.status });
		return response.data.status;
	},

	fetchMemos: async () => {
		const response = await api.get("/api/memos");
		set({ memos: response.data });
	},

	addMemo: async (content: string) => {
		const response = await api.post("/api/memos", { content });
		set((state) => ({ memos: [response.data, ...state.memos] }));
	},

	updateMemo: async (id: number, content: string) => {
		const response = await api.put("/api/memos", { id, content });
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
	},
}));
