migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('feedbacks')

    if (!col.fields.getByName('context')) {
      col.fields.add(new TextField({ name: 'context', required: true }))
    }
    if (!col.fields.getByName('impact')) {
      col.fields.add(new TextField({ name: 'impact', required: true }))
    }
    if (!col.fields.getByName('action_plan')) {
      col.fields.add(new TextField({ name: 'action_plan', required: true }))
    }
    if (!col.fields.getByName('follow_up_notes')) {
      col.fields.add(new TextField({ name: 'follow_up_notes' }))
    }
    if (!col.fields.getByName('improvement_status')) {
      col.fields.add(
        new SelectField({
          name: 'improvement_status',
          values: ['pending', 'in_progress', 'improved', 'no_change'],
          maxSelect: 1,
        }),
      )
    }

    const contentField = col.fields.getByName('content')
    if (contentField) {
      contentField.required = false
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('feedbacks')
    for (const fname of [
      'context',
      'impact',
      'action_plan',
      'follow_up_notes',
      'improvement_status',
    ]) {
      const f = col.fields.getByName(fname)
      if (f) col.fields.remove(f)
    }
    const contentField = col.fields.getByName('content')
    if (contentField) {
      contentField.required = true
    }
    app.save(col)
  },
)
