.PHONY: default
default: fmt test

.PHONY:fmt
fmt:
	npm run fmt

.PHONY: test
test:
	npm run test
