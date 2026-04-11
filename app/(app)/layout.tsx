import Header from './components/Header'
import Sidebar from './components/Sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Sidebar />
      <main className="px-8 py-8">
        <div className="mx-auto max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  )
}
