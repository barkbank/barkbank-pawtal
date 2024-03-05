# Default command. It installs npm packages, if any, runs the code
# formatter, and then runs the unit tests.
.PHONY: default
default: npm-install fmt test

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
	bash scripts/test_only_app_has_process_env.sh

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
	bash scripts/create_local_accounts.sh

# Reset the local dev database with the latest schema and recretes the
# local accounts.
.PHONY: reset
reset: reset-local-database local-accounts


# Reset the local dev database. This assumes that the barkbank-schema
# repository is a sibling directory of barkbank-pawtal.
.PHONY: reset-local-database
reset-local-database:
	bash scripts/reset-local-database.sh
