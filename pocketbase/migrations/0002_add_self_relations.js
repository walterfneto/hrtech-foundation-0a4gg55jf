migrate(
  (app) => {
    const teamsCol = app.findCollectionByNameOrId('teams')
    if (!teamsCol.fields.getByName('parent_team')) {
      teamsCol.fields.add(
        new RelationField({ name: 'parent_team', collectionId: teamsCol.id, maxSelect: 1 }),
      )
    }
    app.save(teamsCol)

    const employeesCol = app.findCollectionByNameOrId('employees')
    if (!employeesCol.fields.getByName('manager')) {
      employeesCol.fields.add(
        new RelationField({ name: 'manager', collectionId: employeesCol.id, maxSelect: 1 }),
      )
    }
    app.save(employeesCol)
  },
  (app) => {
    const teamsCol = app.findCollectionByNameOrId('teams')
    const pt = teamsCol.fields.getByName('parent_team')
    if (pt) teamsCol.fields.remove(pt)
    app.save(teamsCol)

    const employeesCol = app.findCollectionByNameOrId('employees')
    const m = employeesCol.fields.getByName('manager')
    if (m) employeesCol.fields.remove(m)
    app.save(employeesCol)
  },
)
