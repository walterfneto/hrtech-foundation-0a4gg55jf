migrate(
  (app) => {
    const employeesId = app.findCollectionByNameOrId('employees').id
    const companiesId = app.findCollectionByNameOrId('companies').id

    const oneOnOnes = new Collection({
      name: 'one_on_ones',
      type: 'base',
      listRule: '@request.auth.id = employee.user.id || @request.auth.id = manager.user.id',
      viewRule: '@request.auth.id = employee.user.id || @request.auth.id = manager.user.id',
      createRule: "@request.auth.id != ''",
      updateRule: '@request.auth.id = manager.user.id',
      deleteRule: '@request.auth.id = manager.user.id',
      fields: [
        {
          name: 'employee',
          type: 'relation',
          required: true,
          collectionId: employeesId,
          maxSelect: 1,
        },
        {
          name: 'manager',
          type: 'relation',
          required: true,
          collectionId: employeesId,
          maxSelect: 1,
        },
        { name: 'scheduled_at', type: 'date', required: true },
        { name: 'notes', type: 'json' },
        {
          name: 'status',
          type: 'select',
          values: ['planned', 'completed', 'cancelled'],
          maxSelect: 1,
        },
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
      indexes: [
        'CREATE INDEX idx_one_on_ones_employee ON one_on_ones (employee)',
        'CREATE INDEX idx_one_on_ones_manager ON one_on_ones (manager)',
        'CREATE INDEX idx_one_on_ones_scheduled ON one_on_ones (scheduled_at)',
      ],
    })
    app.save(oneOnOnes)

    const evalCol = app.findCollectionByNameOrId('evaluations')
    evalCol.listRule = 'company = @request.auth.company || @request.auth.id = employee.user.id'
    evalCol.viewRule = 'company = @request.auth.company || @request.auth.id = employee.user.id'
    app.save(evalCol)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('one_on_ones'))
    } catch (_) {}

    try {
      const evalCol = app.findCollectionByNameOrId('evaluations')
      evalCol.listRule = 'company = @request.auth.company'
      evalCol.viewRule = 'company = @request.auth.company'
      app.save(evalCol)
    } catch (_) {}
  },
)
