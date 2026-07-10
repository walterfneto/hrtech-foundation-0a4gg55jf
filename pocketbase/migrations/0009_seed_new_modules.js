migrate(
  (app) => {
    let company
    try {
      company = app.findFirstRecordByData('companies', 'slug', 'techcorp-brasil')
    } catch (_) {
      return
    }

    let adminAuth
    try {
      adminAuth = app.findAuthRecordByEmail('_pb_users_auth_', 'walterfneto18@gmail.com')
    } catch (_) {
      return
    }

    let adminEmp
    try {
      adminEmp = app.findFirstRecordByData('employees', 'user', adminAuth.id)
    } catch (_) {
      return
    }

    const surveysCol = app.findCollectionByNameOrId('pulse_surveys')
    try {
      app.findFirstRecordByData('pulse_surveys', 'title', 'Clima Organizacional Semanal')
    } catch (_) {
      const s = new Record(surveysCol)
      s.set('title', 'Clima Organizacional Semanal')
      s.set('active', true)
      s.set('company', company.id)
      s.set(
        'questions',
        JSON.stringify([
          { id: 'q1', type: 'rating', text: 'De 0 a 10, quão motivado você se sente hoje?' },
          {
            id: 'q2',
            type: 'rating',
            text: 'Você recomendaria nossa empresa como um bom lugar para trabalhar?',
          },
          { id: 'q3', type: 'text', text: 'O que poderia melhorar sua semana?' },
        ]),
      )
      app.save(s)
    }

    const candCol = app.findCollectionByNameOrId('candidates')
    try {
      app.findFirstRecordByData('candidates', 'email', 'marina@example.com')
    } catch (_) {
      const c1 = new Record(candCol)
      c1.set('name', 'Marina Oliveira')
      c1.set('email', 'marina@example.com')
      c1.set('role', 'Dev Frontend Senior')
      c1.set('status', 'interview')
      c1.set('skills', JSON.stringify(['React', 'TypeScript']))
      c1.set('company', company.id)
      app.save(c1)

      const c2 = new Record(candCol)
      c2.set('name', 'Pedro Alves')
      c2.set('email', 'pedro@example.com')
      c2.set('role', 'Analista RH')
      c2.set('status', 'screening')
      c2.set('skills', JSON.stringify(['Recrutamento']))
      c2.set('company', company.id)
      app.save(c2)
    }

    const pdiCol = app.findCollectionByNameOrId('pdi_goals')
    try {
      app.findFirstRecordByData('pdi_goals', 'title', 'Curso de Liderança Avançada')
    } catch (_) {
      const p1 = new Record(pdiCol)
      p1.set('title', 'Curso de Liderança Avançada')
      p1.set('description', 'Aprimorar habilidades de gestão.')
      p1.set('employee', adminEmp.id)
      p1.set('status', 'in_progress')
      p1.set('progress', 40)
      p1.set('company', company.id)
      app.save(p1)
    }

    const tasksCol = app.findCollectionByNameOrId('tasks')
    try {
      app.findFirstRecordByData('tasks', 'title', 'Assinar termo de confidencialidade')
    } catch (_) {
      const t1 = new Record(tasksCol)
      t1.set('title', 'Assinar termo de confidencialidade')
      t1.set('status', 'todo')
      t1.set('assignee', adminEmp.id)
      t1.set('priority', 'high')
      t1.set('company', company.id)
      app.save(t1)

      const t2 = new Record(tasksCol)
      t2.set('title', 'Responder avaliação de desempenho')
      t2.set('status', 'in_progress')
      t2.set('assignee', adminEmp.id)
      t2.set('priority', 'medium')
      t2.set('company', company.id)
      app.save(t2)
    }

    const reqCol = app.findCollectionByNameOrId('hr_requests')
    try {
      app.findFirstRecordByData('hr_requests', 'type', 'vacation')
    } catch (_) {
      const r1 = new Record(reqCol)
      r1.set('requester', adminEmp.id)
      r1.set('type', 'vacation')
      r1.set('status', 'pending')
      r1.set('details', JSON.stringify({ start_date: '2026-12-01', end_date: '2026-12-15' }))
      r1.set('company', company.id)
      app.save(r1)
    }

    // Assign potential to existing evaluations
    const evals = app.findRecordsByFilter('evaluations', '', '', 100, 0)
    for (const ev of evals) {
      if (!ev.get('potential')) {
        ev.set('potential', Math.floor(Math.random() * 3) + 3) // 3-5
        app.save(ev)
      }
    }
  },
  (app) => {
    // rollback logic omitted for seed
  },
)
