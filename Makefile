.PHONY: rebalance-funds kill

rebalance-funds:
	docker build -t rebalance-funds .
	docker run -p 8080:8080 --env-file .env rebalance-funds

kill:
	docker stop $$(docker ps -q --filter ancestor=rebalance-funds) 2>/dev/null || true
	docker rm $$(docker ps -aq --filter ancestor=rebalance-funds) 2>/dev/null || true
	docker rmi rebalance-funds 2>/dev/null || true 