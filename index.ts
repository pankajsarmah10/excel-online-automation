import {
  encrypt,
  update_credentials_config,
} from "./utils/encrypt_credentails";

const config_file_path = "config/config.json";
const email = encrypt("<Microsoft Email>");
const password = encrypt("<Microsoft Password>");
update_credentials_config(config_file_path, "email", email);
update_credentials_config(config_file_path, "password", password);
