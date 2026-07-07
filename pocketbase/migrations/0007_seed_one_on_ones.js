migrate(
  (app) => {
    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'walterfneto18@gmail.com')
    } catch (_) {
      return
    }

    let adminEmp
    try {
      adminEmp = app.findFirstRecordByData('employees', 'user', adminUser.id)
    } catch (_) {
      return
    }

    let managerEmp
    try {
      managerEmp = app.findFirstRecordByData('employees', 'name', 'Ana Moura')
    } catch (_) {
      try {
        const emps = app.findRecordsByFilter('employees', 'role = "Admin RH"', '', 10, 0)
        if (emps.length > 0) managerEmp = emps[0]
      } catch (_) {}
    }

    if (!managerEmp || !adminEmp) return

    const companyId = adminEmp.getString('company')
    const oneOnOnesCol = app.findCollectionByNameOrId('one_on_ones')

    try {
      app.findFirstRecordByData('one_on_ones', 'scheduled_at', '2026-07-20T14:00:00Z')
      return
    } catch (_) {}

    const planned = new Record(oneOnOnesCol)
    planned.set('employee', adminEmp.id)
    planned.set('manager', managerEmp.id)
    planned.set('scheduled_at', '2026-07-20T14:00:00Z')
    planned.set('status', 'planned')
    planned.set('company', companyId)
    planned.set(
      'notes',
      JSON.stringify({
        agenda: [
          'Revisão de metas do trimestre',
          'Feedback sobre projeto X',
          'Plano de desenvolvimento',
        ],
      }),
    )
    app.save(planned)

    const completed = new Record(oneOnOnesCol)
    completed.set('employee', adminEmp.id)
    completed.set('manager', managerEmp.id)
    completed.set('scheduled_at', '2026-06-15T10:00:00Z')
    completed.set('status', 'completed')
    completed.set('company', companyId)
    completed.set(
      'notes',
      JSON.stringify({
        agenda: ['Progresso nas metas de Q1', 'Desafios com a equipe de engenharia'],
        action_items: [
          'Definir plano de capacitação em liderança até 30/06',
          'Agendar workshop de comunicação para o time',
          'Revisar OKRs semanalmente',
        ],
        summary:
          'Excelente progresso no trimestre. Walter demonstrou amadurecimento na gestão de conflitos. Próximo foco: desenvolver habilidades de mentoria.',
      }),
    )
    app.save(completed)
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter('one_on_ones', '', '', 100, 0)
      for (const r of records) {
        app.delete(r)
      }
    } catch (_) {}
  },
)
