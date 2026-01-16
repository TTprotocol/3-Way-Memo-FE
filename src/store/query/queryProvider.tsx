"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Redux와 비슷하게, Query 기능을 사용하기 위해 앱 최상위에 <QueryClientProvider>로 매핑하고 queryClient 인스턴스를 연결한다.
export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = React.useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
