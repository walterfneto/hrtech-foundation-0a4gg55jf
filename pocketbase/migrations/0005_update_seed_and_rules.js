migrate(
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'walterfneto18@gmail.com')
      user.set('name', 'Walter Neto')
      app.save(user)
    } catch (_) {}

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    usersCol.listRule = "@request.auth.id != ''"
    usersCol.viewRule = "@request.auth.id != ''"
    app.save(usersCol)
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'walterfneto18@gmail.com')
      user.set('name', 'Walter Silva')
      app.save(user)
    } catch (_) {}

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    usersCol.listRule = 'company = @request.auth.company'
    usersCol.viewRule = 'company = @request.auth.company'
    app.save(usersCol)
  },
)
