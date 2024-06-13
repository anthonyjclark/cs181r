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

if [ "$#" -ne 3 ]; then
    echo "Usage: new-interactive.sh PACKAGE_NAME AUTHOR_NAME DESCRIPTION"
    exit 1
fi

PACKAGE_NAME=$1
AUTHOR_NAME=$2
DESCRIPTION=$3

cp -r _template "$PACKAGE_NAME"
cd "$PACKAGE_NAME" || exit

PACKAGE_NAME_LOWERCASE=$(echo "$PACKAGE_NAME" | tr '[:upper:]' '[:lower:]')

sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME_LOWERCASE/g" package.json && rm package.json.bak
sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" README.md && rm README.md.bak
sed -i.bak "s/PLACEHOLDER_PACKAGE_NAME/$PACKAGE_NAME/g" index.html && rm index.html.bak

sed -i.bak "s/PLACEHOLDER_AUTHOR_NAME/$AUTHOR_NAME/g" package.json && rm package.json.bak

sed -i.bak "s/PLACEHOLDER_DESCRIPTION/$DESCRIPTION/g" package.json && rm package.json.bak
sed -i.bak "s/PLACEHOLDER_DESCRIPTION/$DESCRIPTION/g" README.md && rm README.md.bak

npm install
