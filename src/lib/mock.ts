export const currentUser = {
  id: 'u-1',
  name: 'Ana Moura',
  role: 'Admin RH',
  avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  tenantId: 't-1',
}

export const mockTeam = [
  {
    id: 'u-1',
    name: 'Ana Moura',
    role: 'Diretora de RH',
    manager: '-',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  {
    id: 'u-2',
    name: 'Carlos Santos',
    role: 'Engenheiro de Software',
    manager: 'Roberto Lima',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
  },
  {
    id: 'u-3',
    name: 'Mariana Costa',
    role: 'Designer de Produto',
    manager: 'Ana Moura',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
  },
  {
    id: 'u-4',
    name: 'Roberto Lima',
    role: 'Tech Lead',
    manager: 'Ana Moura',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
  },
  {
    id: 'u-5',
    name: 'Juliana Silva',
    role: 'Analista de Dados',
    manager: 'Roberto Lima',
    status: 'Férias',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5',
  },
]

export const mockGoals = [
  {
    id: 'g-1',
    title: 'Lançar Plataforma MVP',
    progress: 80,
    status: 'No caminho',
    type: 'Empresa',
    owner: 'Ana Moura',
  },
  {
    id: 'g-2',
    title: 'Aumentar engajamento em 20%',
    progress: 45,
    status: 'Em risco',
    type: 'Time',
    owner: 'Mariana Costa',
  },
  {
    id: 'g-3',
    title: 'Reduzir churn para 5%',
    progress: 10,
    status: 'Atrasado',
    type: 'Time',
    owner: 'Roberto Lima',
  },
]

export const mockFeedbacks = [
  {
    id: 'f-1',
    sender: 'Carlos Santos',
    receiver: 'Mariana Costa',
    content: 'Excelente trabalho no redesign da tela de metas! Ficou muito mais intuitivo.',
    type: 'Reconhecimento',
    date: 'Há 2 horas',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
  },
  {
    id: 'f-2',
    sender: 'Ana Moura',
    receiver: 'Roberto Lima',
    content: 'Parabéns pela condução da reunião técnica de hoje.',
    type: 'Reconhecimento',
    date: 'Há 1 dia',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
]

export const mockDossierEvents = [
  {
    id: 'd-1',
    title: 'Avaliação Semestral 2026.1',
    type: 'Avaliação',
    date: '15 Mai 2026',
    status: 'Concluído',
    content:
      'Desempenho acima das expectativas. Demonstrou grande evolução em comunicação e liderança técnica.',
    author: 'Roberto Lima',
    hash: '8f4e92a...3c1b',
    module: 'Avaliação de Desempenho',
  },
  {
    id: 'd-2',
    title: 'Feedback de Carlos Santos',
    type: 'Feedback',
    date: '10 Mai 2026',
    status: 'Público',
    content: 'Obrigado por me ajudar com o refactoring do banco de dados!',
    author: 'Carlos Santos',
    hash: 'a1b2c3d...4e5f',
    module: 'Feedback Contínuo',
  },
  {
    id: 'd-3',
    title: 'PDI - Comunicação com Stakeholders',
    type: 'PDI',
    date: '01 Abr 2026',
    status: 'Em andamento',
    content: 'Foco em melhorar apresentações executivas.',
    author: 'Mariana Costa',
    hash: 'x9y8z7...w6v5',
    module: 'PDI',
  },
  {
    id: 'd-4',
    title: '1:1 com Roberto Lima',
    type: '1:1',
    date: '25 Mar 2026',
    status: 'Realizado',
    content: 'Alinhamento sobre prioridades do trimestre. Metas definidas.',
    author: 'Roberto Lima',
    hash: 'm1n2o3...p4q5',
    module: 'Reuniões 1:1',
  },
]
