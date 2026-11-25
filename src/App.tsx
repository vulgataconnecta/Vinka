'use client'

import { CheckCircle2 } from 'lucide-react'
import { AdminPortal } from './components/AdminPortal'
import { AuthModal } from './components/AuthModal'
import { ClientPortal } from './components/ClientPortal'
import { EventBuilder } from './components/EventBuilder'
import { Header } from './components/Header'
import { LandingPage } from './components/LandingPage'
import { ListingDetailPage } from './components/ListingDetailPage'
import { ProviderOnboarding } from './components/ProviderOnboarding'
import { ProviderPortal } from './components/ProviderPortal'
import { VinkaProvider, useVinka } from './context/VinkaContext'

function VinkaShell() {
  const { route, toast } = useVinka()

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#221610]">
      <Header />

      <div key={route} className="vinka-route-enter">
        {route === 'landing' && <LandingPage />}
        {route === 'event-builder' && <EventBuilder />}
        {route === 'client-portal' && <ClientPortal />}
        {route === 'listing-detail' && <ListingDetailPage />}
        {route === 'provider-onboarding' && <ProviderOnboarding />}
        {route === 'provider-portal' && <ProviderPortal />}
        {route === 'admin-portal' && <AdminPortal />}
      </div>

      <AuthModal />

      {toast && (
        <div className="vinka-modal-card fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#221610] text-white px-4 py-3 text-xs font-bold shadow-2xl border border-[#decfc2]/30">
          <CheckCircle2 size={16} className="text-[#d4af77] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <VinkaProvider>
      <VinkaShell />
    </VinkaProvider>
  )
}
