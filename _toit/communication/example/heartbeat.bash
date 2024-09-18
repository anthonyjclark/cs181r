#!/usr/bin/env bash

for i in $(seq 1 10); do echo "$i" && sleep 0.9; done | wscat --connect ws://172.28.125.50:55270

# fish
# for i in (seq 1 10); echo "$i"; and sleep 0.9; end | wscat --connect ws://172.28.125.50:55270
