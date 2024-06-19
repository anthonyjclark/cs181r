#!/usr/bin/env bash

if ! command -v node &> /dev/null
then
    echo "Node is not installed"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm is not installed"
    exit
fi

# If not 3 or 4 arguments
if [ "$#" -ne 3 ] && [ "$#" -ne 4 ]; then
    echo "Usage: new-interactive.sh PACKAGE_NAME AUTHOR_NAME DESCRIPTION [--with-quokka]"
    exit 1
fi

is_upper() { if [[ ${1:-} == [[:upper:]] ]]; then return 0; else return 1; fi }
is_lower() { if [[ ${1:-} == [[:lower:]] ]]; then return 0; else return 1; fi }

to_kebab() {
  arg=( "${@:-}" )
  helper=""
  for (( i=0; i<${#arg}; i++ )); do

    if [[ $i == 0 ]]; then
      helper="${arg:$i:1}"

    elif is_upper "${arg:$i:1}" && (is_lower "${arg:((i+1)):1}" || is_lower "${arg:((i-1)):1}"); then
      helper="${helper} ${arg:$i:1}"

    else
      helper="${helper}${arg:$i:1}"

    fi
  done
  echo "${helper}"
}

PACKAGE_NAME=$1
AUTHOR_NAME=$2
DESCRIPTION=$3

PACKAGE_NAME_KEBAB=$(to_kebab "${PACKAGE_NAME}" | tr '[:upper:]' '[:lower:]' | tr -s ' ' '-')

echo "Creating a new directory with the following information:"
echo "PACKAGE_NAME       : $PACKAGE_NAME"
echo "AUTHOR_NAME        : $AUTHOR_NAME"
echo "DESCRIPTION        : $DESCRIPTION"
echo "PACKAGE_NAME_KEBAB : $PACKAGE_NAME_KEBAB"


if [[ ! -f "$PACKAGE_NAME" ]]; then
  echo "Directory $PACKAGE_NAME already exists. Exiting."
  exit 1
fi

echo -n "Do you want to continue? (y/n) "
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "OK. Exiting without creating the new package."
  exit 1
fi


cp -r _template "$PACKAGE_NAME"
cd "$PACKAGE_NAME" || exit

sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" README.md && rm README.md.bak
sed -i.bak "s/PLACEHOLDER_DESCRIPTION/$DESCRIPTION/g" README.md && rm README.md.bak

sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME_KEBAB/g" package.json && rm package.json.bak
sed -i.bak "s/PLACEHOLDER_AUTHOR_NAME/$AUTHOR_NAME/g" package.json && rm package.json.bak
sed -i.bak "s/PLACEHOLDER_DESCRIPTION/$DESCRIPTION/g" package.json && rm package.json.bak

sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" vite.config.mjs && rm vite.config.mjs.bak

sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" index.html && rm index.html.bak
sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" src/index.ts && rm src/index.ts.bak
sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" lib/main.ts && rm lib/main.ts.bak

npm install

if [[ $* == *--with-quokka* ]]; then
  npm install canvas
  npm install jsdom
  npm install vite-node
fi
