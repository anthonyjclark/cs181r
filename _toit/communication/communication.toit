import http
import net

class CommunicationState:
  static CLOSED ::= 1
  static OPENING ::= 2
  static OPEN ::= 3
  static CLOSING ::= 4

interface Communicator:
  // Object enable/disable interface
  static ENABLED ::= 1
  static DISABLED ::= 2
  is-enabled -> bool
  disable -> none
  enable -> none

  // Communication interface
  on-open -> none
  on-close -> none
  on-message message/ByteArray -> none
  // onreconnect
  // onerror

class WsCommunication:
  connection-state := CommunicationState.CLOSED
  heart-did-beat := false

  constructor communicator/Communicator:
    task:: start-server communicator
    task:: check-heartbeat communicator

  start-server communicator/Communicator:
    network := net.open
    server-socket := network.tcp-listen 0
    port := server-socket.local-address.port

    print "Listening on ws://$network.address:$port/"

    server := http.Server

    server.listen server-socket :: | request/http.RequestIncoming writer/http.ResponseWriter |
      print "Connection initiated."
      connection-state = CommunicationState.OPENING

      // Patch for Firefox
      if (request.headers.single "Connection") == "keep-alive, Upgrade":
        request.headers.set "Connection" "Upgrade"

      if request.path == "/":
        web-socket := server.web-socket request writer

        if web-socket:
          print "  Websocket created."
          connection-state = CommunicationState.OPEN
          heart-did-beat = true
          communicator.on-open

          while data := web-socket.receive:
            heart-did-beat = true
            communicator.on-message data

        print "  Websocket connection closed."
        connection-state = CommunicationState.CLOSING
        communicator.on-close

  check-heartbeat communicator/Communicator:

    while true:

      if connection-state == CommunicationState.CLOSING:
        connection-state = CommunicationState.CLOSED
        communicator.disable

      else if communicator.is-enabled and (not heart-did-beat):
        communicator.disable

      else if (not communicator.is-enabled) and heart-did-beat:
        communicator.enable

      heart-did-beat = false

      sleep --ms=1000
