module.exports = function(io){
    let userNames = []
    io.sockets.on("connection", function(socket){
        console.log("Have a new user connected !!!");
        // listen addUser event
        socket.on("addUser", function(userName){
            socket.userName = userName;
            userNames.push(userName);
            // message to myself
            let data_self = {
                sender: "SERVER",
                message: "You have joined this conversation [" + new Date().toLocaleString("vi-VN") + "]."
            }
            socket.emit("update", data_self);

            // message to other
            let data_other = {
                sender: "SERVER",
                message: userName + " have joined this conversation."
            }
            socket.broadcast.emit("update", data_other);
        })

        // listen messsage send ...
        socket.on("sendMsg", function(message){
            // message to myself
            let data_self = {
                sender: "You",
                message: message + " [" + new Date().toLocaleString("vi-VN") + "]."
            }
            socket.emit("update", data_self);

            // message to other
            let data_other = {
                sender: socket.userName,
                message: message
            }
            socket.broadcast.emit("update", data_other);
        })

        // listen left chat
        socket.on("disconnect", function(){
            for(let i = 0; i < userNames.length; i++){
                if(userNames[i] === socket.userName){
                    userNames.splice(i, 1);
                    break;
                }
            }
            
            let data = {
                sender: "SERVER",
                message: socket.userName +  " left this conversation [ " + new Date().toLocaleString("vi-VN") + "]."
            }

            socket.broadcast.emit("update", data);
        })
    })
}