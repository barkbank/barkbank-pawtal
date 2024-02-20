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

.PHONY: npm-install
npm-install:
	npm install
