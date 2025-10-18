export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="min-h-screen fl_center p-5">{children}</div>;
}
