const electron = require('electron')
// const app = electron.app
const {app, Menu, Tray} = require('electron')

const storage = require('electron-json-storage');

const exec = require('child_process').exec;


let state_on_off = false;
let template;
app.on('ready', () => {
    var appIcon = new Tray(__dirname + '/icon16.png');

    template = [{label: 'When the PC suspended'},
        {
            label: '  volume OFF', type: 'radio', click: function () {
                state_on_off = true;
                storage.set('config', {"state_on_off": true}, function (error) {
                    if (error) throw error;
                })
            }
        },
        {
            label: '  volume ON', type: 'radio', click: function () {
                state_on_off = false;
                storage.set('config', {"state_on_off": false}, function (error) {
                    if (error) throw error;
                })
            }
        },
        {
            label: 'exit', accelerator: 'Command+Q', click: function () {
                app.quit();
            }
        }];

    if (state_on_off) {
        template[1]["checked"] = false;
        template[2]["checked"] = true;
    } else {
        template[1]["checked"] = true;
        template[2]["checked"] = false;
    }
    var contextMenu = Menu.buildFromTemplate(template);
    appIcon.setContextMenu(contextMenu);
    appIcon.setToolTip('Select the volume check.');

    storage.get('config', function (error, data) {
        if (error) throw error;

        if (data.state_on_off !== undefined) {
            state_on_off = data.state_on_off;
            console.log(state_on_off);
            if (!state_on_off) {
                template[1]["checked"] = false;
                template[2]["checked"] = true;
            } else {
                template[1]["checked"] = true;
                template[2]["checked"] = false;
            }
            var contextMenu = Menu.buildFromTemplate(template);
            appIcon.setContextMenu(contextMenu);
            appIcon.setToolTip('Select the volume check.');
        } else {
            template[1]["checked"] = true;
            template[2]["checked"] = false;
            var contextMenu = Menu.buildFromTemplate(template);
            appIcon.setContextMenu(contextMenu);
            appIcon.setToolTip('Select the volume check.');

            storage.set('config', {"state_on_off": true}, function (error) {
                if (error) throw error;
            });
        }
    });


    electron.powerMonitor.on('suspend', () => {
        console.log('suspend') // スリープ時
    })
    electron.powerMonitor.on('resume', () => {
        console.log('resume') // スリープからの復帰
        if (state_on_off) {
            var command = 'osascript -e "set volume with output muted"';
            exec(command, (error, stdout, stderr) => {
                console.log(stdout);
                if (error) {
                    console.error(error);
                } else {
                    console.log("muted");
                }
            });
        }
    })
})