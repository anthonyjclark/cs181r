# # Use pty.openpty() to create a virtual serial port pair
# # and then use miniterm to communicate with it.

# import os
# import pty
# import time

# master, slave = pty.openpty()
# s_name = os.ttyname(slave)
# print(s_name)

# for i in range(60):
#     os.write(master, bytes(f"Hello pseudo terminal {i}\n", encoding="utf-8"))
#     time.sleep(1)

#!/usr/bin/python
# Spawn pseudo-tty for input testing.
# Copyright 2010, Canonical, Ltd.
# Author: Kees Cook <kees@ubuntu.com>
# License: GPLv3
# import os
# import select
# import sys

# parent, child = os.openpty()
# tty = os.ttyname(child)
# os.system("stty cs8 -icanon -echo < %s" % (tty))

# print(tty)

# try:
#     os.system("stty cs8 -icanon -echo < /dev/stdin")

#     poller = select.poll()
#     poller.register(parent, select.POLLIN)
#     poller.register(sys.stdin, select.POLLIN)

#     running = True
#     while running:
#         events = poller.poll(1000)
#         for fd, event in events:
#             if (select.POLLIN & event) > 0:
#                 chars = os.read(fd, 512)
#                 if fd == parent:
#                     sys.stdout.write(chars.decode("utf-8"))
#                     sys.stdout.flush()
#                 else:
#                     os.write(parent, chars)
# finally:
#     os.system("stty sane < /dev/stdin")


import os
import pty
import threading

from serial import Serial


def listener(port):
    # continuously listen to commands on the master device
    while 1:
        res = b""
        while not res.endswith(b"\r\n"):
            # keep reading one byte at a time until we have a full line
            res += os.read(port, 1)
        print("command: %s" % res)

        # write back the response
        if res == b"QPGS\r\n":
            os.write(port, b"correct result\r\n")
        else:
            os.write(port, b"I dont understand\r\n")


def test_serial():
    """Start the testing"""
    master, slave = pty.openpty()  # open the pseudoterminal
    s_name = os.ttyname(slave)  # translate the slave fd to a filename

    print(s_name)

    # create a separate thread that listens on the master device for commands
    thread = threading.Thread(target=listener, args=[master])
    thread.start()

    # open a pySerial connection to the slave
    ser = Serial(s_name, 2400, timeout=1)
    ser.write(b"test2\r\n")  # write the first command
    res = b""
    while not res.endswith(b"\r\n"):
        # read the response
        res += ser.read()
    print("result: %s" % res)
    ser.write(b"QPGS\r\n")  # write a second command
    res = b""
    while not res.endswith(b"\r\n"):
        # read the response
        res += ser.read()
    print("result: %s" % res)


if __name__ == "__main__":
    test_serial()
