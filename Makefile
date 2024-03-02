.PHONY: default
default: npm-install fmt test

.PHONY: fmt
fmt:
	npm run fmt

.PHONY: test
test:
	bash scripts/testdb.sh testDbUp
	npm run test
	bash scripts/testdb.sh testDbDown
	bash scripts/test_only_app_has_process_env.sh

.PHONY: run
run:
	npm run dev

.PHONY: npm-install
npm-install:
	npm install

.PHONY: local-accounts
local-accounts:
	bash scripts/create_local_accounts.sh
