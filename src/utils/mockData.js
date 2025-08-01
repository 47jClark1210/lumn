// Centralized mock data for the entire app

import { getRandomInt, titles, owners, teams as baseTeams } from './helpers.js';

// --- Utility functions ---
function randomEmail(name) {
  return (
    name.toLowerCase().replace(/ /g, '.') +
    '@' +
    ['email.com', 'company.com', 'lumn.io'][getRandomInt(0, 2)]
  );
}

function randomPhone() {
  return (
    getRandomInt(200, 999) +
    '-' +
    getRandomInt(100, 999) +
    '-' +
    getRandomInt(1000, 9999)
  );
}

// --- Generate users with roles ---
const users = Array.from({ length: 6 }).map((_, i) => {
  const owner = owners[i % owners.length];
  return {
    id: `u${i + 1}`,
    name: owner.name,
    avatar: owner.avatar,
    type: 'user',
    route: `/user/u${i + 1}`,
    label: owner.name,
    email: randomEmail(owner.name),
    phone: randomPhone(),
    team: baseTeams[i % baseTeams.length].name,
    role: i === 0 ? 'admin' : 'user', // First user is admin for demo
    assignedModules: i === 0 ? ['mod1', 'mod2'] : [], // Only admin has modules assigned
  };
});

// --- Generate teams ---
const teams = Array.from({ length: 5 }).map((_, i) => {
  const t = baseTeams[i % baseTeams.length];
  // Pick random users as leads/collaborators
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  return {
    id: `t${i + 1}`,
    name: t.name,
    type: 'team',
    route: `/team/t${i + 1}`,
    label: t.name,
    leads: shuffled.slice(0, 2).map((u) => u.name),
    collaborators: shuffled.slice(2, 4).map((u) => u.name),
    avatar: null, // Placeholder for icon
    okrs: [], // Will link OKRs below
    color: t.color,
  };
});

// --- Generate OKRs and link to users/teams ---
const okrs = Array.from({ length: 5 }).map((_, i) => {
  const owner = users[i % users.length];
  const team = teams[i % teams.length];
  return {
    id: `okr${i + 1}`,
    objective: titles[i % titles.length],
    department: team.name,
    owner: owner.name,
    ownerId: owner.id,
    teamId: team.id,
    status: getRandomInt(0, 1) ? 'Active' : 'Completed',
    progress: getRandomInt(30, 100),
    keyResults: [
      {
        text: `Key Result 1 for ${titles[i % titles.length]}`,
        percent: getRandomInt(40, 100),
        success: getRandomInt(20, 80),
      },
      {
        text: `Key Result 2 for ${titles[i % titles.length]}`,
        percent: getRandomInt(40, 100),
        success: getRandomInt(20, 80),
      },
    ],
  };
});
// Link OKRs to teams
teams.forEach((team) => {
  team.okrs = okrs.filter((okr) => okr.teamId === team.id).map((okr) => okr.id);
});

// --- Static modules and reports ---
const modules = [
  {
    id: 'mod1',
    name: 'React Basics',
    category: 'Frontend',
    instructor: users[2].name,
  },
  {
    id: 'mod2',
    name: 'Advanced Node.js',
    category: 'Backend',
    instructor: users[0].name,
  },
];

const reportTemplates = [
  {
    title: 'Q1 Financial Report',
    status: 'Open',
    updates: [],
    feedback: [],
  },
  {
    title: 'User Engagement Report',
    status: 'In Progress',
    updates: [],
    feedback: [],
  },
  {
    title: 'Product Launch Report',
    status: 'Closed',
    updates: [],
    feedback: [],
  },
  {
    title: 'Sales Performance Report',
    status: 'In Progress',
    updates: [],
    feedback: [],
  },
  {
    title: 'Customer Satisfaction Report',
    status: 'Open',
    updates: [],
    feedback: [],
  },
];

const reports = reportTemplates.map((tpl, i) => {
  const owner = users[i % users.length];
  const team = teams[i % teams.length];
  return {
    id: `rep${i + 1}`,
    title: tpl.title,
    status: tpl.status,
    owner: { name: owner.name, avatar: owner.avatar },
    team: { name: team.name, color: team.color, icon: team.icon || '' },
    updates: tpl.updates,
    feedback: tpl.feedback,
  };
});

// --- Centralized export ---
export const mockData = {
  users,
  teams,
  okrs,
  modules,
  reports,
};

// --- Utility for featured user (for demo widgets, etc.) ---
export function getRandomFeaturedUser() {
  const u = users[getRandomInt(0, users.length - 1)];
  return {
    type: 'user',
    data: u,
    okrs: okrs.filter((okr) => okr.ownerId === u.id),
  };
}
