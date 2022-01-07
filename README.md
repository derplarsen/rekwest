# Rekwest
Request resources from shared kafka cluster owners

# How to run it 
1. Install node.js & npm
2. Enter cloned repo directory
3. Edit key/secret/bootstrap of your Confluent Cloud cluster in **server.js**
4. run `npm start` (this will install all necessary dependencies)

# How to interface with it - 
Visit this URL to add a new request: http://localhost:3333/index.html

Visit this URL to view existing requests: http://localhost:3333/getRequests.html

# TODO

- Make recommendations
- Create scaffolding templates dynamically based on chosen entries
- Add dynamically visible freeform textarea when "Other" connector option is chosen
- Document REST endpoints
- Please submit ideas/bugs into Issues, at this point I had only spent a few hours on it, pull requests are welcome
