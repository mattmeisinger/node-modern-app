
# Set of commands to test the REST endpoints.
# TODO: Make these tests idempotent so they can be run and rerun (currently 
# the id to update and delete is hard-coded). Also, compare output to expected output.

# Agent tests
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"firstName": "Matt", "lastName": "test", "email": "test@test.com", "phone": "test"}' http://localhost:1337/api/agent
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X PUT -d '{"firstName": "Matt1000", "lastName": "test", "email": "test@test.com", "phone": "test"}' http://localhost:1337/api/agent/1
curl -i -H "Accept: application/json" -X DELETE http://localhost:1337/api/agent/3
