import Header from '../../components/Header/Header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-wrapper">
      <Header />
      <main>{children}</main>
    </div>
  );
}
