const pagesByRole = {
  client: ["campaigns", "messages", "reports", "leads", "campaign-detail"],
  org: [
    "campaigns",
    "messages",
    "reports",
    "leads",
    "create-campaign",
    "campaign-detail",
  ],
  main_admin: ["campaigns", "messages", "manage-client"],
};

export const canAccessPage = (role, page) =>
  pagesByRole[role]?.includes(page) ?? false;

export const defaultPathByRole = {
  client: "/campaigns",
  org: "/org/campaigns",
  main_admin: "/org/campaigns",
};

export const navItemsByRole = {
  client: ["campaigns", "messages", "reports", "leads"],
  org: ["campaigns", "messages", "reports", "leads"],
  main_admin: ["campaigns", "messages", "manage-client"],
};
