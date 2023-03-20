@echo off
          npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" "npm run storybook" "npx wait-on tcp:6006 && npm run test-storybook"
