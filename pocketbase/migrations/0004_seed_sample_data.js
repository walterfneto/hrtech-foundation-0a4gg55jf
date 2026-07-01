migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const companiesCol = app.findCollectionByNameOrId('companies')
    const teamsCol = app.findCollectionByNameOrId('teams')
    const employeesCol = app.findCollectionByNameOrId('employees')
    const tplCol = app.findCollectionByNameOrId('evaluation_templates')
    const cycleCol = app.findCollectionByNameOrId('evaluation_cycles')

    let company
    try {
      company = app.findFirstRecordByData('companies', 'slug', 'techcorp-brasil')
    } catch (_) {
      company = new Record(companiesCol)
      company.set('name', 'TechCorp Brasil')
      company.set('slug', 'techcorp-brasil')
      app.save(company)
    }

    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'walterfneto18@gmail.com')
    } catch (_) {
      adminUser = new Record(usersCol)
      adminUser.setEmail('walterfneto18@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Walter Silva')
      app.save(adminUser)
    }
    adminUser.set('company', company.id)
    app.save(adminUser)

    const teamDefs = [
      { key: 'executive', name: 'Executive' },
      { key: 'engineering', name: 'Engineering' },
      { key: 'hr', name: 'HR' },
    ]
    const teamMap = {}
    for (const td of teamDefs) {
      try {
        teamMap[td.key] = app.findFirstRecordByData('teams', 'name', td.name)
      } catch (_) {
        const t = new Record(teamsCol)
        t.set('name', td.name)
        t.set('company', company.id)
        app.save(t)
        teamMap[td.key] = t
      }
    }
    if (!teamMap.engineering.get('parent_team')) {
      teamMap.engineering.set('parent_team', teamMap.executive.id)
      app.save(teamMap.engineering)
    }
    if (!teamMap.hr.get('parent_team')) {
      teamMap.hr.set('parent_team', teamMap.executive.id)
      app.save(teamMap.hr)
    }

    const empDefs = [
      {
        name: 'Walter Silva',
        email: 'walterfneto18@gmail.com',
        job_title: 'CEO',
        dept: 'Executive',
        team: 'executive',
        role: 'Admin RH',
        mgr: null,
      },
      {
        name: 'Ana Moura',
        email: 'ana@techcorp.com.br',
        job_title: 'Diretora de RH',
        dept: 'RH',
        team: 'hr',
        role: 'Admin RH',
        mgr: 'Walter Silva',
      },
      {
        name: 'Roberto Lima',
        email: 'roberto@techcorp.com.br',
        job_title: 'Tech Lead',
        dept: 'Engenharia',
        team: 'engineering',
        role: 'Gestor',
        mgr: 'Ana Moura',
      },
      {
        name: 'Carlos Santos',
        email: 'carlos@techcorp.com.br',
        job_title: 'Engenheiro de Software',
        dept: 'Engenharia',
        team: 'engineering',
        role: 'Colaborador',
        mgr: 'Roberto Lima',
      },
      {
        name: 'Juliana Silva',
        email: 'juliana@techcorp.com.br',
        job_title: 'Analista de Dados',
        dept: 'Engenharia',
        team: 'engineering',
        role: 'Colaborador',
        mgr: 'Roberto Lima',
      },
    ]

    const empMap = {}
    for (const ed of empDefs) {
      let user
      try {
        user = app.findAuthRecordByEmail('_pb_users_auth_', ed.email)
      } catch (_) {
        user = new Record(usersCol)
        user.setEmail(ed.email)
        user.setPassword('Skip@Pass')
        user.setVerified(true)
        user.set('name', ed.name)
        user.set('company', company.id)
        app.save(user)
      }
      let emp
      try {
        emp = app.findFirstRecordByData('employees', 'user', user.id)
      } catch (_) {
        emp = new Record(employeesCol)
        emp.set('user', user.id)
        emp.set('company', company.id)
        emp.set('team', teamMap[ed.team].id)
        emp.set('job_title', ed.job_title)
        emp.set('department', ed.dept)
        emp.set('status', 'active')
        emp.set('role', ed.role)
        app.save(emp)
      }
      empMap[ed.name] = emp
    }

    for (const ed of empDefs) {
      if (ed.mgr && empMap[ed.name] && empMap[ed.mgr]) {
        empMap[ed.name].set('manager', empMap[ed.mgr].id)
        app.save(empMap[ed.name])
      }
    }

    try {
      app.findFirstRecordByData('evaluation_templates', 'name', 'Avaliação Semestral Padrão')
    } catch (_) {
      const tpl = new Record(tplCol)
      tpl.set('name', 'Avaliação Semestral Padrão')
      tpl.set('description', 'Modelo padrão para avaliações de desempenho semestrais')
      tpl.set(
        'questions',
        JSON.stringify([
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
        ]),
      )
      tpl.set('company', company.id)
      app.save(tpl)

      const cycle = new Record(cycleCol)
      cycle.set('title', 'Ciclo Semestral 2026.1')
      cycle.set('description', 'Avaliação de desempenho do primeiro semestre de 2026')
      cycle.set('start_date', '2026-06-01')
      cycle.set('end_date', '2026-07-15')
      cycle.set('status', 'active')
      cycle.set('company', company.id)
      cycle.set('template', tpl.id)
      app.save(cycle)
    }
  },
  (app) => {
    try {
      const c = app.findFirstRecordByData('companies', 'slug', 'techcorp-brasil')
      app.delete(c)
    } catch (_) {}
  },
)
