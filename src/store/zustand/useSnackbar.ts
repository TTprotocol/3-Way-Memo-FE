import { create } from "zustand";
import { SnackbarType, Snackbar, SnackbarState } from "@/type/snackbar";

const useSnackbarStore = create<SnackbarState>((set) => ({
	snackbar: [],
	addSnackbar: (message, type = "success") => {
		const id = Date.now();
		set((state) => ({
			snackbar: [...state.snackbar, { id, message, type }],
		}));
	},
	removeSnackbar: (id) => {
		set((state) => ({
			snackbar: state.snackbar.filter((snack) => snack.id !== id),
		}));
	},
}));

export default useSnackbarStore;
