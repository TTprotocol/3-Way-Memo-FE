"use client";

import React from "react";
import useSnackbarStore from "@/store/zustand/useSnackbar";
import SnackbarItem from "./SnackbarItem";

const Snackbar: React.FC = () => {
	const snackbar = useSnackbarStore((state) => state.snackbar);

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
			{snackbar.map((snack) => (
				<SnackbarItem key={snack.id} {...snack} />
			))}
		</div>
	);
};

export default Snackbar;
