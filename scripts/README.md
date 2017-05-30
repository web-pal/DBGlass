Command for generating test data. Currently it's only one schema -
user_account.

This folder has separated package.json because in future maybe
it may be independent package.

## Create test user and database
CREATE DATABASE dbglass;  
CREATE USER dbglass WITH PASSWORD 'dbglass';  
GRANT ALL PRIVILEGES ON DATABASE "dbglass" to dbglass;  
ALTER USER dbglass WITH SUPERUSER;  


## Example
$ npm start -- default-config
