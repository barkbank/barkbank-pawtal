# Default command. It installs npm packages, if any, runs the code
# formatter, runs the unit tests, and does a schema diff.
.PHONY: default
default: npm-install fmt lint test schema-diff

# Does everything default does AND THEN also run frontend tests—which
# takes awhile to complete. If you just want to run the frontend
# tests, use test-ui.
.PHONY: all
all: default test-ui

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

.PHONY: lint
lint:
	npm run lint

# Run playwright tests. show-report will run automatically if a test
# fails. If you want to use more workers, specify pw_workers like this
# "make pw_workers=4 test-ui".
pw_workers=1
.PHONY: test-ui
test-ui: playwright-browsers
	npx playwright test --workers $(pw_workers) --project "Mobile Chrome" --project "chromium"

# Like test-ui, but also adds --headed to run the tests in headed
# mode, you will see flashes of browser screens.
.PHONY: test-ui-headed
test-ui-headed: playwright-browsers
	npx playwright test --workers $(pw_workers) --project "Mobile Chrome" --project "chromium" --headed

# Run playwright interactively
.PHONY: run-playwright
run-playwright: playwright-browsers
#	npx playwright test --ui --project "Mobile Chrome" --project "chromium"
	npx playwright test --ui --project "Mobile Chrome" --project "chromium" --workers 1
#	npx playwright test --ui --project "chromium" --workers 1

# Installs playwright browsers
.PHONY: playwright-browsers
playwright-browsers:
	npx playwright install chromium firefox webkit

# Shows the latest report. Including that generated by the interactive
# mode test.
.PHONY: playwright-report
playwright-report:
	npx playwright show-report

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
	@echo Remaining wip tasks
	@echo
	@grep -n --color=always -R 'WIP[:]' src tests db e2e || true
	@echo
	@echo Number of tasks remaining
	@grep -n --color=always -R 'WIP[:]' src tests db e2e | wc -l

# Lists TODO notes.
.PHONY: todo
todo:
	@echo Remaining todo tasks
	@echo
	@grep -n --color=always -R 'TODO[:]' src tests db e2e || true
	@echo
	@echo Number of tasks remaining
	@grep -n --color=always -R 'TODO[:]' src tests db e2e | wc -l

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
