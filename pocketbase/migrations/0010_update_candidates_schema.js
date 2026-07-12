migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('candidates')

    if (!col.fields.getByName('observations')) {
      col.fields.add(new TextField({ name: 'observations' }))
    }
    if (!col.fields.getByName('interview_info')) {
      col.fields.add(new TextField({ name: 'interview_info' }))
    }
    if (!col.fields.getByName('evaluation_details')) {
      col.fields.add(new JSONField({ name: 'evaluation_details' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('candidates')
    for (const fname of ['observations', 'interview_info', 'evaluation_details']) {
      const f = col.fields.getByName(fname)
      if (f) col.fields.remove(f)
    }
    app.save(col)
  },
)
