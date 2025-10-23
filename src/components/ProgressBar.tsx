import {memo} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {useAppContext} from "@/contexts/AppContext";

interface ProgressBarProps {
	// 初始化进度（可选）
	progress?: {
		stage:
			| "idle"
			| "loading"
			| "initializing"
			| "converting"
			| "completed"
			| "error";
		progress: number;
		message: string;
	};
}

export const ProgressBar = memo(function ProgressBar({
	progress,
}: ProgressBarProps) {
	const {conversionState} = useAppContext();

	// 优先使用转换状态，如果没有则使用传入的初始化进度
	const currentProgress = conversionState.isConverting
		? {
				stage: conversionState.stage,
				progress: conversionState.progress,
				message: conversionState.message,
			}
		: progress || {
				stage: "idle" as const,
				progress: 0,
				message: "准备中...",
			};

	const getStageText = (stage: string): string => {
		switch (stage) {
			case "loading":
				return "准备中...";
			case "initializing":
				return "正在下载 FFmpeg 核心文件...";
			case "converting":
				return "转换中...";
			case "completed":
				return conversionState.isConverting
					? "转换完成！"
					: "初始化完成！";
			case "error":
				return conversionState.isConverting ? "转换失败" : "初始化失败";
			default:
				return "处理中...";
		}
	};

	const getStageIcon = (stage: string): string => {
		switch (stage) {
			case "loading":
				return "⏳";
			case "initializing":
				return "📥";
			case "converting":
				return "⚙️";
			case "completed":
				return "✅";
			case "error":
				return "❌";
			default:
				return "⏳";
		}
	};

	if (!currentProgress) {
		return null;
	}

	return (
		<Card className="mt-11">
			<CardContent className="p-6">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<span className="text-2xl">
							{getStageIcon(currentProgress.stage)}
						</span>
						<div className="flex-1">
							<h3 className="font-medium">
								{getStageText(currentProgress.stage)}
							</h3>
							<p className="text-sm text-muted-foreground">
								{currentProgress.message}
							</p>
						</div>
						{currentProgress.progress > 0 && (
							<Badge variant="secondary">
								{Math.min(
									Math.max(currentProgress.progress, 0),
									100
								)}
								%
							</Badge>
						)}
					</div>

					{(currentProgress.stage === "converting" ||
						currentProgress.stage === "initializing") && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>
									{currentProgress.stage === "initializing"
										? "下载进度"
										: "转换进度"}
								</span>
								<span>
									{Math.min(
										Math.max(currentProgress.progress, 0),
										100
									)}
									%
								</span>
							</div>
							<Progress
								value={Math.min(
									Math.max(currentProgress.progress, 0),
									100
								)}
								className="w-full"
							/>
							{currentProgress.stage === "initializing" && (
								<p className="text-xs text-muted-foreground">
									首次使用需要下载 FFmpeg 核心文件（约
									30MB），请耐心等待...
								</p>
							)}
						</div>
					)}

					{currentProgress.stage === "completed" && (
						<div className="text-center py-4">
							<div className="text-green-500 text-4xl mb-2">
								✅
							</div>
							<p className="text-sm text-muted-foreground">
								{conversionState.isConverting
									? "转换完成！现在可以预览和下载 GIF"
									: "初始化完成！现在可以上传视频文件开始转换"}
							</p>
						</div>
					)}

					{currentProgress.stage === "error" && (
						<div className="text-center py-4">
							<div className="text-red-500 text-4xl mb-2">😞</div>
							<p className="text-sm text-muted-foreground">
								{conversionState.isConverting
									? "转换过程中出现错误，请检查视频文件或重试"
									: "初始化过程中出现错误，请刷新页面重试"}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
});
