import PieSocket from "piesocket-js";

const handleSubscribe = () => {
    var pieSocket = new PieSocket.default({
        clusterId: "free.blr2",
        apiKey: '2ZilnOus6sDs7od7bbVYQgx8LlgAfabf7yGLJlUt',
        notifySelf: true,
        presence: true,
        userId: playerName
    });
    pieSocket.subscribe("chat-room").then(ch => {
        channel = ch;

        channel.listen("system:member_joined", function (data) {
            if (data.member.user == playerName) {
                data.member.user = "You";
            }
            else {
                setOpponentName(data.member.user)
            }
        });
    });
};
