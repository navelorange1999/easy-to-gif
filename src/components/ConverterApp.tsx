import {useState, useCallback, useEffect} from "react";
import {toast} from "sonner";
import {ThemeProvider} from "next-themes";
import {useFFmpeg} from "@/hooks/useFFmpeg";
import {VideoInfo, ConversionOptions} from "@/types";
import {VideoUploader} from "@/components/VideoUploader";
import {ConversionSettings} from "@/components/ConversionSettings";
import {GifPreview} from "@/components/GifPreview";
import {ProgressBar} from "@/components/ProgressBar";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Toaster} from "@/components/ui/sonner";
import {AppProvider, useAppContext} from "@/contexts/AppContext";

interface ConverterAppProps {
	lang: string;
}

function ConverterContent({lang}: ConverterAppProps) {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
	const [conversionOptions, setConversionOptions] =
		useState<ConversionOptions>({
			fps: 15,
			scale: 480,
			quality: "medium",
		});
	const [gifBlob, setGifBlob] = useState<Blob | null>(null);

	const {initState} = useAppContext();
	const {isConverting, progress, error, convertToGif, initializeFFmpeg} =
		useFFmpeg();

	// Auto-initialize FFmpeg on page load
	useEffect(() => {
		if (!initState.isLoaded && !initState.isLoading && !initState.error) {
			console.log("Initializing FFmpeg on page load...");
			initializeFFmpeg();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run only once, no need to re-initialize when initState changes

	const handleVideoUpload = useCallback(
		async (file: File, info: VideoInfo) => {
			setVideoFile(file);
			setVideoInfo(info);
			setGifBlob(null);
		},
		[]
	);

	const handleConvert = useCallback(async () => {
		if (!videoFile) return;

		setGifBlob(null);

		try {
			const result = await convertToGif(videoFile, conversionOptions);
			setGifBlob(result);
			const successMsg =
				lang === "zh" ? "转换完成！" : "Conversion complete!";
			const descMsg =
				lang === "zh"
					? "GIF 已生成，您可以预览和下载"
					: "GIF has been generated, you can preview and download";
			toast.success(successMsg, {
				description: descMsg,
				duration: 4000,
			});
		} catch (err) {
			console.error("Conversion failed:", err);
			const failMsg = lang === "zh" ? "转换失败" : "Conversion failed";
			const descMsg =
				lang === "zh"
					? "请检查视频文件或重试"
					: "Please check video file or retry";
			toast.error(failMsg, {
				description: descMsg,
				duration: 5000,
			});
		}
	}, [videoFile, convertToGif, conversionOptions, lang]);

	const handleResetSettings = useCallback(() => {
		setGifBlob(null);
		setConversionOptions({
			fps: 15,
			scale: 480,
			quality: "medium",
		});
	}, []);

	const t = (key: string): string => {
		// Simple translation function, key names from existing i18n structure
		const keys = key.split(".");
		const translations = {
			initialization: {
				title:
					lang === "zh"
						? "正在初始化转换引擎"
						: "Initializing conversion engine",
				description:
					lang === "zh"
						? "首次使用需要下载 FFmpeg 核心文件（约30MB），请稍候..."
						: "First use requires downloading FFmpeg core files (about 30MB), please wait...",
				failed: lang === "zh" ? "初始化失败" : "Initialization failed",
				retry: lang === "zh" ? "刷新页面重试" : "Refresh page to retry",
				checkCompatibility:
					lang === "zh"
						? "检查浏览器兼容性"
						: "Check browser compatibility",
			},
			conversion: {
				failed: lang === "zh" ? "转换失败" : "Conversion failed",
			},
		};

		let value: Record<string, unknown> | string = translations;
		for (const k of keys) {
			if (value && typeof value === "object" && k in value) {
				value = value[k] as Record<string, unknown>;
			} else {
				return key;
			}
		}
		return typeof value === "string" ? value : key;
	};

	return (
		<>
			{/* Initialization progress */}
			{!initState.isLoaded && !error && (
				<Card>
					<CardContent className="p-6">
						<div className="text-center mb-4">
							<h3 className="text-lg font-semibold mb-2">
								{t("initialization.title")}
							</h3>
							<p className="text-muted-foreground">
								{t("initialization.description")}
							</p>
						</div>
						<ProgressBar progress={progress} />
					</CardContent>
				</Card>
			)}

			{/* Global error display */}
			{error && (
				<Alert variant="destructive">
					<AlertDescription>
						<div className="space-y-4">
							<div>
								<h4 className="font-semibold text-destructive">
									{t("initialization.failed")}
								</h4>
								<p className="text-sm text-destructive/80 mt-1">
									{error}
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-2">
								<Button
									variant="destructive"
									size="sm"
									onClick={() => window.location.reload()}
								>
									{t("initialization.retry")}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										console.log("Browser info:", {
											userAgent: navigator.userAgent,
											sharedArrayBuffer:
												typeof SharedArrayBuffer !==
												"undefined",
											webAssembly:
												typeof WebAssembly !==
												"undefined",
										});
									}}
								>
									{t("initialization.checkCompatibility")}
								</Button>
							</div>
						</div>
					</AlertDescription>
				</Alert>
			)}

			{/* Main content area */}
			{initState.isLoaded && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left side: upload and settings */}
					<div className="space-y-6">
						<VideoUploader
							onVideoUpload={handleVideoUpload}
							disabled={isConverting}
						/>

						{videoInfo && (
							<ConversionSettings
								videoInfo={videoInfo}
								options={conversionOptions}
								onOptionsChange={setConversionOptions}
								onConvert={handleConvert}
								onReset={handleResetSettings}
								disabled={isConverting}
							/>
						)}
					</div>

					{/* Right side: progress and preview */}
					<div className="space-y-6">
						{isConverting && <ProgressBar />}

						{error && (
							<Alert variant="destructive">
								<AlertDescription>
									<h4 className="font-semibold mb-2">
										{t("conversion.failed")}
									</h4>
									<p className="text-sm">{error}</p>
								</AlertDescription>
							</Alert>
						)}

						{gifBlob && (
							<GifPreview
								gifBlob={gifBlob}
								onReset={handleResetSettings}
								conversionOptions={{
									scale: conversionOptions.scale,
									fps: conversionOptions.fps,
								}}
							/>
						)}
					</div>
				</div>
			)}

			<Toaster />
		</>
	);
}

export default function ConverterApp({lang}: ConverterAppProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AppProvider>
				<ConverterContent lang={lang} />
			</AppProvider>
		</ThemeProvider>
	);
}
