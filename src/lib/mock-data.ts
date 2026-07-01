export const MOCK_USER = {
  name: 'Walter Silva',
  avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  email: 'walter@caminho.com.br',
  tenant: 'TechCorp Brasil',
  empresa_id: 'emp-1',
}

export const MOCK_TEAM = [
  {
    id: '1',
    name: 'Ana Souza',
    role: 'Desenvolvedora Sênior',
    team: 'Engenharia',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    deletedAt: null,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Designer de Produto',
    team: 'Design',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    deletedAt: null,
  },
  {
    id: '3',
    name: 'Beatriz Lima',
    role: 'Gerente de Marketing',
    team: 'Marketing',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4',
    deletedAt: null,
  },
]

export const DOSSIER_EVENTS = [
  {
    id: '1',
    type: 'evaluation',
    title: 'Avaliação Semestral 2026.1',
    date: '30 Jun 2026',
    status: 'Concluído',
    author: 'Sistema (Fechamento de Ciclo)',
    content:
      'O colaborador atingiu expectativas na maioria das competências avaliadas. Destaque positivo para "Trabalho em Equipe". Ponto de atenção em "Gestão de Tempo". Nota final consolidada: 3.8/5.0.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    module: 'Avaliação de Desempenho',
  },
  {
    id: '2',
    type: 'feedback',
    title: 'Feedback de Carlos Mendes',
    date: '15 Jun 2026',
    status: 'Privado',
    author: 'Carlos Mendes',
    content:
      'Queria agradecer pela ajuda na entrega da nova interface. Sua proatividade em parear comigo resolveu o problema muito mais rápido. Devemos continuar com essa dinâmica nas próximas sprints.',
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    module: 'Feedback Contínuo',
  },
  {
    id: '3',
    type: 'goal',
    title: 'Meta Atingida: Reduzir tempo de carregamento',
    date: '10 Mai 2026',
    status: 'Concluído',
    author: 'Ana Souza',
    content:
      'A meta de "Reduzir tempo de carregamento do app em 30%" foi concluída com sucesso. Resultado final alcançado: 35% de redução. Evidências anexadas no módulo de metas.',
    hash: 'f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1',
    module: 'Metas e OKRs',
  },
]
