import { buildFilterSearch, parseFilterState } from "./filter-state.js";

const searchInput = document.querySelector("#search");
const priorityInput = document.querySelector("#priority");
const list = document.querySelector("#ticket-list");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const replayHandoff = document.querySelector("#replay-handoff");
const handoffStatus = document.querySelector("#handoff-status");
const handoffSteps = [...document.querySelectorAll(".handoff-step")];
const agentBPrompt = document.querySelector("#agent-b-prompt");
const continueAgentB = document.querySelector("#continue-agent-b");

const priorityClass = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low"
};

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function renderTickets(tickets) {
  list.innerHTML = tickets.map((ticket) => `
    <article class="ticket-card">
      <div class="ticket-icon" aria-hidden="true">${escapeHtml(ticket.id.slice(-2))}</div>
      <div class="ticket-main">
        <div class="ticket-title-row">
          <h3>${escapeHtml(ticket.title)}</h3>
          <span class="priority ${priorityClass[ticket.priority]}">${escapeHtml(ticket.priority)}</span>
        </div>
        <p><span>${escapeHtml(ticket.id)}</span><span class="divider">•</span>Owned by ${escapeHtml(ticket.owner)}</p>
      </div>
      <span class="ticket-arrow" aria-hidden="true">→</span>
    </article>
  `).join("");

  totalCount.textContent = String(tickets.length);
  emptyState.hidden = tickets.length > 0;
  list.hidden = tickets.length === 0;
}

const handoffMessages = [
  "Agent A is building the first part: the priority filter.",
  "Agent A has handed off the first part so Agent B can continue.",
  "Nool remembered what changed and what is left to do.",
  "Agent B is continuing with clear instructions.",
  "Everything works: the feature is ready to release."
];

function setHandoffStep(current) {
  handoffSteps.forEach((step, index) => {
    step.classList.toggle("is-complete", index < current);
    step.classList.toggle("is-active", index === current);
  });
  handoffStatus.textContent = handoffMessages[current];
}

function replayHandoffTimeline() {
  replayHandoff.disabled = true;
  continueAgentB.hidden = true;
  agentBPrompt.hidden = true;
  let current = 0;
  const advance = () => {
    setHandoffStep(current);
    if (current === 1) {
      agentBPrompt.hidden = false;
      continueAgentB.hidden = false;
      continueAgentB.focus();
      return;
    }
    current += 1;
    window.setTimeout(advance, 850);
  };
  advance();
}

replayHandoff.addEventListener("click", replayHandoffTimeline);
continueAgentB.addEventListener("click", () => {
  continueAgentB.hidden = true;
  let current = 2;
  const advance = () => {
    setHandoffStep(current);
    if (current === handoffSteps.length - 1) {
      handoffSteps[current].classList.add("is-complete");
      handoffSteps[current].classList.remove("is-active");
      replayHandoff.disabled = false;
      return;
    }
    current += 1;
    window.setTimeout(advance, 850);
  };
  advance();
});

async function loadTickets() {
  const filters = {
    search: searchInput.value,
    priority: priorityInput.value
  };
  const query = buildFilterSearch(filters);
  history.replaceState(null, "", `${location.pathname}${query}`);

  const response = await fetch(`/api/tickets${query}`);
  const data = await response.json();
  renderTickets(data.tickets);
}

let timer;
searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(loadTickets, 120);
});

priorityInput.addEventListener("change", loadTickets);

const initialFilters = parseFilterState(location.search);
searchInput.value = initialFilters.search;
priorityInput.value = initialFilters.priority;
loadTickets();
