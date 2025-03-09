# Excel Online Automation

Automating Excel Online with Playwright and TypeScript: Verifying that the date returned by Excel’s TODAY function matches the current date.

## Installation

Use npm to install the contents of package.json

```bash
git clone <clone url>
cd excel-online-automation
npm install
```

## Usage

To execute tests related to Today function validation.

```bash
npm run playwright-run
```

To execute tests all tests

```bash
npm run playwright-run-all
```

## Run with your own credentials

The credentials are stored in `config/config.json` file in encrypted format. To use your own credentials for the tests follow steps below:

1. Install ts-node, typescript and @types/node globally

```bash
npm install -g ts-node typescript '@types/node'
```

2. Update the your email in `<Microsoft Email>` and your password in `<Microsoft Password>` in the `index.ts` file in the root of the project.

```typescript
import {
  encrypt,
  update_credentials_config,
} from "./utils/encrypt_credentails";

const config_file_path = "config/config.json";
const email = encrypt("<Microsoft Email>");
const password = encrypt("<Microsoft Password>");
update_credentials_config(config_file_path, "email", email);
update_credentials_config(config_file_path, "password", password);
```

3. Execute `index.ts` to update your credentials in the `config/config.json` file in encrypted format.

```bash
npm run encrypt-credentials
```

NOTE: Credentials are encrypted using the crypto-js package with a SALT value. The project includes a default SALT value, which can be modified in the scripts section of package.json.
