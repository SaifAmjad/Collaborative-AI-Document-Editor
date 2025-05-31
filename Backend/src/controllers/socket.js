const Document = require("../models/Document");
const { findAndCreateDocument } = require("./document");

const socketConnection = (Server, httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("get-document", async(documentId) => {
      const document = await findAndCreateDocument(documentId);
      
      socket.join(documentId);
      
      socket.emit("load-document", document.data);

      socket.on("send-changes", (delta) => {
       
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });

      socket.on("save-changes",async(data)=>{
           await Document.findByIdAndUpdate(documentId,{data})
      });

    });

    console.log("Connected");
  });

  io.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

module.exports = socketConnection;
