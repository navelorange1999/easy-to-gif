import {useCallback, useMemo, useRef} from "react";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {fetchFile, toBlobURL} from "@ffmpeg/util";
import {ConversionOptions} from "@/types";
import {useAppContext} from "@/contexts/AppContext";

export function useFFmpeg() {
	const {initState, setInitState, conversionState, setConversionState} =
		useAppContext();

	// 使用 useRef 确保 FFmpeg 实例只创建一次
	const ffmpegRef = useRef<FFmpeg | null>(null);
	const ffmpeg = useMemo(() => {
		if (!ffmpegRef.current) {
			ffmpegRef.current = new FFmpeg();
		}
		return ffmpegRef.current;
	}, []);

	const initializeFFmpeg = useCallback(async () => {
		try {
			// 检查 SharedArrayBuffer 支持
			if (typeof SharedArrayBuffer === "undefined") {
				throw new Error(
					"您的浏览器不支持 SharedArrayBuffer，请使用 Chrome 68+ 或 Firefox 79+"
				);
			}

			setInitState((prev) => ({
				...prev,
				isLoading: true,
				error: null,
			}));

			console.log("开始尝试加载 FFmpeg 核心文件...");

			// 首先尝试使用默认配置
			try {
				setInitState((prev) => ({
					...prev,
					isLoading: true,
					error: null,
				}));

				await ffmpeg.load();
				console.log("FFmpeg 默认加载成功！");
			} catch (defaultError) {
				console.warn("默认加载失败，尝试 CDN 源:", defaultError);

				// 如果默认加载失败，尝试 CDN 源
				const cdnSources = [
					"https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd",
					"https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.5/dist/umd",
					"https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd",
				];

				let loadSuccess = false;
				let lastError: Error | null = defaultError as Error;

				for (const baseURL of cdnSources) {
					try {
						console.log(`尝试从 ${baseURL} 加载...`);

						const coreURL = await toBlobURL(
							`${baseURL}/ffmpeg-core.js`,
							"text/javascript"
						);
						const wasmURL = await toBlobURL(
							`${baseURL}/ffmpeg-core.wasm`,
							"application/wasm"
						);

						console.log(
							"核心文件 URL 生成成功，开始加载 FFmpeg..."
						);
						await ffmpeg.load({
							coreURL,
							wasmURL,
						});

						console.log("FFmpeg 加载成功！");
						loadSuccess = true;
						break;
					} catch (error) {
						console.warn(`从 ${baseURL} 加载失败:`, error);
						lastError = error as Error;
						continue;
					}
				}

				if (!loadSuccess) {
					throw lastError || new Error("所有加载方式都失败");
				}
			}

			setInitState((prev) => ({
				...prev,
				isLoaded: true,
				isLoading: false,
				error: null,
			}));

			console.log("FFmpeg 初始化完成，loaded 状态:", ffmpeg.loaded);
		} catch (error) {
			console.error("FFmpeg initialization failed:", error);
			setInitState((prev) => ({
				...prev,
				isLoaded: false,
				isLoading: false,
				error: "FFmpeg 初始化失败，请检查网络连接或刷新页面重试",
			}));
		}
	}, [setInitState, ffmpeg]);

	const convertToGif = useCallback(
		async (videoFile: File, options: ConversionOptions): Promise<Blob> => {
			if (!initState.isLoaded) {
				throw new Error("FFmpeg 未初始化");
			}

			// 确保 FFmpeg 实例已加载
			if (!ffmpeg.loaded) {
				console.log("FFmpeg 实例未加载，重新加载...");
				try {
					await ffmpeg.load();
					console.log("FFmpeg 重新加载成功");
				} catch (loadError) {
					console.error("FFmpeg 重新加载失败:", loadError);
					throw new Error("FFmpeg 加载失败，请刷新页面重试");
				}
			}

			// 立即重置转换状态
			setConversionState({
				isConverting: true,
				stage: "converting",
				progress: 0,
				message: "开始转换...",
				error: null,
			});

			console.log("开始转换，FFmpeg 状态:", {
				loaded: ffmpeg.loaded,
				isLoaded: initState.isLoaded,
			});

			try {
				// 清理所有进度监听器
				ffmpeg.off("progress", () => {});

				// 写入输入文件
				setConversionState((prev) => ({
					...prev,
					message: "准备文件...",
					progress: 10,
				}));
				await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

				// 生成调色板（两阶段优化）
				setConversionState((prev) => ({
					...prev,
					message: "生成调色板...",
					progress: 20,
				}));

				// 监听第一个命令的进度（调色板生成）
				const paletteProgressHandler = ({
					progress,
				}: {
					progress: number;
				}) => {
					console.log("调色板生成进度原始值:", progress);
					// 确保 progress 是 0-1 之间的值
					const normalizedProgress = Math.min(
						Math.max(progress, 0),
						1
					);
					// 调色板生成阶段：20% - 40%
					const paletteProgress =
						20 + Math.round(normalizedProgress * 20);
					console.log("调色板生成进度计算后:", paletteProgress);
					setConversionState((prev) => ({
						...prev,
						progress: paletteProgress,
						message: `生成调色板... ${Math.min(Math.max(paletteProgress, 0), 100)}%`,
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

				// 清理第一个命令的进度监听器
				ffmpeg.off("progress", paletteProgressHandler);

				// 使用调色板生成 GIF
				setConversionState((prev) => ({
					...prev,
					message: "生成 GIF...",
					progress: 40,
				}));

				// 监听第二个命令的进度（GIF 生成）
				const gifProgressHandler = ({progress}: {progress: number}) => {
					console.log("GIF 生成进度原始值:", progress);
					// 确保 progress 是 0-1 之间的值
					const normalizedProgress = Math.min(
						Math.max(progress, 0),
						1
					);
					// GIF 生成阶段：40% - 90%
					const gifProgress =
						40 + Math.round(normalizedProgress * 50);
					console.log("GIF 生成进度计算后:", gifProgress);
					setConversionState((prev) => ({
						...prev,
						progress: gifProgress,
						message: `生成 GIF... ${Math.min(Math.max(gifProgress, 0), 100)}%`,
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

				// 清理第二个命令的进度监听器
				ffmpeg.off("progress", gifProgressHandler);

				// 读取结果
				setConversionState((prev) => ({
					...prev,
					message: "处理结果...",
					progress: 95,
				}));
				const data = await ffmpeg.readFile("output.gif");
				const blob = new Blob([data as Uint8Array], {
					type: "image/gif",
				});

				// 清理文件
				try {
					await ffmpeg.deleteFile("input.mp4");
					await ffmpeg.deleteFile("palette.png");
					await ffmpeg.deleteFile("output.gif");
				} catch (cleanupError) {
					console.warn("清理文件失败:", cleanupError);
				}

				setConversionState((prev) => ({
					...prev,
					isConverting: false,
					stage: "completed",
					progress: 100,
					message: "转换完成",
					error: null,
				}));

				// 清理所有进度监听器
				ffmpeg.off("progress", () => {});

				return blob;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "转换失败";
				setConversionState((prev) => ({
					...prev,
					isConverting: false,
					stage: "error",
					progress: 0,
					message: "转换失败",
					error: errorMessage,
				}));

				// 清理所有进度监听器
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
