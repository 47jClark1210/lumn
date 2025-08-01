// Sample data arrays
export const titles = [
  'Improve User Engagement',
  'Increase Revenue',
  'Enhance Security',
  'Boost Performance',
  'Expand Market Share',
  'Reduce Churn',
  'Launch New Feature',
  'Optimize Workflow',
  'Increase Retention',
  'Enhance Collaboration',
];

export const teams = [
  { name: 'Product Development', icon: null, color: 'magenta' },
  { name: 'Engineering', icon: null, color: 'volcano' },
  { name: 'Marketing', icon: null, color: 'orange' },
  { name: 'Sales', icon: null, color: 'gold' },
  { name: 'Customer Success', icon: null, color: 'lime' },
  { name: 'Design', icon: null, color: 'green' },
  { name: 'QA', icon: null, color: 'cyan' },
  { name: 'IT Support', icon: null, color: 'blue' },
  { name: 'HR', icon: null, color: 'geekblue' },
  { name: 'Finance', icon: null, color: 'purple' },
];

export const owners = [
  {
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    team: 'Product Development',
  },
  {
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    team: 'Engineering',
  },
  {
    name: 'Alice Lee',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    team: 'Marketing',
  },
  {
    name: 'Bob Brown',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    team: 'Sales',
  },
  {
    name: 'Carlos Rivera',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    team: 'Customer Success',
  },
  {
    name: 'Emily Zhang',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    team: 'Design',
  },
  {
    name: 'Fatima Alvi',
    avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
    team: 'QA',
  },
  {
    name: 'George Kim',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    team: 'IT Support',
  },
  {
    name: 'Hannah Patel',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    team: 'HR',
  },
  {
    name: 'Ivan Petrov',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    team: 'Finance',
  },
];

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateKeyResults() {
  const num = getRandomInt(2, 4);
  return Array.from({ length: num }).map((_, idx) => ({
    text: `Key Result ${idx + 1}`,
    percent: getRandomInt(40, 100),
    success: getRandomInt(20, 80),
  }));
}

export function generateObjective(idx) {
  const owner = owners[getRandomInt(0, owners.length - 1)];
  // Always use the owner's team string to find the team object
  const team = findTeamByName(teams, owner.team);
  return {
    title: titles[idx % titles.length],
    owner,
    team,
    dateCreated: `2025-07-${getRandomInt(1, 15).toString().padStart(2, '0')}`,
    objectivePercent: getRandomInt(50, 100),
    objectiveSuccess: getRandomInt(20, 80),
    keyResults: generateKeyResults(),
  };
}

export function getProgressGradient(success, percent) {
  const green = Math.round(success);
  const blue = Math.round(percent - success);
  const gray = 100 - green - blue;
  const greenColor = '#b7eb8f';
  const blueColor = '#91d5ff';
  const grayColor = '#f5f5f5';
  let stops = [];
  if (green > 0) stops.push(`${greenColor} 0%`, `${greenColor} ${green}%`);
  if (blue > 0)
    stops.push(`${blueColor} ${green}%`, `${blueColor} ${green + blue}%`);
  if (gray > 0)
    stops.push(`${grayColor} ${green + blue}%`, `${grayColor} 100%`);
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

// Find a team object by name from the teams array
export function findTeamByName(teams, teamName) {
  return teams.find((t) => t.name === teamName);
}

// Find an owner object by name from the owners array
export function findOwnerByName(owners, ownerName) {
  return owners.find((o) => o.name === ownerName);
}
