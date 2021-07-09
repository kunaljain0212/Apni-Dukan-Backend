up:
	docker-compose -f docker-compose.yaml up -d
start:
	docker-compose -f docker-compose.yaml start
down:
	docker-compose -f docker-compose.yaml down
# restart:
# 	docker-compose -f docker-compose.yaml stop
#     docker-compose -f docker-compose.yaml up -d
# logs:
#     docker-compose -f docker-compose.yaml logs --tail=100 -f
# ps:
#     docker-compose -f docker-compose.yaml ps