#!/bin/bash
# file: patch.sh

replace() {
    # Explicitly specify file ending on Mac OSX.
    # @see https://myshittycode.com/2014/07/24/os-x-sed-extra-characters-at-the-end-of-l-command-error/
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i "" "s/$1/$2/g" "$3"
    else
      sed -i "s/$1/$2/g" "$3"
    fi
}

# ==========================
# Remove typeorm warnings:
# ==========================
replace 'this.sqlite = require("react-native-sqlite-storage");' '' 'node_modules/typeorm/browser/driver/react-native/ReactNativeDriver.js'
replace 'case "aurora-data-api-pg":' '' 'node_modules/typeorm/browser/driver/DriverFactory.js'
replace 'return new AuroraDataApiPostgresDriver(connection);' '' 'node_modules/typeorm/browser/driver/DriverFactory.js'
