------------- ENTERACT WEB APP -------------

CONTENTS:
- public, views & node_modules folder
- sql database file
- server.js file code
- package & package-lock.json files
- readme.md file

NPM PACKAGES USED:
- body-parser
- ejs
- express.js
- mysql
- nodemon

HOW TO OPEN THE SERVER
1. Go to your Command Prompt (windows) and/or a terminal window (mac)
2. Navigate using the "cd" command to the server directory or the folder containing the project itself
3. Install server dependencies using "npm install"
4. Use the command "nodemon server.js" (If you get an error, make sure you don't have another server listening on port 3000.)
5. Go to browser and type the URL "localhost:3000"

HOW TO CONNECT TO THE DATABASE
1. Ensure that the server.js file contains the correct credentials to create a connection to the MySQL server
2. Open MySQL Workbench and create/open a connection
3. Click on "Server," then "Data Import"
4. Select "Import from Self-Contained File" and locate the enteractSQL.sql file
5. On the "Default Target Schema" tab, click on "New" and type "enteract" as the schema name
6. Select "Dump Structure and Data"
7. Click on "Start Import"
8. Refresh the Schemas tab to make sure that the "enteract" schema is imported