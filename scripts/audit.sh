#!/bin/bash

echo "🔍 Running local audit for the 'lumn' React app..."

echo "1️⃣ Linting with ESLint..."
yarn eslint . --ext .js,.jsx,.ts,.tsx

echo "2️⃣ Checking formatting with Prettier..."
yarn prettier --check .

echo "3️⃣ Running tests with coverage..."
yarn test --coverage

echo "4️⃣ Running Lighthouse audit (requires app running on http://localhost:3000)..."
yarn global add @lhci/cli
lhci autorun || echo "⚠️ Lighthouse CI failed"

echo "5️⃣ Auditing dependencies..."
yarn audit --groups dependencies

echo "6️⃣ Checking for unused dependencies..."
yarn dlx depcheck

echo "7️⃣ Running Stylelint for CSS consistency..."
yarn stylelint '**/*.css'

echo "8️⃣ Building project..."
yarn build

echo "✅ Local audit complete."
