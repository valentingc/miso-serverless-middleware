#!/bin/bash

if [ $# -lt 2 ]; then
  echo "Usage: sh $0 <registry_url> <scope>"
  echo "Example: sh setup/config-npm-credentials.sh https://registry.yourdomain.com @miso"
  exit 1
fi

registry_url="$1"
scope="$2"
script_dir="$(cd "$(dirname "$0")" && pwd)"
root_dir="$(dirname "$script_dir")"

if [ -e "$root_dir/.npmrc" ]; then
  echo "A .npmrc file already exists in the root directory of the project. Skipping script."
  exit 0
fi

if ! echo "$registry_url" | grep -qE '^https?://'; then
  echo "Error: The registry URL must start with 'http://' or 'https://'"
  exit 1
fi

# set config and login
npm config set ${scope}:registry ${registry_url}

echo "Logging in to the registry..."
npm login --registry=${registry_url}
stripped_registry_url=$(echo "$registry_url" | sed 's#^https\?://##')
auth_token=$(sed -n "/\/\/${stripped_registry_url}\/:_authToken=/ s/.*_authToken=\(.*\)/\1/p" "$HOME/.npmrc")

# write to file
echo "${scope}:registry=${registry_url}" > "$root_dir/.npmrc"
echo "//${stripped_registry_url}/:_authToken=${auth_token}" >> "$root_dir/.npmrc"
echo "NPM config setup done!"