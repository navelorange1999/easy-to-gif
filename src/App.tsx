import {useState, useEffect, useCallback} from "react";

import {toast} from "sonner";
import {ThemeProvider} from "next-themes";

import {VideoUploader} from "@/components/VideoUploader";
import {ConversionSettings} from "@/components/ConversionSettings";
import {GifPreview} from "@/components/GifPreview";
import {ProgressBar} from "@/components/ProgressBar";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {useFFmpeg} from "@/hooks/useFFmpeg";
import {VideoInfo, ConversionOptions} from "@/types";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Toaster} from "@/components/ui/sonner";
import {AppProvider, useAppContext} from "@/contexts/AppContext";

function AppContent() {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
	const [conversionOptions, setConversionOptions] =
		useState<ConversionOptions>({
			fps: 15,
			scale: 480,
			quality: "medium",
		});
	const [gifBlob, setGifBlob] = useState<Blob | null>(null);

	const {initState, setInitState} = useAppContext();
	const {
		isLoaded,
		isConverting,
		progress,
		error,
		convertToGif,
		initializeFFmpeg,
	} = useFFmpeg();

	// 页面加载时自动初始化 FFmpeg
	useEffect(() => {
		initializeFFmpeg();
	}, [initializeFFmpeg]);

	// 监听初始化完成，显示 toast 提示
	useEffect(() => {
		if (isLoaded && !initState.hasShownInitToast) {
			toast.success("初始化完成！", {
				description: "现在可以上传视频文件开始转换",
				duration: 3000,
			});
			setInitState((prev) => ({...prev, hasShownInitToast: true}));
		}
	}, [isLoaded, initState.hasShownInitToast, setInitState]);

	const handleVideoUpload = useCallback((file: File, info: VideoInfo) => {
		setVideoFile(file);
		setVideoInfo(info);
		setGifBlob(null);
	}, []);

	const handleConvert = useCallback(async () => {
		if (!videoFile) return;

		// 开始转换时清除之前的结果
		setGifBlob(null);

		try {
			console.log("开始转换，当前状态:", {isLoaded, isConverting});
			const result = await convertToGif(videoFile, conversionOptions);
			setGifBlob(result);
			toast.success("转换完成！", {
				description: "GIF 已生成，您可以预览和下载",
				duration: 4000,
			});
		} catch (err) {
			console.error("Conversion failed:", err);
			toast.error("转换失败", {
				description: "请检查视频文件或重试",
				duration: 5000,
			});
		}
	}, [videoFile, isLoaded, isConverting, convertToGif, conversionOptions]);

	const handleResetSettings = useCallback(() => {
		setGifBlob(null);
		setConversionOptions({
			fps: 15,
			scale: 480,
			quality: "medium",
		});
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* 欢迎区域 - 只在桌面端显示 */}
					<div className="hidden md:block text-center space-y-6">
						<div className="space-y-4">
							<h1 className="text-4xl font-bold tracking-tight text-foreground">
								Easy to GIF
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								免费在线视频转GIF工具，支持多种格式，快速转换，完全免费
							</p>
						</div>

						{/* 桌面端显示特性介绍 */}
						<div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
							<div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card text-card-foreground">
								<div className="text-2xl">🔒</div>
								<h3 className="font-semibold">隐私保护</h3>
								<p className="text-sm text-muted-foreground text-center">
									所有处理都在您的浏览器本地完成，我们不会保存任何文件
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card text-card-foreground">
								<div className="text-2xl">⚡</div>
								<h3 className="font-semibold">快速转换</h3>
								<p className="text-sm text-muted-foreground text-center">
									基于 FFmpeg WASM 技术，转换速度快
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card text-card-foreground">
								<div className="text-2xl">📱</div>
								<h3 className="font-semibold">响应式设计</h3>
								<p className="text-sm text-muted-foreground text-center">
									支持桌面端和移动端使用
								</p>
							</div>
						</div>
					</div>

					{/* 初始化进度 */}
					{!isLoaded && !error && (
						<Card>
							<CardContent className="p-6">
								<div className="text-center mb-4">
									<h3 className="text-lg font-semibold mb-2">
										正在初始化转换引擎
									</h3>
									<p className="text-muted-foreground">
										首次使用需要下载 FFmpeg 核心文件（约
										30MB），请稍候...
									</p>
								</div>
								<ProgressBar progress={progress} />
							</CardContent>
						</Card>
					)}

					{/* 全局错误显示 */}
					{error && (
						<Alert variant="destructive">
							<AlertDescription>
								<div className="space-y-4">
									<div>
										<h4 className="font-semibold text-destructive">
											初始化失败
										</h4>
										<p className="text-sm text-destructive/80 mt-1">
											{error}
										</p>
									</div>
									<div className="flex flex-col sm:flex-row gap-2">
										<Button
											variant="destructive"
											size="sm"
											onClick={() =>
												window.location.reload()
											}
										>
											刷新页面重试
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												console.log("浏览器信息:", {
													userAgent:
														navigator.userAgent,
													sharedArrayBuffer:
														typeof SharedArrayBuffer !==
														"undefined",
													webAssembly:
														typeof WebAssembly !==
														"undefined",
												});
											}}
										>
											检查浏览器兼容性
										</Button>
									</div>
								</div>
							</AlertDescription>
						</Alert>
					)}

					{/* 主要内容区域 - 只在初始化完成后显示 */}
					{isLoaded && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* 左侧：上传和设置 */}
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

							{/* 右侧：进度和预览 */}
							<div className="space-y-6">
								{isConverting && <ProgressBar />}

								{error && (
									<Alert variant="destructive">
										<AlertDescription>
											<h4 className="font-semibold mb-2">
												转换失败
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
				</div>
			</main>

			<Footer />
			<Toaster />
		</div>
	);
}

function App() {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AppProvider>
				<AppContent />
			</AppProvider>
		</ThemeProvider>
	);
}

export default App;
