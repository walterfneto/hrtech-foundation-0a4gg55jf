migrate(
  (app) => {
    const employeesCol = app.findCollectionByNameOrId('employees')
    const companiesCol = app.findCollectionByNameOrId('companies')

    const collection = new Collection({
      name: 'employee_documents',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        {
          name: 'employee',
          type: 'relation',
          required: true,
          collectionId: employeesCol.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'company',
          type: 'relation',
          required: true,
          collectionId: companiesCol.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'file',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: [
            'Curriculum',
            'Certificate',
            'Medical Certificate',
            'Contract',
            'Termination',
            'Other',
          ],
          maxSelect: 1,
        },
        { name: 'event_date', type: 'date', required: true },
        { name: 'metadata', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_employee_documents_employee ON employee_documents (employee)',
        'CREATE INDEX idx_employee_documents_event_date ON employee_documents (event_date)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('employee_documents')
      app.delete(col)
    } catch (_) {}
  },
)
