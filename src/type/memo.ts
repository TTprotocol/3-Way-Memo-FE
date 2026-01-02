export interface Memo {
	id: number;
	content: string;
	create_date: string;
}

export interface MemoZustandState {
	memos: Memo[];
	fetchMemos: () => Promise<void>;
	addMemo: (content: string) => Promise<void>;
}

export interface MemoReduxState {
	memos: Memo[];
	status: "idle" | "loading" | "failed";
}

export const initialState: MemoReduxState = {
	memos: [],
	status: "idle",
};
