import {memo} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {useAppContext} from "@/contexts/AppContext";
import {useTranslation} from "react-i18next";

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
	const {t} = useTranslation();
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
				message: t("progress.preparing"),
			};

	const getStageText = (stage: string): string => {
		switch (stage) {
			case "loading":
				return t("progress.preparing");
			case "initializing":
				return t("progress.downloading");
			case "converting":
				return t("progress.converting");
			case "completed":
				return conversionState.isConverting
					? t("progress.completed")
					: t("progress.initCompleted");
			case "error":
				return conversionState.isConverting
					? t("progress.failed")
					: t("progress.initFailed");
			default:
				return t("progress.processing");
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
										? t("progress.downloadProgress")
										: t("progress.conversionProgress")}
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
									{t("progress.downloadDescription")}
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
									? t("progress.conversionCompleted")
									: t("progress.initCompletedDescription")}
							</p>
						</div>
					)}

					{currentProgress.stage === "error" && (
						<div className="text-center py-4">
							<div className="text-red-500 text-4xl mb-2">😞</div>
							<p className="text-sm text-muted-foreground">
								{conversionState.isConverting
									? t("progress.conversionError")
									: t("progress.initError")}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
});
