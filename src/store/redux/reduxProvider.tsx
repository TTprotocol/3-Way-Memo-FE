"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export default function ReduxProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Provider store={store}>{children}</Provider>;
}

/**
 * Provider
 *  - 앱 전체에 store를 공급해주는 컴포넌트.
 *  - 하위 컴포넌트에서 useSelector, useDispatch를 쓰기 위해서는 <Provider store={store}>로 감싸야 한다.
 */
