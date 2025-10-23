import {Shield, Zap, Smartphone} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";

export function Footer() {
	return (
		<footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* 特性介绍 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								为什么选择我们？
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-start gap-3">
								<Shield className="h-5 w-5 text-green-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										隐私保护
									</p>
									<p className="text-xs text-muted-foreground">
										所有处理都在本地完成，不会上传任何文件
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										快速转换
									</p>
									<p className="text-xs text-muted-foreground">
										基于 FFmpeg WASM 技术，转换速度快
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										响应式设计
									</p>
									<p className="text-xs text-muted-foreground">
										支持桌面端和移动端使用
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 支持格式 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								支持格式
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="font-medium text-sm mb-2">
									输入格式
								</p>
								<div className="flex flex-wrap gap-1">
									{[
										"MP4",
										"MOV",
										"AVI",
										"WebM",
										"MKV",
										"3GP",
										"FLV",
									].map((format) => (
										<Badge
											key={format}
											variant="secondary"
											className="text-xs"
										>
											{format}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<p className="font-medium text-sm mb-2">
									输出格式
								</p>
								<Badge variant="outline" className="text-xs">
									GIF（优化压缩）
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* 使用说明 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								使用说明
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2 text-xs text-muted-foreground">
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										1
									</Badge>
									<span>上传您的视频文件</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										2
									</Badge>
									<span>调整转换参数</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										3
									</Badge>
									<span>点击开始转换</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										4
									</Badge>
									<span>下载生成的 GIF</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />
				<div className="text-center text-sm text-muted-foreground">
					<p>© 2024 Easy to GIF. 免费开源工具，基于 FFmpeg 构建。</p>
					<p className="mt-1">
						如有问题，请访问我们的 GitHub 仓库反馈。
					</p>
				</div>
			</div>
		</footer>
	);
}
