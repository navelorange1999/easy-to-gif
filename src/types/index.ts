export interface ConversionOptions {
	fps: number;
	scale: number;
	quality: "low" | "medium" | "high";
}

export interface VideoInfo {
	name: string;
	size: number;
	duration: number;
	width: number;
	height: number;
	type: string;
}

export interface ConversionProgress {
	stage: "loading" | "initializing" | "converting" | "completed" | "error";
	progress: number;
	message: string;
}

export interface FFmpegState {
	isLoaded: boolean;
	isConverting: boolean;
	progress: ConversionProgress;
	error: string | null;
}

export const RECOMMENDED_PRESET: ConversionOptions = {
	fps: 15,
	scale: 480,
	quality: "medium",
};

export const QUALITY_PRESETS = {
	low: {scale: 320, fps: 10},
	medium: {scale: 480, fps: 15},
	high: {scale: 720, fps: 20},
} as const;
