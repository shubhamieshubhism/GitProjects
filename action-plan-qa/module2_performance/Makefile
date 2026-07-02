.PHONY: load-test stress-test ddos-test

load-test:
	k6 run scripts/load-test.js

stress-test:
	k6 run scripts/stress-test.js

ddos-test:
	k6 run scripts/ddos-simulation.js

monitoring-up:
	cd monitoring && docker-compose up -d

monitoring-down:
	cd monitoring && docker-compose down

load-test-web:
	k6 run --out web-dashboard scripts/load-test.js

