migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('one_on_ones')

    if (!col.fields.getByName('objective')) {
      col.fields.add(new TextField({ name: 'objective', required: true }))
    }
    if (!col.fields.getByName('reason')) {
      col.fields.add(new TextField({ name: 'reason' }))
    }
    if (!col.fields.getByName('positive_points')) {
      col.fields.add(new TextField({ name: 'positive_points' }))
    }
    if (!col.fields.getByName('improvement_points')) {
      col.fields.add(new TextField({ name: 'improvement_points' }))
    }
    if (!col.fields.getByName('report')) {
      col.fields.add(new TextField({ name: 'report' }))
    }
    if (!col.fields.getByName('action_deadline')) {
      col.fields.add(new DateField({ name: 'action_deadline' }))
    }

    app.save(col)

    app
      .db()
      .newQuery(
        "UPDATE one_on_ones SET objective = 'Objetivo não definido' WHERE objective = '' OR objective IS NULL",
      )
      .execute()
  },
  (app) => {
    const col = app.findCollectionByNameOrId('one_on_ones')
    for (const fname of [
      'objective',
      'reason',
      'positive_points',
      'improvement_points',
      'report',
      'action_deadline',
    ]) {
      const f = col.fields.getByName(fname)
      if (f) col.fields.remove(f)
    }
    app.save(col)
  },
)
