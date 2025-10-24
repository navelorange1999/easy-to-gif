import {Shield, Zap, Smartphone, Heart} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {useTranslation} from "react-i18next";

export function Footer() {
	const {t} = useTranslation();

	return (
		<footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* 特性介绍 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								{t("footer.whyChooseUs")}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-start gap-3">
								<Shield className="h-5 w-5 text-green-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										{t("footer.privacy.title")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("footer.privacy.description")}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										{t("footer.fast.title")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("footer.fast.description")}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
								<div>
									<p className="font-medium text-sm">
										{t("footer.responsive.title")}
									</p>
									<p className="text-xs text-muted-foreground">
										{t("footer.responsive.description")}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 支持格式 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								{t("footer.supportedFormats")}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="font-medium text-sm mb-2">
									{t("footer.inputFormats")}
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
									{t("footer.outputFormats")}
								</p>
								<Badge variant="outline" className="text-xs">
									{t("footer.gifOptimized")}
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* 使用说明 */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">
								{t("footer.instructions")}
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
									<span>{t("footer.step1")}</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										2
									</Badge>
									<span>{t("footer.step2")}</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										3
									</Badge>
									<span>{t("footer.step3")}</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="w-5 h-5 p-0 flex items-center justify-center text-xs"
									>
										4
									</Badge>
									<span>{t("footer.step4")}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />
				<div className="text-center text-sm text-muted-foreground">
					<div className="flex items-center justify-center gap-1 mb-2">
						<span>{t("header.madeWith")}</span>
						<Heart className="h-4 w-4 text-destructive" />
						<span>{t("header.forCreators")}</span>
					</div>
					<p>{t("footer.copyright")}</p>
					<p className="mt-1">{t("footer.feedback")}</p>
				</div>
			</div>
		</footer>
	);
}
