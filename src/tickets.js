export const tickets = Object.freeze([
  { id: "SUP-1042", title: "Checkout fails for saved cards", priority: "High", owner: "Maya" },
  { id: "SUP-1038", title: "Invoice PDF uses old address", priority: "Medium", owner: "Noah" },
  { id: "SUP-1035", title: "Password reset email delayed", priority: "High", owner: "Ishan" },
  { id: "SUP-1029", title: "Export button label is unclear", priority: "Low", owner: "Maya" },
  { id: "SUP-1026", title: "Mobile search loses focus", priority: "Medium", owner: "Noah" },
  { id: "SUP-1019", title: "Welcome email has broken link", priority: "Low", owner: "Ishan" }
]);

export function filterTickets({ search = "", priority = "" } = {}) {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedPriority = priority.trim().toLowerCase();

  return tickets.filter((ticket) => {
    const matchesSearch = !normalizedSearch || `${ticket.id} ${ticket.title} ${ticket.owner}`
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesPriority = !normalizedPriority || ticket.priority.toLowerCase() === normalizedPriority;

    return matchesSearch && matchesPriority;
  });
}
