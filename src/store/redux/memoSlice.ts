import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { Memo, MemoReduxState, initialState } from "@/type/memo";

export const fetchMemos = createAsyncThunk("momos/fetchMemos", async () => {
	const response = await api.get("/api/memos");
	return response.data;
});

export const addMemo = createAsyncThunk(
	"memos/addMemo",
	async (content: string) => {
		const response = await api.post("/api/memos", { content });
		return response.data;
	}
);

const memoSlice = createSlice({
	name: "memos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMemos.fulfilled, (state, action: PayloadAction<Memo[]>) => {
				state.memos = action.payload;
			})
			.addCase(addMemo.fulfilled, (state, action: PayloadAction<Memo>) => {
				state.memos.unshift(action.payload);
			});
	},
});

export default memoSlice.reducer;
