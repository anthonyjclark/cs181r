import http show ResponseWriter RequestIncoming Server
import net

interface Communicator:

  // Object enable/disable interface
  static ENABLED ::= 1
  static DISABLED ::= 2
  is-enabled -> bool
  disable -> none
  enable -> none

  // Communication interface
  on-start address/string port/string -> none
  on-open -> none
  on-close -> none
  on-message message/ByteArray -> none
  // onreconnect
  // onerror

class WsCommunication:
  static CLOSED ::= 1
  static OPENING ::= 2
  static OPEN ::= 3
  static CLOSING ::= 4

  ip-address := ""
  port := 0

  connection-state := CLOSED
  heart-did-beat := false

  constructor communicator/Communicator --heartbeat-ms/int:
    task:: start-server communicator
    task:: check-heartbeat communicator --heartbeat-ms=heartbeat-ms

  start-server communicator/Communicator:
    network := net.open
    server-socket := network.tcp-listen 0

    ip-address = network.address
    port = server-socket.local-address.port

    print "Listening on ws://$ip-address:$port/"

    communicator.on-start ip-address port

    server := Server

    server.listen server-socket :: | request/RequestIncoming writer/ResponseWriter |
      print "Connection initiated."
      connection-state = OPENING

      // NOTE: Patch for Firefox
      if (request.headers.single "Connection") == "keep-alive, Upgrade":
        request.headers.set "Connection" "Upgrade"

      if request.path == "/":
        web-socket := server.web-socket request writer

        if web-socket:
          print "  Websocket created."
          connection-state = OPEN
          heart-did-beat = true
          communicator.on-open

          while data := web-socket.receive:
            heart-did-beat = true
            communicator.on-message data

        print "  Websocket connection closed."
        connection-state = CLOSING
        communicator.on-close

  check-heartbeat communicator/Communicator --heartbeat-ms/int:

    while true:

      // Client disconnected
      if connection-state == CLOSING:
        connection-state = CLOSED
        communicator.disable

      // Client did not send heartbeat
      else if communicator.is-enabled and (not heart-did-beat):
        communicator.disable

      // Client sent heartbeat but communicator is disabled
      else if (not communicator.is-enabled) and heart-did-beat:
        communicator.enable

      heart-did-beat = false

      sleep --ms=heartbeat-ms
