require("dotenv").config();

const sequelize = require("../config/db");
const RoutePermission = require("../models/routePermission.model");

const DEFAULT_PERMISSIONS = [
  { key: "article:list",   resource: "article",  action: "list",   allowedRoles: ["public"],              description: "View article list" },
  { key: "article:view",   resource: "article",  action: "view",   allowedRoles: ["public"],              description: "View single article" },
  { key: "article:create", resource: "article",  action: "create", allowedRoles: ["admin", "editor"],     description: "Create article" },
  { key: "article:update", resource: "article",  action: "update", allowedRoles: ["admin", "editor"],     description: "Update article" },
  { key: "article:delete", resource: "article",  action: "delete", allowedRoles: ["admin"],               description: "Delete article" },

  { key: "issue:list",     resource: "issue",    action: "list",   allowedRoles: ["public"],              description: "View issue list" },
  { key: "issue:view",     resource: "issue",    action: "view",   allowedRoles: ["public"],              description: "View single issue" },
  { key: "issue:create",   resource: "issue",    action: "create", allowedRoles: ["admin", "editor"],     description: "Create issue" },
  { key: "issue:update",   resource: "issue",    action: "update", allowedRoles: ["admin", "editor"],     description: "Update issue" },
  { key: "issue:delete",   resource: "issue",    action: "delete", allowedRoles: ["admin"],               description: "Delete issue" },

  { key: "author:list",    resource: "author",   action: "list",   allowedRoles: ["public"],              description: "View author list" },
  { key: "author:view",    resource: "author",   action: "view",   allowedRoles: ["public"],              description: "View single author" },
  { key: "author:create",  resource: "author",   action: "create", allowedRoles: ["admin", "editor"],     description: "Create author" },
  { key: "author:update",  resource: "author",   action: "update", allowedRoles: ["admin", "editor"],     description: "Update author" },
  { key: "author:delete",  resource: "author",   action: "delete", allowedRoles: ["admin"],               description: "Delete author" },

  { key: "category:list",  resource: "category", action: "list",   allowedRoles: ["public"],              description: "View category list" },
  { key: "category:view",  resource: "category", action: "view",   allowedRoles: ["public"],              description: "View single category" },
  { key: "category:create",resource: "category", action: "create", allowedRoles: ["admin", "editor"],     description: "Create category" },
  { key: "category:update",resource: "category", action: "update", allowedRoles: ["admin", "editor"],     description: "Update category" },
  { key: "category:delete",resource: "category", action: "delete", allowedRoles: ["admin"],               description: "Delete category" },

  { key: "magazine:list",  resource: "magazine", action: "list",   allowedRoles: ["public"],              description: "View magazine list" },
  { key: "magazine:view",  resource: "magazine", action: "view",   allowedRoles: ["public"],              description: "View single magazine" },
  { key: "magazine:create",resource: "magazine", action: "create", allowedRoles: ["admin", "editor"],     description: "Create magazine" },
  { key: "magazine:update",resource: "magazine", action: "update", allowedRoles: ["admin", "editor"],     description: "Update magazine" },
  { key: "magazine:delete",resource: "magazine", action: "delete", allowedRoles: ["admin"],               description: "Delete magazine" },

  { key: "user:list",   resource: "user", action: "list",   allowedRoles: ["admin"], description: "View user list" },
  { key: "user:view",   resource: "user", action: "view",   allowedRoles: ["admin"], description: "View single user" },
  { key: "user:create", resource: "user", action: "create", allowedRoles: ["admin"], description: "Create user" },
  { key: "user:update", resource: "user", action: "update", allowedRoles: ["admin"], description: "Update user role" },
  { key: "user:delete", resource: "user", action: "delete", allowedRoles: ["admin"], description: "Delete user" },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected ✅");

    await RoutePermission.sync({ alter: true });

    let created = 0;
    let skipped = 0;

    for (const perm of DEFAULT_PERMISSIONS) {
      const [, wasCreated] = await RoutePermission.findOrCreate({
        where: { key: perm.key },
        defaults: perm,
      });
      wasCreated ? created++ : skipped++;
    }

    console.log(`\nPermissions seeded:`);
    console.log(`   Created: ${created}`);
    console.log(`   Already existed (skipped): ${skipped}`);
    console.log(`\nManage via:`);
    console.log(`   GET  /permissions        — list all`);
    console.log(`   PUT  /permissions/:key   — update allowedRoles`);
    console.log(`\nValid roles: public, viewer, editor, admin`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
