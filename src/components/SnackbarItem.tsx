"use client";

import React from "react";
import useSnackbarStore from "@/store/zustand/useSnackbar";
import { Snackbar } from "@/type/snackbar";
import { X } from "lucide-react";

const SnackbarItem: React.FC<Snackbar> = ({ id, message, type }) => {
	const removeSnackbar = useSnackbarStore((state) => state.removeSnackbar);
	const [progress, setProgress] = React.useState<number>(100);
	const duration = 3000;

	React.useEffect(() => {
		const timer = setTimeout(() => removeSnackbar(id), duration);

		const interval = setInterval(() => {
			setProgress((prev) => Math.max(0, prev - 100 / (duration / 10)));
		}, 10);

		return () => {
			clearTimeout(timer);
			clearInterval(interval);
		};
	}, [id, removeSnackbar]);

	const bgColor = type === "success" ? "bg-purple-600" : "bg-red-500";

	return (
		<div
			className={`${bgColor} text-white p-4 rounded-lg shadow-2xl min-w-70 relative overflow-hidden transition-all duration-300`}
		>
			<div className="flex justify-between items-center m-1 ">
				<span className="text-sm font-semibold">{message}</span>
				<button
					onClick={() => removeSnackbar(id)}
					className="ml-4 opacity-70 hover:opacity-100"
				>
					<X color="black" strokeWidth={1} />
				</button>
			</div>
			<div
				className="absolute bottom-0 left-0 h-1 bg-white opacity-50"
				style={{ width: `${progress}%`, transition: "width 10ms linear" }}
			/>
		</div>
	);
};

export default SnackbarItem;
