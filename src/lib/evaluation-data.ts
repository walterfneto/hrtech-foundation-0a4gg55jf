import type { EvaluationTemplate, EvaluationCycle, EvaluationResponse } from '@/lib/types'

export const MOCK_TEMPLATES: EvaluationTemplate[] = [
  {
    id: 'tpl-1',
    nome: 'Avaliação Semestral Padrão',
    descricao: 'Template padrão para avaliações de desempenho semestrais',
    empresa_id: 'emp-1',
    created_at: '2026-01-15T10:00:00Z',
    deleted_at: null,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        label: 'Comunicação e Alinhamento',
        description: 'Capacidade de comunicar ideias claramente',
        required: true,
        scaleMax: 5,
      },
      {
        id: 'q2',
        type: 'rating',
        label: 'Trabalho em Equipe',
        description: 'Colaboração com colegas',
        required: true,
        scaleMax: 5,
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        label: 'Potencial de Liderança',
        required: true,
        options: ['Não demonstra', 'Em desenvolvimento', 'Demonstra', 'Excepcional'],
      },
      {
        id: 'q4',
        type: 'text',
        label: 'Feedback Geral',
        description: 'Forneça um feedback construtivo',
        required: true,
      },
    ],
  },
  {
    id: 'tpl-2',
    nome: 'Avaliação 360°',
    descricao: 'Avaliação entre pares com múltiplas dimensões',
    empresa_id: 'emp-1',
    created_at: '2026-03-01T10:00:00Z',
    deleted_at: null,
    questions: [
      { id: 'q1', type: 'rating', label: 'Colaboração', required: true, scaleMax: 5 },
      { id: 'q2', type: 'text', label: 'Pontos fortes', required: true },
      { id: 'q3', type: 'text', label: 'Pontos de melhoria', required: true },
    ],
  },
]

export const MOCK_CYCLES: EvaluationCycle[] = [
  {
    id: 'cyc-1',
    nome: 'Ciclo Semestral 2026.1',
    template_id: 'tpl-1',
    data_inicio: '2026-06-01',
    data_fim: '2026-07-15',
    target: 'empresa',
    target_teams: [],
    status: 'ativo',
    empresa_id: 'emp-1',
    created_at: '2026-05-20T10:00:00Z',
    deleted_at: null,
  },
]

export const MOCK_RESPONSES: EvaluationResponse[] = [
  {
    id: 'r-1',
    cycle_id: 'cyc-1',
    template_id: 'tpl-1',
    user_id: 'u-4',
    user_name: 'Carlos Santos',
    user_avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    status: 'concluido',
    submitted_at: '2026-06-20T14:00:00Z',
  },
  {
    id: 'r-2',
    cycle_id: 'cyc-1',
    template_id: 'tpl-1',
    user_id: 'u-5',
    user_name: 'Juliana Silva',
    user_avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5',
    status: 'rascunho',
    submitted_at: null,
  },
  {
    id: 'r-3',
    cycle_id: 'cyc-1',
    template_id: 'tpl-1',
    user_id: 'u-6',
    user_name: 'Carlos Mendes',
    user_avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=6',
    status: 'nao_iniciado',
    submitted_at: null,
  },
]
