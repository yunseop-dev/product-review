import AuthLinks from "@/features/auth/ui/AuthLinks";
import Link from "next/link";
export default function SiteHeader() {
  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-3xl font-bold">
        <Link href="/">제품 리뷰 사이트</Link>
      </h1>
      <AuthLinks />
    </header>
  );
}
