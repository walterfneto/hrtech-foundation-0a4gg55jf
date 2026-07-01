import type { AvaliacaoModelo, AvaliacaoCiclo, AvaliacaoResposta, TeamMember } from '@/lib/types'
import { MOCK_TEAM } from '@/lib/mock-data'

export const MOCK_TEMPLATES: AvaliacaoModelo[] = [
  {
    id: 'tpl-1',
    empresa_id: 'emp-1',
    nome: 'Avaliação Semestral Padrão',
    descricao: 'Modelo padrão para avaliações de desempenho semestrais.',
    questoes: [
      { id: 'q-1', texto: 'Comunicação e Alinhamento', tipo: 'escala', escala_max: 5 },
      { id: 'q-2', texto: 'Trabalho em Equipe', tipo: 'escala', escala_max: 5 },
      { id: 'q-3', texto: 'Entrega de Resultados', tipo: 'escala', escala_max: 5 },
      { id: 'q-4', texto: 'Pontos fortes', tipo: 'texto' },
      { id: 'q-5', texto: 'Pontos de melhoria', tipo: 'texto' },
    ],
    deleted_at: null,
  },
  {
    id: 'tpl-2',
    empresa_id: 'emp-1',
    nome: 'Avaliação 360°',
    descricao: 'Avaliação completa com feedback de pares.',
    questoes: [
      {
        id: 'q-6',
        texto: 'Como você avalia a colaboração deste colega?',
        tipo: 'multipla_escolha',
        opcoes: ['Excelente', 'Bom', 'Regular', 'Precisa melhorar'],
      },
      { id: 'q-7', texto: 'Liderança e iniciativa', tipo: 'escala', escala_max: 5 },
      { id: 'q-8', texto: 'Feedback geral', tipo: 'texto' },
    ],
    deleted_at: null,
  },
]

export const MOCK_CYCLES: AvaliacaoCiclo[] = [
  {
    id: 'c-1',
    empresa_id: 'emp-1',
    modelo_id: 'tpl-1',
    nome: 'Ciclo Semestral 2026.1',
    data_inicio: '2026-06-01',
    data_fim: '2026-07-15',
    participantes: 'empresa',
    status: 'ativo',
    deleted_at: null,
  },
  {
    id: 'c-2',
    empresa_id: 'emp-1',
    modelo_id: 'tpl-2',
    nome: 'Avaliação 360° - Q2',
    data_inicio: '2026-07-01',
    data_fim: '2026-07-31',
    participantes: 'times:t-1,t-2',
    status: 'rascunho',
    deleted_at: null,
  },
  {
    id: 'c-3',
    empresa_id: 'emp-1',
    modelo_id: 'tpl-1',
    nome: 'Ciclo Semestral 2025.2',
    data_inicio: '2025-12-01',
    data_fim: '2026-01-15',
    participantes: 'empresa',
    status: 'fechado',
    deleted_at: null,
  },
]

export const MOCK_AVALIACOES: AvaliacaoResposta[] = [
  {
    id: 'a-1',
    ciclo_id: 'c-1',
    avaliador_id: '0',
    avaliado_id: '0',
    tipo: 'auto',
    respostas: {},
    status: 'pendente',
    submitted_at: null,
  },
  {
    id: 'a-2',
    ciclo_id: 'c-1',
    avaliador_id: '0',
    avaliado_id: '1',
    tipo: 'gestor',
    respostas: {},
    status: 'pendente',
    submitted_at: null,
  },
  {
    id: 'a-3',
    ciclo_id: 'c-1',
    avaliador_id: '1',
    avaliado_id: '1',
    tipo: 'auto',
    respostas: { 'q-1': 4, 'q-2': 5 },
    status: 'em_andamento',
    submitted_at: null,
  },
  {
    id: 'a-4',
    ciclo_id: 'c-1',
    avaliador_id: '0',
    avaliado_id: '2',
    tipo: 'gestor',
    respostas: {
      'q-1': 4,
      'q-2': 5,
      'q-3': 4,
      'q-4': 'Grande criatividade',
      'q-5': 'Pode melhorar prazos',
    },
    status: 'concluida',
    submitted_at: '2026-06-20T10:00:00Z',
  },
  {
    id: 'a-5',
    ciclo_id: 'c-1',
    avaliador_id: '0',
    avaliado_id: '3',
    tipo: 'gestor',
    respostas: {},
    status: 'pendente',
    submitted_at: null,
  },
  {
    id: 'a-6',
    ciclo_id: 'c-1',
    avaliador_id: '0',
    avaliado_id: '4',
    tipo: 'gestor',
    respostas: { 'q-1': 5, 'q-2': 4, 'q-3': 5 },
    status: 'em_andamento',
    submitted_at: null,
  },
]

export function getCycle(cicloId: string): AvaliacaoCiclo | undefined {
  return MOCK_CYCLES.find((c) => c.id === cicloId)
}

export function getTemplate(modeloId: string): AvaliacaoModelo | undefined {
  return MOCK_TEMPLATES.find((t) => t.id === modeloId)
}

export function getMember(id: string): TeamMember | undefined {
  return MOCK_TEAM.find((m) => m.id === id)
}

export function getCycleProgress(cicloId: string): { total: number; completed: number } {
  const avaliacoes = MOCK_AVALIACOES.filter((a) => a.ciclo_id === cicloId)
  return {
    total: avaliacoes.length,
    completed: avaliacoes.filter((a) => a.status === 'concluida').length,
  }
}
