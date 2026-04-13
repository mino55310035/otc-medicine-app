import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import { SidebarProvider } from './components/SidebarContext'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen app-gradient-bg">
        <Header />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
}
