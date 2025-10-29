import {useCallback, useMemo, useRef} from "react";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {fetchFile, toBlobURL} from "@ffmpeg/util";
import {ConversionOptions} from "@/types";
import {useAppContext} from "@/contexts/AppContext";

export function useFFmpeg() {
	const {initState, setInitState, conversionState, setConversionState} =
		useAppContext();

	// Use useRef to ensure FFmpeg instance is created only once
	const ffmpegRef = useRef<FFmpeg | null>(null);
	const ffmpeg = useMemo(() => {
		if (!ffmpegRef.current) {
			ffmpegRef.current = new FFmpeg();
		}
		return ffmpegRef.current;
	}, []);

	const initializeFFmpeg = useCallback(async () => {
		try {
			// Check SharedArrayBuffer support
			if (typeof SharedArrayBuffer === "undefined") {
				const isLocalhost =
					window.location.hostname === "localhost" ||
					window.location.hostname === "127.0.0.1";
				const isHttp = window.location.protocol === "http:";

				console.error(
					"SharedArrayBuffer is not available. Browser info:",
					{
						userAgent: navigator.userAgent,
						location: window.location.href,
						protocol: window.location.protocol,
						isLocalhost,
						isHttp,
						headers: {
							coep: document
								.querySelector(
									'meta[http-equiv="Cross-Origin-Embedder-Policy"]'
								)
								?.getAttribute("content"),
							coop: document
								.querySelector(
									'meta[http-equiv="Cross-Origin-Opener-Policy"]'
								)
								?.getAttribute("content"),
						},
					}
				);

				let errorMessage = "SharedArrayBuffer is not available.";

				if (isLocalhost && isHttp) {
					errorMessage +=
						"\n\nFor local development with HTTP, please run Chrome with these flags:\n" +
						"open -a 'Google Chrome' --args --enable-features=SharedArrayBuffer --disable-web-security\n\n" +
						"Or use HTTPS by updating astro.config.mjs with https server configuration.";
				} else if (!isLocalhost) {
					errorMessage +=
						"\n\nThis site requires HTTPS for SharedArrayBuffer support.";
				} else {
					errorMessage +=
						"\n\nPlease check:\n" +
						"1. HTTPS is enabled\n" +
						"2. Cross-Origin-Embedder-Policy: require-corp header is set\n" +
						"3. Cross-Origin-Opener-Policy: same-origin header is set";
				}

				throw new Error(errorMessage);
			}

			setInitState((prev) => ({
				...prev,
				isLoading: true,
				error: null,
			}));

			console.log("Starting to load FFmpeg core files...");

			// First try default configuration
			try {
				setInitState((prev) => ({
					...prev,
					isLoading: true,
					error: null,
				}));

				await ffmpeg.load();
				console.log("FFmpeg loaded successfully with default config!");
			} catch (defaultError) {
				console.warn(
					"Default loading failed, trying CDN sources:",
					defaultError
				);

				// If default loading fails, try CDN sources
				const cdnSources = [
					"https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd",
					"https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.5/dist/umd",
					"https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd",
				];

				let loadSuccess = false;
				let lastError: Error | null = defaultError as Error;

				for (const baseURL of cdnSources) {
					try {
						console.log(`Trying to load from ${baseURL}...`);

						const coreURL = await toBlobURL(
							`${baseURL}/ffmpeg-core.js`,
							"text/javascript"
						);
						const wasmURL = await toBlobURL(
							`${baseURL}/ffmpeg-core.wasm`,
							"application/wasm"
						);

						console.log(
							"Core file URLs generated successfully, starting FFmpeg load..."
						);
						await ffmpeg.load({
							coreURL,
							wasmURL,
						});

						console.log("FFmpeg loaded successfully!");
						loadSuccess = true;
						break;
					} catch (error) {
						console.warn(`Failed to load from ${baseURL}:`, error);
						lastError = error as Error;
						continue;
					}
				}

				if (!loadSuccess) {
					throw lastError || new Error("All loading methods failed");
				}
			}

			setInitState((prev) => ({
				...prev,
				isLoaded: true,
				isLoading: false,
				error: null,
			}));

			console.log(
				"FFmpeg initialization completed, loaded state:",
				ffmpeg.loaded
			);
		} catch (error) {
			console.error("FFmpeg initialization failed:", error);
			setInitState((prev) => ({
				...prev,
				isLoaded: false,
				isLoading: false,
				error: "FFmpeg initialization failed, please check network connection or refresh page to retry",
			}));
		}
	}, [setInitState, ffmpeg]);

	const convertToGif = useCallback(
		async (videoFile: File, options: ConversionOptions): Promise<Blob> => {
			if (!initState.isLoaded) {
				throw new Error("FFmpeg not initialized");
			}

			// Ensure FFmpeg instance is loaded
			if (!ffmpeg.loaded) {
				console.log("FFmpeg instance not loaded, reloading...");
				try {
					await ffmpeg.load();
					console.log("FFmpeg reloaded successfully");
				} catch (loadError) {
					console.error("FFmpeg reload failed:", loadError);
					throw new Error(
						"FFmpeg loading failed, please refresh page to retry"
					);
				}
			}

			// Immediately reset conversion state
			setConversionState({
				isConverting: true,
				stage: "converting",
				progress: 0,
				message: "Starting conversion...",
				error: null,
			});

			console.log("Starting conversion, FFmpeg state:", {
				loaded: ffmpeg.loaded,
				isLoaded: initState.isLoaded,
			});

			try {
				// Clear all progress listeners
				ffmpeg.off("progress", () => {});

				// Write input file
				setConversionState((prev) => ({
					...prev,
					message: "Preparing files...",
					progress: 10,
				}));
				await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

				// Generate palette (two-stage optimization)
				setConversionState((prev) => ({
					...prev,
					message: "Generating palette...",
					progress: 20,
				}));

				// Listen to first command progress (palette generation)
				const paletteProgressHandler = ({
					progress,
				}: {
					progress: number;
				}) => {
					console.log(
						"Palette generation progress raw value:",
						progress
					);
					// Ensure progress is between 0-1
					const normalizedProgress = Math.min(
						Math.max(progress, 0),
						1
					);
					// Palette generation stage: 20% - 40%
					const paletteProgress =
						20 + Math.round(normalizedProgress * 20);
					console.log(
						"Palette generation progress calculated:",
						paletteProgress
					);
					setConversionState((prev) => ({
						...prev,
						progress: paletteProgress,
						message: `Generating palette... ${Math.min(Math.max(paletteProgress, 0), 100)}%`,
					}));
				};

				ffmpeg.on("progress", paletteProgressHandler);

				await ffmpeg.exec([
					"-i",
					"input.mp4",
					"-vf",
					`fps=${options.fps},scale=${options.scale}:-1:flags=lanczos,palettegen`,
					"palette.png",
				]);

				// Clear first command progress listener
				ffmpeg.off("progress", paletteProgressHandler);

				// Generate GIF using palette
				setConversionState((prev) => ({
					...prev,
					message: "Generating GIF...",
					progress: 40,
				}));

				// Listen to second command progress (GIF generation)
				const gifProgressHandler = ({progress}: {progress: number}) => {
					console.log("GIF generation progress raw value:", progress);
					// Ensure progress is between 0-1
					const normalizedProgress = Math.min(
						Math.max(progress, 0),
						1
					);
					// GIF generation stage: 40% - 90%
					const gifProgress =
						40 + Math.round(normalizedProgress * 50);
					console.log(
						"GIF generation progress calculated:",
						gifProgress
					);
					setConversionState((prev) => ({
						...prev,
						progress: gifProgress,
						message: `Generating GIF... ${Math.min(Math.max(gifProgress, 0), 100)}%`,
					}));
				};

				ffmpeg.on("progress", gifProgressHandler);

				await ffmpeg.exec([
					"-i",
					"input.mp4",
					"-i",
					"palette.png",
					"-filter_complex",
					`fps=${options.fps},scale=${options.scale}:-1:flags=lanczos[x];[x][1:v]paletteuse`,
					"output.gif",
				]);

				// Clear second command progress listener
				ffmpeg.off("progress", gifProgressHandler);

				// Read result
				setConversionState((prev) => ({
					...prev,
					message: "Processing result...",
					progress: 95,
				}));
				const data = await ffmpeg.readFile("output.gif");
				// Use type assertion to handle FFmpeg data types
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const blob = new Blob([data as any], {
					type: "image/gif",
				});

				// Clean up files
				try {
					await ffmpeg.deleteFile("input.mp4");
					await ffmpeg.deleteFile("palette.png");
					await ffmpeg.deleteFile("output.gif");
				} catch (cleanupError) {
					console.warn("File cleanup failed:", cleanupError);
				}

				setConversionState((prev) => ({
					...prev,
					isConverting: false,
					stage: "completed",
					progress: 100,
					message: "Conversion completed",
					error: null,
				}));

				// Clear all progress listeners
				ffmpeg.off("progress", () => {});

				return blob;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Conversion failed";
				setConversionState((prev) => ({
					...prev,
					isConverting: false,
					stage: "error",
					progress: 0,
					message: "Conversion failed",
					error: errorMessage,
				}));

				// Clear all progress listeners
				ffmpeg.off("progress", () => {});

				throw err;
			}
		},
		[initState.isLoaded, setConversionState, ffmpeg]
	);

	return {
		ffmpeg,
		isLoaded: initState.isLoaded,
		isConverting: conversionState.isConverting,
		progress: {
			stage: conversionState.stage,
			progress: conversionState.progress,
			message: conversionState.message,
		},
		error: initState.error || conversionState.error,
		initializeFFmpeg,
		convertToGif,
	};
}
