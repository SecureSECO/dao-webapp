@echo off
npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" "npx http-server storybook-static --port 6006" "npx wait-on tcp:6006 && npm run test-storybook -- --url http://127.0.0.1:6006"
