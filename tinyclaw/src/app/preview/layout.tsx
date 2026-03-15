import { notFound } from "next/navigation";

/**
 * 预览页 layout — 生产环境返回 404，仅开发环境可用
 */
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <>{children}</>;
}
