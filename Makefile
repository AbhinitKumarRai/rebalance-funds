rebalance-funds:
	cd docker && docker compose -f rebalance_funds.docker-compose.yml up --build --force-recreate -d	

kill:
	./shell-scripts/docker_kill.sh	