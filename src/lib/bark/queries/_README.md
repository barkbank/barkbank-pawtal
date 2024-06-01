# Query Functions

Collectively, query functions provide a data layer for Bark Bank domain entities.

## Note on encryption

Encryption in Bark Bank is done at the domain level.
Therefore, where relevant, query function signatures use encrypted forms of the data models.

## Conventions

- Start function name with the SQL verb: "select", "update", "insert", "delete".
- First argument should be a DbContext.
