import { create } from "zustand";
import api from "@/api/axios";
import { Memo, MemoZustandState } from "@/type/memo";

export const useMemoStore = create<MemoZustandState>((set) => ({
	memos: [],

	fetchMemos: async () => {
		const response = await api.get("/api/memos");
		set({ memos: response.data });
	},

	addMemo: async (content: string) => {
		const response = await api.post("/api/memos", { content });
		set((state) => ({ memos: [response.data, ...state.memos] }));
	},
}));
