up:
	docker-compose -f docker-compose.yml up -d
start:
	docker-compose -f docker-compose.yml start
down:
	docker-compose -f docker-compose.yml down
# restart:
# 	docker-compose -f docker-compose.yml stop
#     docker-compose -f docker-compose.yml up -d
# logs:
#     docker-compose -f docker-compose.yml logs --tail=100 -f
# ps:
#     docker-compose -f docker-compose.yml ps
