const electron = require('electron')
const app = electron.app

const exec = require('child_process').exec;

app.on('ready', () => {
    electron.powerMonitor.on('suspend', () => {
        console.log('suspend') // スリープ時
    })
    electron.powerMonitor.on('resume', () => {
        console.log('resume') // スリープからの復帰
        var command = 'osascript -e "set volume with output muted"';

        exec(command, (error, stdout, stderr) => {
            console.log(stdout);
            if(error){
                console.error(error);
            }else{
                console.log("muted");
            }
        });
    })
})