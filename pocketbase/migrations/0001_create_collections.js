migrate(
  (app) => {
    const companies = new Collection({
      name: 'companies',
      type: 'base',
      listRule: 'id = @request.auth.company',
      viewRule: 'id = @request.auth.company',
      createRule: "@request.auth.id != ''",
      updateRule: 'id = @request.auth.company',
      deleteRule: 'id = @request.auth.company',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_companies_slug ON companies (slug)'],
    })
    app.save(companies)
    const companiesId = app.findCollectionByNameOrId('companies').id

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('company')) {
      usersCol.fields.add(
        new RelationField({ name: 'company', collectionId: companiesId, maxSelect: 1 }),
      )
    }
    usersCol.listRule = 'company = @request.auth.company'
    usersCol.viewRule = 'company = @request.auth.company'
    app.save(usersCol)

    const teams = new Collection({
      name: 'teams',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'company',
          type: 'relation',
          required: true,
          collectionId: companiesId,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_teams_company ON teams (company)'],
    })
    app.save(teams)
    const teamsId = app.findCollectionByNameOrId('teams').id

    const employees = new Collection({
      name: 'employees',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'user', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'company', type: 'relation', collectionId: companiesId, maxSelect: 1 },
        { name: 'team', type: 'relation', collectionId: teamsId, maxSelect: 1 },
        { name: 'job_title', type: 'text' },
        { name: 'department', type: 'text' },
        { name: 'status', type: 'select', values: ['active', 'inactive'], maxSelect: 1 },
        {
          name: 'role',
          type: 'select',
          values: ['Admin RH', 'Gestor', 'Colaborador'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_employees_company ON employees (company)',
        'CREATE INDEX idx_employees_status ON employees (status)',
      ],
    })
    app.save(employees)
    const employeesId = app.findCollectionByNameOrId('employees').id

    const evalTemplates = new Collection({
      name: 'evaluation_templates',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'questions', type: 'json' },
        { name: 'company', type: 'relation', collectionId: companiesId, maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_eval_templates_company ON evaluation_templates (company)'],
    })
    app.save(evalTemplates)
    const evalTemplatesId = app.findCollectionByNameOrId('evaluation_templates').id

    const evalCycles = new Collection({
      name: 'evaluation_cycles',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'start_date', type: 'date' },
        { name: 'end_date', type: 'date' },
        { name: 'status', type: 'select', values: ['draft', 'active', 'finished'], maxSelect: 1 },
        { name: 'company', type: 'relation', collectionId: companiesId, maxSelect: 1 },
        { name: 'template', type: 'relation', collectionId: evalTemplatesId, maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_eval_cycles_company ON evaluation_cycles (company)',
        'CREATE INDEX idx_eval_cycles_status ON evaluation_cycles (status)',
      ],
    })
    app.save(evalCycles)
    const evalCyclesId = app.findCollectionByNameOrId('evaluation_cycles').id

    const evaluations = new Collection({
      name: 'evaluations',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'cycle', type: 'relation', collectionId: evalCyclesId, maxSelect: 1 },
        { name: 'employee', type: 'relation', collectionId: employeesId, maxSelect: 1 },
        { name: 'evaluator', type: 'relation', collectionId: employeesId, maxSelect: 1 },
        { name: 'responses', type: 'json' },
        { name: 'score', type: 'number' },
        {
          name: 'status',
          type: 'select',
          values: ['pending', 'in_progress', 'completed'],
          maxSelect: 1,
        },
        { name: 'company', type: 'relation', collectionId: companiesId, maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_evaluations_company ON evaluations (company)',
        'CREATE INDEX idx_evaluations_status ON evaluations (status)',
      ],
    })
    app.save(evaluations)
  },
  (app) => {
    const names = ['evaluations', 'evaluation_cycles', 'evaluation_templates', 'employees', 'teams']
    for (const name of names) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (_) {}
    }
    try {
      const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
      const f = usersCol.fields.getByName('company')
      if (f) usersCol.fields.remove(f)
      usersCol.listRule = 'id = @request.auth.id'
      usersCol.viewRule = 'id = @request.auth.id'
      app.save(usersCol)
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('companies'))
    } catch (_) {}
  },
)
