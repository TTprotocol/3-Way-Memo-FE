export interface Memo {
	id: number;
	content: string;
	create_date?: string;
}

export interface MemoZustandState {
	connected: boolean;
	memos: Memo[];
	isConnect: () => Promise<boolean>;
	fetchMemos: () => Promise<void>;
	addMemo: (content: string) => Promise<void>;
	updateMemo: (id: number, content: string) => Promise<void>;
	deleteMemo: (id: number) => Promise<void>;
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
