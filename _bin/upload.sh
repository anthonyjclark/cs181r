#!/usr/bin/env bash

set -e

# TODO: turn into makefile with render target

networksetup -getairportnetwork en0
# ❯ /opt/cisco/secureclient/bin/vpn state

password="$(security find-internet-password -s wells.campus.pomona.edu -w)"
web_host="wells.campus.pomona.edu"

# Mount
mkdir -p _mount
mount -t smbfs "//ajcd2020:$password@$web_host/Computer%20Science/www/classes/cs181r" _mount

# Upload
cpsync _site/ _mount/

# Unmount
until diskutil unmount _mount; do echo "Trying again..."; sleep 2; done
