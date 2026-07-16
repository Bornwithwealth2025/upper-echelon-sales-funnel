
declare module 'express-serve-static-core' {
	interface Request {
		userId?: string;
		email?: string;
		role?: string;
	}
}

export {};