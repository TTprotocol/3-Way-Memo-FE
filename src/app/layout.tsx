import "./globals.css";
import ReduxProvider from "@/store/redux/reduxProvider";
import QueryProvider from "@/store/query/queryProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body>
				<QueryProvider>
					<ReduxProvider>{children}</ReduxProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
