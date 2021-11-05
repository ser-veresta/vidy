import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://vidy-99.herokuapp.com");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [id, setId] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myRef = useRef();
  const userRef = useRef();
  const connectionRef = useRef();

  console.log(call);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);

      myRef.current.srcObject = currentStream;
    });

    socket.on("me", (id) => setId(id));

    socket.on("call_user", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userRef.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (callerId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("call_user", { userToCall: callerId, SignalData: data, from: id, name });
    });

    peer.on("stream", (currentStream) => {
      userRef.current.srcObject = currentStream;
    });

    socket.on("call_accepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myRef,
        userRef,
        stream,
        name,
        setName,
        callEnded,
        id,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
