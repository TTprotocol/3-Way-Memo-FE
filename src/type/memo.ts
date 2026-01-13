export interface Memo {
	id: number;
	content: string;
	create_date?: string;
}

export interface MemoZustandState {
	connected?: boolean;
	memos: Memo[];
	fetchMemos: () => Promise<void>;
	addMemo: (content: string) => Promise<void>;
}

export interface MemoReduxState {
	connected?: boolean;
	memos: Memo[];
	status: "idle" | "loading" | "failed";
}

export const initialState: MemoReduxState = {
	connected: false,
	memos: [],
	status: "idle",
};
