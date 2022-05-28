const playerJoinHandle = (io, socket) => {
  const joinRoom = async (payload) => {
    if (payload.room) {
      const player = {
        name: payload.name,
        room: payload.room,
      };
      socket.player = player;
      socket.join(player.room);

      io.to(socket.id).emit("joinRoomRes", {
        result: true,
        msg: "Joined successfully",
      });
      await sendAllPlayersInfoInRoom(player.room);
    } else {
      io.to(socket.id).emit("joinRoomRes", {
        result: false,
        msg: "Joined failed",
      });
    }
  };

  const sendAllPlayersInfoInRoom = async (room) => {
    const clients = await io.in(room).fetchSockets();
    const playersInRoom = clients.map((client) => {
      return { ...client.player, id: client.id };
    });
    console.log(playersInRoom);
    io.to(room).emit("receive__players", playersInRoom);
  };

  socket.on("joinRoom", joinRoom);
};
export default playerJoinHandle;
