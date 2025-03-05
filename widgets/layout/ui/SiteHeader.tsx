import AuthLinks from "@/features/auth/ui/AuthLinks";

export default function SiteHeader() {
  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-3xl font-bold">제품 리뷰 사이트</h1>
      <AuthLinks />
    </header>
  );
}
