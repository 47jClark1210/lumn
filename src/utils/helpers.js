// Sample data arrays
export const titles = [
  'Improve User Engagement',
  'Increase Revenue',
  'Enhance Security',
  'Boost Performance',
  'Expand Market Share',
  'Reduce Churn',
  'Launch New Feature',
];
export const owners = [
  {
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Alice Lee',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Bob Brown',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
];
export const teams = [
  { name: 'Product Development', icon: null }, // Set icon in component if needed
  { name: 'Engineering', icon: null },
  { name: 'Marketing', icon: null },
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
  const team = teams[getRandomInt(0, teams.length - 1)];
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
  if (blue > 0) stops.push(`${blueColor} ${green}%`, `${blueColor} ${green + blue}%`);
  if (gray > 0) stops.push(`${grayColor} ${green + blue}%`, `${grayColor} 100%`);
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}
