import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl =
		process.env.NODE_ENV === "production"
			? "https://auth.shuvadeep.site"
			: "http://localhost:3000";

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: [
					"/sign-in",
					"/sign-up",
					"/forgot-password",
					"/reset-password",
					"/api/"
				]
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`
	};
}
