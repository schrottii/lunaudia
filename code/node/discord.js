const RPC = require('discord-rpc');

const discordClientID = '1495481180722561148';
const discordClient = new RPC.Client({ transport: 'ipc' });

function discordClientConnect() {
    discordClient.login({ clientId: discordClientID }).catch(err => {
        console.error('Discord failed', err);
    });
}

function updateDiscordPresence(songName, artist) {
    if (artist == undefined || artist == "") artist = "(Unknown artist)";
    //console.log(songName, artist);

    if (!discordClient || !discordClient.user) {
        console.log("Discord not ready");
        return "discord not ready";
    }

    discordClient.setActivity({
        details: `Listening to ${songName}`,
        state: `by ${artist}`,
        //startTimestamp: new Date(),
        largeImageKey: 'logo_key',
        largeImageText: 'Lunaudia',
        instance: false
    }).catch(err => console.error("Update failed:", err));

    return "" + songName + " - " + artist;
}

discordClient.on('ready', () => {
    setTimeout(() => {
        discordClient.setActivity({
            details: 'Listening to music',
            state: 'Idle',
            largeImageKey: 'logo_key',
            largeImageText: 'Lunaudia',
            instance: false
        });
    }, 1000);
});

module.exports = {
    discordClientConnect,
    updateDiscordPresence
};