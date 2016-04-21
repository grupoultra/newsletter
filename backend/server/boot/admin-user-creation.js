module.exports = function (app) {
    Promise.all([
        app.models.Client.findOrCreate(
            {where: {email: 'ar.ibarrasalas@gmail.com'}},
            {
                username: 'admin',
                email: 'ar.ibarrasalas@gmail.com',
                password: 'adminadmin',
                "emailVerified": true
            }
        ),
        app.models.Role.findOrCreate({name: 'admin'})
    ])
    .then(function (array) {
        adminUser = array[0][0];
        adminRole = array[1][0];

        return app.models.RoleMapping.find( { where: {
            principalType: app.models.RoleMapping.USER,
            principalId: adminUser.id}
        });
    })
    .then(function (roleMapping) {
        if (roleMapping.length > 0) return;
        return adminRole.principals.create({
            principalType: app.models.RoleMapping.USER,
            principalId: adminUser.id
        });
    })
    .then(function () {
        console.log('Finished "superadmin" user and role creation');
    })
    .catch(function (err) {
        throw err;
    });
}
