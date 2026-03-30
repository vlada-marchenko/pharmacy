

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-wrapper">
      <main>{children}</main>
    </div>
  );
}
