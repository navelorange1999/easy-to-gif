import {useState} from "react";
import {Download, RotateCcw, Maximize2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {useTranslation} from "react-i18next";

interface GifPreviewProps {
	gifBlob: Blob;
	onReset: () => void;
	conversionOptions?: {
		scale: number;
		fps: number;
	};
}

export function GifPreview({
	gifBlob,
	onReset,
	conversionOptions,
}: GifPreviewProps) {
	const {t} = useTranslation();
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const gifUrl = URL.createObjectURL(gifBlob);
	const fileSize = gifBlob.size;

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
	};

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = gifUrl;
		link.download = `converted-${Date.now()}.gif`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const openPreview = () => {
		setIsPreviewOpen(true);
	};

	const closePreview = () => {
		setIsPreviewOpen(false);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{t("preview.title")}</h2>
			</div>

			<Card className="overflow-hidden">
				{/* GIF 缩略图区域 */}
				<div
					className="relative group cursor-pointer"
					onClick={openPreview}
				>
					<img
						src={gifUrl}
						alt={t("preview.alt")}
						className="w-full h-auto max-h-96 object-contain"
					/>

					{/* 预览覆盖层 */}
					<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
						<div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg">
							<Maximize2 className="h-4 w-4" />
							<span className="text-sm font-medium">
								{t("preview.clickToPreview")}
							</span>
						</div>
					</div>
				</div>

				{/* 文件信息 */}
				<CardContent className="p-4 border-t bg-muted/30">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium">
								{t("preview.fileSize")}:
							</span>
							<Badge variant="secondary">
								{formatFileSize(fileSize)}
							</Badge>
						</div>
						{conversionOptions && (
							<div className="flex items-center justify-between text-sm">
								<span className="font-medium">
									{t("preview.outputSize")}:
								</span>
								<Badge variant="secondary">
									{conversionOptions.scale}px ×{" "}
									{Math.round(conversionOptions.scale * 0.75)}
									px
								</Badge>
							</div>
						)}
						{conversionOptions && (
							<div className="flex items-center justify-between text-sm">
								<span className="font-medium">
									{t("preview.fps")}:
								</span>
								<Badge variant="secondary">
									{conversionOptions.fps} FPS
								</Badge>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* 操作按钮 */}
			<div className="flex gap-3">
				<Button onClick={handleDownload} className="flex-1">
					<Download className="h-4 w-4 mr-2" />
					{t("preview.downloadGif")}
				</Button>
				<Button variant="outline" onClick={onReset}>
					<RotateCcw className="h-4 w-4 mr-2" />
					{t("preview.reconvert")}
				</Button>
			</div>

			{/* 预览对话框 */}
			<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] p-0">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle>{t("preview.previewTitle")}</DialogTitle>
					</DialogHeader>
					<div className="p-6 pt-0">
						<div className="flex justify-center">
							<img
								src={gifUrl}
								alt={t("preview.alt")}
								className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
								style={{
									aspectRatio: conversionOptions
										? `${conversionOptions.scale} / ${Math.round(conversionOptions.scale * 0.75)}`
										: "auto",
								}}
							/>
						</div>
						<div className="mt-4 flex justify-center gap-3">
							<Button onClick={handleDownload}>
								<Download className="h-4 w-4 mr-2" />
								{t("preview.downloadGif")}
							</Button>
							<Button variant="outline" onClick={closePreview}>
								{t("preview.closePreview")}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* 提示信息 */}
			<Alert>
				<div className="text-blue-500 text-lg">💡</div>
				<AlertDescription>
					<div className="space-y-1">
						<p className="font-medium mb-2">
							{t("preview.tips.title")}
						</p>
						<ul className="space-y-1 text-xs">
							{(
								t("preview.tips.items", {
									returnObjects: true,
								}) as string[]
							).map((item: string, index: number) => (
								<li key={index}>• {item}</li>
							))}
						</ul>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
}
