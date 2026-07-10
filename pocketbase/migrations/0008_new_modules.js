migrate(
  (app) => {
    const companiesId = app.findCollectionByNameOrId('companies').id
    const employeesId = app.findCollectionByNameOrId('employees').id

    const tasks = new Collection({
      name: 'tasks',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['todo', 'in_progress', 'completed'],
          maxSelect: 1,
        },
        { name: 'assignee', type: 'relation', collectionId: employeesId, maxSelect: 1 },
        { name: 'priority', type: 'select', values: ['low', 'medium', 'high'], maxSelect: 1 },
        { name: 'due_date', type: 'date' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(tasks)

    const feedbacks = new Collection({
      name: 'feedbacks',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        {
          name: 'sender',
          type: 'relation',
          collectionId: employeesId,
          required: true,
          maxSelect: 1,
        },
        {
          name: 'receiver',
          type: 'relation',
          collectionId: employeesId,
          required: true,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          values: ['public_praise', 'confidential_improvement', '1_on_1'],
          maxSelect: 1,
        },
        { name: 'content', type: 'text', required: true },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(feedbacks)

    const pdi_goals = new Collection({
      name: 'pdi_goals',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'employee',
          type: 'relation',
          collectionId: employeesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'due_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          values: ['todo', 'in_progress', 'completed'],
          maxSelect: 1,
        },
        { name: 'progress', type: 'number' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pdi_goals)

    const pulse_surveys = new Collection({
      name: 'pulse_surveys',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'questions', type: 'json', required: true },
        { name: 'active', type: 'bool' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pulse_surveys)

    const pulse_responses = new Collection({
      name: 'pulse_responses',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        {
          name: 'survey',
          type: 'relation',
          collectionId: pulse_surveys.id,
          required: true,
          maxSelect: 1,
        },
        { name: 'score', type: 'number', required: true },
        { name: 'comments', type: 'text' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pulse_responses)

    const hr_requests = new Collection({
      name: 'hr_requests',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        {
          name: 'requester',
          type: 'relation',
          collectionId: employeesId,
          required: true,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          values: ['vacation', 'refund', 'bonus', 'training'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          values: ['pending', 'approved', 'rejected'],
          maxSelect: 1,
        },
        { name: 'details', type: 'json' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(hr_requests)

    const candidates = new Collection({
      name: 'candidates',
      type: 'base',
      listRule: 'company = @request.auth.company',
      viewRule: 'company = @request.auth.company',
      createRule: 'company = @request.auth.company',
      updateRule: 'company = @request.auth.company',
      deleteRule: 'company = @request.auth.company',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'role', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['screening', 'interview', 'offer', 'hired', 'rejected'],
          maxSelect: 1,
        },
        { name: 'skills', type: 'json' },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(candidates)

    const onboarding_tracks = new Collection({
      name: 'onboarding_tracks',
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
          collectionId: employeesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'tasks', type: 'json' },
        { name: 'status', type: 'select', values: ['in_progress', 'completed'], maxSelect: 1 },
        {
          name: 'company',
          type: 'relation',
          collectionId: companiesId,
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(onboarding_tracks)

    const evals = app.findCollectionByNameOrId('evaluations')
    evals.fields.add(new NumberField({ name: 'potential' }))
    app.save(evals)
  },
  (app) => {
    const names = [
      'onboarding_tracks',
      'candidates',
      'hr_requests',
      'pulse_responses',
      'pulse_surveys',
      'pdi_goals',
      'feedbacks',
      'tasks',
    ]
    for (const n of names) {
      try {
        app.delete(app.findCollectionByNameOrId(n))
      } catch (_) {}
    }
    try {
      const evals = app.findCollectionByNameOrId('evaluations')
      const f = evals.fields.getByName('potential')
      if (f) evals.fields.remove(f)
      app.save(evals)
    } catch (_) {}
  },
)
