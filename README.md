# Rekwest
Request resources from shared kafka cluster owners and get some guidance and/or templates to start coding with more quickly and with built with best practices in mind.

# Dependencies
- a kafka / redpanda instance running locally (port 19092 by default, runs redpanda in docker with docker-compose included)

# How to run it 
0. (if necessary - run `docker-compose up` to bring up a local redpanda kafka api)
1. Install node.js & npm
2. Enter cloned repo directory
3. Edit key/secret/bootstrap in **server.js** (see below)
4. run `npm start` (this will install all necessary dependencies)

By default it connects to a local instance of kafka/redpanda on port 19092 with no auth. If you want to connect it with SASL_SSL just change the "isLocalKafkaNoAuth" to false and update the login variables above it.

# How to interface with it - 
Visit this URL to add a new request: http://localhost:3333/

Visit this URL to view existing requests: http://localhost:3333/getRequests.html

# TODO

- Make some best practice recommendations based on options chosen
- Create scaffolding templates dynamically based on chosen entries
- Add dynamically visible freeform textarea when "Other" connector option is chosen
- Document REST endpoints
- Store completed requests in a database (Mongo?) for additional integration/reporting
- Please submit ideas/bugs into Issues, at this point I had only spent a few hours on it, pull requests are welcome
