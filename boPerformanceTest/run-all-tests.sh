#!/bin/bash

# Script to run all K6 tests except transactions-performance.js
# ./run-all-tests.sh

# Created: 2025-09-12

echo "Starting all K6 performance tests..."
echo "-----------------------------------"

# Run last month test
echo "Running Last Month test..."
cd "$(dirname "$0")"
npm run test:perf:k6:lastmonth
echo "Last Month test completed."
echo ""

# Run last week with transaction test
echo "Running Last Week with Transaction test..."
npm run test:perf:k6:lastweek-transaction
echo "Last Week with Transaction test completed."
echo ""

# Run last month with round test
echo "Running Last Month with Round test..."
npm run test:perf:k6:lastmonth-round
echo "Last Month with Round test completed."
echo ""

# Run yesterday with user test
echo "Running Yesterday with User test..."
npm run test:perf:k6:yesterday-user
echo "Yesterday with User test completed."
echo ""

# Run yesterday test
echo "Running Yesterday test..."
npm run test:perf:k6:yesterday
echo "Yesterday test completed."
echo ""

# Run last week test
echo "Running Last Week test..."
npm run test:perf:k6:lastweek
echo "Last Week test completed."
echo ""

echo "-----------------------------------"
echo "All tests completed!"
