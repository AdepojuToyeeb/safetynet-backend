 # SAFETYNET V2 API

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
What things you need to install the software.

* Git
* Node
* npm/yarn
* postgres

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Migrations
```bash
# create migration - create an empty migration file
$ yarn migration:create src/migrations/<migration_name>

# generate migration - create a migration that reflect changes made in the entities
$ yarn migration:generate src/migrations/<migration_name>

# run migration - execute all pending migrations
$ yarn migration:run

# revert migration - undo the most recent migration
$ yarn migration:revert

# reset migration - recreat the current db schema by dropping and creating the schema 
$ yarn migration:reset

# drop migration - delete the database schema completely
$ yarn migration:drop

# sync migration - synchronize the db schema
$ yarn migration:sync

# show migration - show all migrations
$ yarn migration:show