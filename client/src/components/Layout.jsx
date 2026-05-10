import Sidebar from "./Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-page">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
