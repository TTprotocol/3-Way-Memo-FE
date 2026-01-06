import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Memo, initialState } from "@/type/memo";
import api from "@/api/axios";

export const fetchMemos = createAsyncThunk("memos/fetchMemos", async () => {
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

/**
 * 개념 정리
 * reducers : slice에서 만드는 동기 액션 처리
 *
 * extraReducers : 외부에서 오는 액션 처리
 *
 * createSlice : slice(상태 조각 + 리듀서 + 액션)를 만드는 함수
 *
 * PayloadAction : action.payload 타입을 정확하게 작성할 때 사용
 *
 * Thunk
 *  - 나중에 실행될 함수(실행 덩어리).
 *  - 즉, 액션 객체를 바로 보내는 대신, dispatch로 함수를 전달하면 그 함수가 실행된다.
 *  - thunk 함수는 실행 중에 필요한 액션 객체들을 다시 dispatch해서, 그 액션을 리듀서가 받아 상태가 바뀐다.
 *  => dispatch(function()) => function() 실행 => function의 실행 중에 필요한 객체 액션들을 dispatch한다.
 *
 * createAsyncThunk
 *  - 비동기 작업을 dispatch 가능하게 만드는 도구
 *  - createAsyncThunk로 만들어진 thunk를 dispatch 하게 되면, thunk가 실행되면서 pending/fulfilled/rejected 액션을 dispatch 하게 된다.
 */
