const fetchRoles = async (ctx) => {
  const admins = [];
  await ctx.roles
    .fetch()
    .then((roles) => {
      admins.push(
        ...roles.filter((role) => {
          const perms = role.permissions.serialize();
          if (perms.ADMINISTRATOR || perms.MANAGE_GUILD)
            return { id: role.id, type: 1, permission: true };
        })
      );
    })
    .then(async () => {
      return admins;
    })
    .catch((err) => console.log(err));
};

module.exports = {
  fetchRoles,
};
