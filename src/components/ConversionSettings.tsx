import {Settings, Play, RotateCcw} from "lucide-react";
import {
	VideoInfo,
	ConversionOptions,
	RECOMMENDED_PRESET,
	QUALITY_PRESETS,
} from "@/types";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {Badge} from "@/components/ui/badge";
import {useTranslation} from "react-i18next";

interface ConversionSettingsProps {
	videoInfo: VideoInfo;
	options: ConversionOptions;
	onOptionsChange: (options: ConversionOptions) => void;
	onConvert: () => void;
	onReset: () => void;
	disabled?: boolean;
}

export function ConversionSettings({
	videoInfo,
	options,
	onOptionsChange,
	onConvert,
	onReset,
	disabled,
}: ConversionSettingsProps) {
	const {t} = useTranslation();
	const handlePresetChange = (presetKey: keyof typeof QUALITY_PRESETS) => {
		const presetConfig = QUALITY_PRESETS[presetKey];
		onOptionsChange({
			...options,
			fps: presetConfig.fps,
			scale: presetConfig.scale,
			quality:
				presetKey === "low"
					? "low"
					: presetKey === "high"
						? "high"
						: "medium",
		});
	};

	const handleFpsChange = (fps: number) => {
		onOptionsChange({...options, fps});
	};

	const handleScaleChange = (scale: number) => {
		onOptionsChange({...options, scale});
	};

	const applyRecommendedPreset = () => {
		onOptionsChange({
			...options,
			fps: RECOMMENDED_PRESET.fps,
			scale: RECOMMENDED_PRESET.scale,
			quality: RECOMMENDED_PRESET.quality,
		});
	};

	const getEstimatedSize = (): string => {
		// 粗略估算：基于帧率、分辨率和时长
		const duration = videoInfo.duration;
		const frameCount = duration * options.fps;
		const pixelCount =
			options.scale *
			((options.scale * videoInfo.height) / videoInfo.width);
		const estimatedBytes = frameCount * pixelCount * 0.1; // 粗略估算
		return formatFileSize(estimatedBytes);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					{t("conversion.title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* 预设配置 */}
				<div className="space-y-4">
					<div>
						<Label className="text-sm font-medium mb-2 block">
							{t("conversion.qualityPreset")}
						</Label>
						<div className="grid grid-cols-3 gap-2">
							{Object.entries(QUALITY_PRESETS).map(([key]) => (
								<Button
									key={key}
									variant={
										options.quality === key ||
										(key === "medium" &&
											options.quality === "medium")
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() =>
										handlePresetChange(
											key as keyof typeof QUALITY_PRESETS
										)
									}
									disabled={disabled}
								>
									{key === "low"
										? t("conversion.low")
										: key === "medium"
											? t("conversion.medium")
											: t("conversion.high")}
								</Button>
							))}
						</div>
						<Button
							variant="link"
							size="sm"
							onClick={applyRecommendedPreset}
							className="mt-2 p-0 h-auto"
						>
							{t("conversion.useRecommended")}
						</Button>
					</div>

					{/* 帧率设置 */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							{t("conversion.fps")}: {options.fps} FPS
						</Label>
						<Slider
							min={5}
							max={30}
							step={1}
							value={[options.fps]}
							onValueChange={(value) => handleFpsChange(value[0])}
							disabled={disabled}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>5 FPS</span>
							<span>30 FPS</span>
						</div>
					</div>

					{/* 分辨率设置 */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							{t("conversion.outputWidth")}: {options.scale}px
						</Label>
						<Slider
							min={240}
							max={1080}
							step={40}
							value={[options.scale]}
							onValueChange={(value) =>
								handleScaleChange(value[0])
							}
							disabled={disabled}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>240px</span>
							<span>1080px</span>
						</div>
						<p className="text-xs text-muted-foreground">
							{t("conversion.heightAuto")}
						</p>
					</div>

					{/* 预估信息 */}
					<Card className="bg-muted/50">
						<CardContent className="p-3">
							<h4 className="text-sm font-medium mb-2">
								{t("conversion.estimatedInfo")}
							</h4>
							<div className="space-y-1">
								<div className="flex justify-between text-xs">
									<span>
										{t("conversion.outputResolution")}:
									</span>
									<Badge variant="secondary">
										{options.scale} ×{" "}
										{Math.round(
											(options.scale * videoInfo.height) /
												videoInfo.width
										)}
									</Badge>
								</div>
								<div className="flex justify-between text-xs">
									<span>
										{t("conversion.estimatedSize")}:
									</span>
									<Badge variant="secondary">
										{getEstimatedSize()}
									</Badge>
								</div>
								<div className="flex justify-between text-xs">
									<span>
										{t("conversion.processingTime")}:
									</span>
									<Badge variant="secondary">
										约 {Math.ceil(videoInfo.duration * 0.5)}{" "}
										{t("conversion.seconds")}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 操作按钮 */}
				<div className="flex gap-3">
					<Button
						onClick={onConvert}
						disabled={disabled}
						className="flex-1"
					>
						<Play className="h-4 w-4 mr-2" />
						{t("conversion.startConversion")}
					</Button>
					<Button
						variant="outline"
						onClick={onReset}
						disabled={disabled}
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						{t("conversion.reset")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
