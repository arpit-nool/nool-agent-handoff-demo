const validPriorities = new Set(["High", "Medium", "Low"]);

export function parseFilterState(search = "") {
  const params = new URLSearchParams(search);
  const priority = params.get("priority") ?? "";

  return {
    search: params.get("search") ?? "",
    priority: validPriorities.has(priority) ? priority : ""
  };
}

export function buildFilterSearch({ search = "", priority = "" } = {}) {
  const params = new URLSearchParams();
  const trimmedSearch = search.trim();

  if (trimmedSearch) params.set("search", trimmedSearch);
  if (validPriorities.has(priority)) params.set("priority", priority);

  const query = params.toString();
  return query ? `?${query}` : "";
}
