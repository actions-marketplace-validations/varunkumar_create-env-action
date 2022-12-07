# Create env file action

[![.github/workflows/test.yml](../../actions/workflows/test.yml/badge.svg)](../../actions/workflows/test.yml)

This action creates .env by taking environment keys from GitHub secrets

## Inputs

- `env` [**Required**] The environment keys.
- `file` The file name
- `path` The file root path

## Outputs

- `parsed` Object version of env file
- `location` Location of env file
- `sanitized` Sanitized version of env file
- `success` True or False

## Example usage

```yaml
uses: varunkumar/create-env-action@v1
with:
  env: |
    FOO=bar
    BAR=baz
    TEST="#abc" # quotes are mandatory for values with special characters
    USER_NAME="${{ secrets.USER_NAME }}" # define the secret in GitHub
```
