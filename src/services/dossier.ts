import pb from '@/lib/pocketbase/client'
import { fetchEmployeeDocuments, getDocumentFileUrl } from '@/services/employee-documents'

export interface DossierEvent {
  id: string
  type: 'evaluation' | 'feedback' | 'meeting' | 'document'
  title: string
  module: string
  date: string
  dateValue: number
  author: string
  status: string
  content: string
  hash: string
  raw?: any
  fileUrl?: string
  category?: string
}

function simpleHash(str: string): string {
  let h1 = 0,
    h2 = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    h1 = ((h1 << 5) - h1 + c) | 0
    h2 = ((h2 << 3) + h2 + c * 7) | 0
  }
  return (
    Math.abs(h1).toString(16).padStart(8, '0') + Math.abs(h2).toString(16).padStart(8, '0')
  ).repeat(4)
}

export async function fetchEmployeeInfo(employeeId: string) {
  return pb.collection('employees').getOne(employeeId, {
    expand: 'user,team,company,manager',
  })
}

export async function fetchDossierEvents(employeeId: string): Promise<DossierEvent[]> {
  const [feedbacks, oneOnOnes, evaluations, documents] = await Promise.all([
    pb
      .collection('feedbacks')
      .getFullList({
        filter: `receiver="${employeeId}"`,
        expand: 'sender.user,receiver.user',
        sort: '-created',
      })
      .catch(() => []),
    pb
      .collection('one_on_ones')
      .getFullList({
        filter: `employee="${employeeId}"`,
        expand: 'employee.user,manager.user',
        sort: '-scheduled_at',
      })
      .catch(() => []),
    pb
      .collection('evaluations')
      .getFullList({
        filter: `employee="${employeeId}"`,
        expand: 'employee,evaluator,evaluator.user,cycle',
        sort: '-created',
      })
      .catch(() => []),
    fetchEmployeeDocuments(employeeId).catch(() => []),
  ])

  const events: DossierEvent[] = []

  for (const f of feedbacks as any[]) {
    const senderName = f.expand?.sender?.expand?.user?.name ?? 'Sistema'
    events.push({
      id: f.id,
      type: 'feedback',
      title: f.type === 'public_praise' ? 'Reconhecimento Público' : 'Feedback Confidencial',
      module: 'Feedback',
      date: new Date(f.created).toLocaleDateString('pt-BR'),
      dateValue: new Date(f.created).getTime(),
      author: senderName,
      status: f.improvement_status || 'N/A',
      content:
        f.content ||
        `Contexto: ${f.context || ''}\nImpacto: ${f.impact || ''}\nPlano: ${f.action_plan || ''}`,
      hash: simpleHash(f.id + f.created),
      raw: f,
    })
  }

  for (const m of oneOnOnes as any[]) {
    const mgrName = m.expand?.manager?.expand?.user?.name ?? 'Gestor'
    events.push({
      id: m.id,
      type: 'meeting',
      title: `1:1 - ${m.objective || 'Objetivo não definido'}`,
      module: '1:1',
      date: new Date(m.scheduled_at).toLocaleDateString('pt-BR'),
      dateValue: new Date(m.scheduled_at).getTime(),
      author: mgrName,
      status: m.status,
      content:
        m.report ||
        m.reason ||
        [m.positive_points, m.improvement_points].filter(Boolean).join('\n'),
      hash: simpleHash(m.id + m.scheduled_at),
      raw: m,
    })
  }

  for (const e of evaluations as any[]) {
    const evalName = e.expand?.evaluator?.expand?.user?.name ?? 'Avaliador'
    const cycleTitle = e.expand?.cycle?.title ?? 'Ciclo'
    events.push({
      id: e.id,
      type: 'evaluation',
      title: `Avaliação - ${cycleTitle}`,
      module: 'Avaliação',
      date: new Date(e.created).toLocaleDateString('pt-BR'),
      dateValue: new Date(e.created).getTime(),
      author: evalName,
      status: e.status,
      content: `Nota final: ${e.score?.toFixed(1) ?? 'N/A'} / 5.0\nPotencial: ${e.potential?.toFixed(1) ?? 'N/A'} / 5.0`,
      hash: simpleHash(e.id + e.created),
      raw: e,
    })
  }

  for (const d of documents as any[]) {
    events.push({
      id: d.id,
      type: 'document',
      title: `${d.category} - ${d.title}`,
      module: 'Documento',
      date: new Date(d.event_date).toLocaleDateString('pt-BR'),
      dateValue: new Date(d.event_date).getTime(),
      author: 'Upload Manual',
      status: 'Arquivado',
      content: `Documento: ${d.title}\nCategoria: ${d.category}\nData: ${new Date(d.event_date).toLocaleDateString('pt-BR')}`,
      hash: simpleHash(d.id + d.event_date),
      raw: d,
      fileUrl: getDocumentFileUrl(d),
      category: d.category,
    })
  }

  return events.sort((a, b) => b.dateValue - a.dateValue)
}
