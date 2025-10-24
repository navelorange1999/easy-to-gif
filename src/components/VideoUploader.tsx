import {useState, useRef, useCallback} from "react";
import {Upload, Video, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {VideoInfo} from "@/types";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useTranslation} from "react-i18next";

interface VideoUploaderProps {
	onVideoUpload: (file: File, info: VideoInfo) => void;
	disabled?: boolean;
}

export function VideoUploader({onVideoUpload, disabled}: VideoUploaderProps) {
	const {t} = useTranslation();
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = useCallback(
		(file: File): string | null => {
			const maxSize = 200 * 1024 * 1024; // 200MB
			const allowedTypes = [
				"video/mp4",
				"video/quicktime",
				"video/x-msvideo",
				"video/webm",
				"video/x-matroska",
				"video/3gpp",
				"video/x-flv",
			];

			if (file.size > maxSize) {
				return t("upload.fileSizeError");
			}

			if (!allowedTypes.includes(file.type)) {
				return t("upload.formatError");
			}

			return null;
		},
		[t]
	);

	const getVideoInfo = useCallback(
		(file: File): Promise<VideoInfo> => {
			return new Promise((resolve, reject) => {
				const video = document.createElement("video");
				video.preload = "metadata";

				video.onloadedmetadata = () => {
					resolve({
						name: file.name,
						size: file.size,
						duration: video.duration,
						width: video.videoWidth,
						height: video.videoHeight,
						type: file.type,
					});
				};

				video.onerror = () => {
					reject(new Error(t("upload.metadataError")));
				};

				video.src = URL.createObjectURL(file);
			});
		},
		[t]
	);

	const handleFileSelect = useCallback(
		async (file: File) => {
			setError(null);

			const validationError = validateFile(file);
			if (validationError) {
				setError(validationError);
				return;
			}

			try {
				const info = await getVideoInfo(file);
				setSelectedFile(file);
				setVideoInfo(info);
				onVideoUpload(file, info);
			} catch {
				setError(t("upload.readError"));
			}
		},
		[onVideoUpload, t, getVideoInfo, validateFile]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			if (disabled) return;

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[disabled, handleFileSelect]
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(true);
			}
		},
		[disabled]
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files && files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[handleFileSelect]
	);

	const handleRemoveFile = useCallback(() => {
		setSelectedFile(null);
		setVideoInfo(null);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const formatDuration = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">{t("upload.title")}</h2>

			{!selectedFile ? (
				<Card
					className={cn(
						"border-2 border-dashed transition-colors cursor-pointer",
						isDragOver
							? "border-primary bg-primary/5"
							: "border-muted-foreground/25 hover:border-primary/50",
						disabled && "opacity-50 cursor-not-allowed"
					)}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<CardContent className="p-8 text-center">
						<Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-lg font-medium mb-2">
							{t("upload.dragText")}
						</p>
						<p className="text-sm text-muted-foreground mb-4">
							{t("upload.supportedFormats")}
						</p>
						<Button
							onClick={() => fileInputRef.current?.click()}
							disabled={disabled}
						>
							{t("upload.selectFile")}
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="video/*"
							onChange={handleFileInputChange}
							className="hidden"
							disabled={disabled}
						/>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-start justify-between">
							<div className="flex items-start space-x-3">
								<Video className="h-8 w-8 text-primary mt-1" />
								<div className="flex-1 min-w-0">
									<h3 className="font-medium truncate">
										{videoInfo?.name}
									</h3>
									<div className="flex flex-wrap gap-2 mt-2">
										<Badge variant="secondary">
											{formatFileSize(
												videoInfo?.size || 0
											)}
										</Badge>
										<Badge variant="secondary">
											{formatDuration(
												videoInfo?.duration || 0
											)}
										</Badge>
										<Badge variant="secondary">
											{videoInfo?.width} ×{" "}
											{videoInfo?.height}
										</Badge>
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRemoveFile}
								disabled={disabled}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
