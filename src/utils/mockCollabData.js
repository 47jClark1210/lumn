// Utility to generate random users, teams, and okrs for Collaboration.jsx
import { getRandomInt, titles, owners, teams as baseTeams } from './helpers.js';

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

export function generateMockUsers(n = 6) {
  return Array.from({ length: n }).map((_, i) => {
    const owner = owners[getRandomInt(0, owners.length - 1)];
    return {
      id: `u${i + 1}`,
      name: owner.name,
      avatar: owner.avatar,
      type: 'user',
      route: `/user/u${i + 1}`,
      label: owner.name,
      email: randomEmail(owner.name),
      phone: randomPhone(),
      team: baseTeams[getRandomInt(0, baseTeams.length - 1)].name,
    };
  });
}

export function generateMockTeams(n = 3, userList = []) {
  return Array.from({ length: n }).map((_, i) => {
    const t = baseTeams[i % baseTeams.length];
    // Pick random users as leads/collaborators
    const shuffled = [...userList].sort(() => 0.5 - Math.random());
    return {
      id: `t${i + 1}`,
      name: t.name,
      type: 'team',
      route: `/team/t${i + 1}`,
      label: t.name,
      leads: shuffled.slice(0, 2).map((u) => u.name),
      collaborators: shuffled.slice(2, 4).map((u) => u.name),
      avatar: null, // Placeholder for icon
      okrs: generateMockOKRs(getRandomInt(1, 3)),
    };
  });
}

export function generateMockOKRs(n = 2) {
  return Array.from({ length: n }).map((_, _i) => {
    return {
      title: titles[getRandomInt(0, titles.length - 1)],
      status: getRandomInt(0, 1) ? 'Active' : 'Completed',
      progress: getRandomInt(30, 100),
    };
  });
}

export function getRandomFeaturedUser(users) {
  const u = users[getRandomInt(0, users.length - 1)];
  return {
    type: 'user',
    data: u,
    okrs: generateMockOKRs(getRandomInt(1, 3)),
  };
}
