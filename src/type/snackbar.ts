export type SnackbarType = "success" | "error";

export interface Snackbar {
	id: number;
	message: string;
	type: SnackbarType;
}

export interface SnackbarState {
	snackbar: Snackbar[];
	addSnackbar: (message: string, type?: SnackbarType) => void;
	removeSnackbar: (id: number) => void;
}
