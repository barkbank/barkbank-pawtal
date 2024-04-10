# Default command. It installs npm packages, if any, runs the code
# formatter, and then runs the unit tests.
.PHONY: default
default: npm-install fmt test schema-diff

# Vars
BARKBANK_SCHEMA_DIR=../barkbank-schema

# Runs the code formatter
.PHONY: fmt
fmt:
	npm run fmt

# Runs unit tests
.PHONY: test
test:
	bash scripts/testdb.sh testDbUp
	npm run test
	bash scripts/testdb.sh testDbDown
	bash scripts/test_minimal_process_env_usage.sh
	bash scripts/test_no_wip_tasks_remaining.sh
	npm run lint

# Run playwright tests. show-report will run automatically if a test
# fails.
.PHONY: test-ui
test-ui: playwright-browsers
	npx playwright test

# Run playwright tests in headed mode, you will see flashes of
# browser screens.
.PHONY: test-ui-headed
test-ui-headed: playwright-browsers
	npx playwright test --headed

# Run playwright interactively
.PHONY: run-playwright
run-playwright: playwright-browsers
	npx playwright test --ui

# Installs playwright browsers
.PHONY: playwright-browsers
playwright-browsers:
	npx playwright install chromium firefox webkit

# Runs the local development server.
.PHONY: run
run:
	npm run dev

# Does npm install
.PHONY: npm-install
npm-install:
	npm install

# Creates test user, vet, and admin accounts in the local dev
# database.
.PHONY: local-accounts
local-accounts:
	npx node scripts/setup-dev-data.js

# Reset the local dev database with the latest schema and recretes the
# local accounts.
.PHONY: reset
reset: reset-local-database local-accounts


# Reset the local dev database. This assumes that the barkbank-schema
# repository is a sibling directory of barkbank-pawtal.
.PHONY: reset-local-database
reset-local-database:
	bash scripts/reset-local-database.sh

# Lists work-in-progress notes. These shouldn't be merged into
# main. Use TODO if they should be worked on in another feature
# branch.
.PHONY: wip
wip:
	grep --color=always -R WIP src tests db

# Lists TODO notes.
.PHONY: todo
todo:
	grep --color=always -R TODO src tests db

# Diff local schema and barkbank-schemas
.PHONY: schema-diff
schema-diff:
	[ ! -d $(BARKBANK_SCHEMA_DIR) ] || diff --color=always db $(BARKBANK_SCHEMA_DIR)/schema

# Sync the schema from barkbank-schema into barkbank-pawtal
.PHONY: schema-recv
schema-recv:
	rsync -avz $(BARKBANK_SCHEMA_DIR)/schema/ db/

# Sync the schema from barkbank-pawtal into barkbank-schema
.PHONY: schema-send
schema-send:
	rsync -avz db/ $(BARKBANK_SCHEMA_DIR)/schema/
