const fetchRoles = async (ctx) => {
  const admins = [];
  await ctx.roles
    .fetch()
    .then(async (roles) => {
      await roles.forEach((role) => {
        const perms = role.permissions.serialize();
        if (perms.ADMINISTRATOR || perms.MANAGE_GUILD) {
          const newValue = { id: `${role.id}`, type: "ROLE", permission: true };
          admins.push(newValue);
        }
      });
    })
    .catch((err) => console.log(err));

  return admins;
};

module.exports = {
  fetchRoles,
};
