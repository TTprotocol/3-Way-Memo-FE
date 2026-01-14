import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Memo, initialState } from "@/type/memo";
import api from "@/api/axios";

export const isConnected = createAsyncThunk("memos/isConnected", async () => {
	const response = await api.get("/api/connect");
	return response.data.status;
});

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

export const updateMemo = createAsyncThunk(
	"memos/updateMemo",
	async ({ id, content }: Memo) => {
		const response = await api.put("/api/memos", { id, content });
		return response.data;
	}
);

export const deleteMemo = createAsyncThunk(
	"memos/deleteMemo",
	async (id: number) => {
		const response = await api.delete(`/api/memos/${id}`);
		return response.data;
	}
);

const memoSlice = createSlice({
	name: "memos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(
				isConnected.fulfilled,
				(state, action: PayloadAction<boolean>) => {
					state.connected = action.payload;
				}
			)
			.addCase(fetchMemos.fulfilled, (state, action: PayloadAction<Memo[]>) => {
				state.memos = action.payload;
			})
			.addCase(addMemo.fulfilled, (state, action: PayloadAction<Memo>) => {
				state.memos.unshift(action.payload);
			})
			.addCase(updateMemo.fulfilled, (state, action: PayloadAction<Memo>) => {
				state.memos = state.memos.map((memo) => {
					if (memo.id === action.payload.id) return (memo = action.payload);
					else return memo;
				});
			})
			.addCase(deleteMemo.fulfilled, (state, action: PayloadAction<number>) => {
				state.memos = state.memos.filter((memo) => memo.id !== action.payload);
			});
	},
});

export default memoSlice.reducer;

/**
 * 개념 정리
 * reducers : slice에서 만드는 동기 액션 처리
 *
 * createSlice
 *  - slice(상태 조각 + 리듀서 + 액션)를 만드는 함수
 *  - slice는 store의 어떤 상태를 찾아 변경할 것인지, 어떤 함수를 통해서 바꿀 것인지, 그 함수의 결과값을 어떻게 처리할 것인지를 한 번에 정의한 것이다.
 *
 * extraReducers
 *  - 외부에서 오는 액션 처리
 *  - 비동기 통신의 3단계 (pending, fulfilled, rejected)에 따른 상태변화를 처리한다.
 *  - 현재는 성공 단계인 fulfilled만 처리하고 있다.
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
