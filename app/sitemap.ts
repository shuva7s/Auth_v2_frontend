import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NODE_ENV === "production"
			? "https://auth.shuvadeep.site"
			: "http://localhost:3000";

	const now = new Date();

	return [
		{
			url: `${baseUrl}/`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 1.0
		},
		{
			url: `${baseUrl}/sign-in`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3
		},
		{
			url: `${baseUrl}/sign-up`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3
		},
		{
			url: `${baseUrl}/forgot-password`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.2
		},
		{
			url: `${baseUrl}/reset-password`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.2
		}
	];
}
