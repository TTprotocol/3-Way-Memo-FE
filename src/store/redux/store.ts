import { configureStore } from "@reduxjs/toolkit";
import memoReducer from "./memoSlice";

// configureStore로 스토어를 생성하고, reducer로 상태 객체들을 관리하게 된다.
// Provider의 store={store}에 주입하기 위한 스토어 인스턴스를 내보낸다.
export const store = configureStore({
	// reducer : 전역 상태를 slice 단위로 나누고, 각 slice를 어떻게 변경할지 결정한다.
	reducer: {
		memos: memoReducer, // memos라는 상태와 이 상태를 변경하기 위한 memoReducer가 붙어있다. 즉, memos 관련 action이 dispatch되면 memoReducer가 다음 memos 상태를 만든다.
	},
});

export type RootState = ReturnType<typeof store.getState>; // 전역 상태 타입. getState()가 반환하는 타입이다.
export type AppDispatch = typeof store.dispatch; // dispatch 함수 타입. useDispatch를 타입 안전하게 쓰기 위함.
