import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Team from '@/pages/Team'
import Evaluations from '@/pages/Evaluations'
import Goals from '@/pages/Goals'
import Meetings from '@/pages/Meetings'
import Feedback from '@/pages/Feedback'
import PDI from '@/pages/PDI'
import Dossier from '@/pages/Dossier'
import MyDevelopment from '@/pages/MyDevelopment'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/equipe" element={<Team />} />
              <Route path="/avaliacoes" element={<Evaluations />} />
              <Route path="/metas" element={<Goals />} />
              <Route path="/1a1" element={<Meetings />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/pdi" element={<PDI />} />
              <Route path="/dossie" element={<Dossier />} />
              <Route path="/meu-desenvolvimento" element={<MyDevelopment />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
