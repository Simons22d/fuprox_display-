const { app,BrowserWindow,ipcMain } = require('electron')
const path=require('path')
const url=require('url')

let win;
let token;


const {globalShortcut } = require('electron')

function createWindows() {
    // fullscreen : true,
    win = new BrowserWindow({
                height:600,
                width: 1000,
                allowRendererProcessReuse : true,
                autoHideMenuBar  : true,
                // fullscreen : true,
                // frame: false,
                // alwaysOnTop : true
    })
    // alwaysOnTop : true,
    // minimizable : false,
    // resizable :false,

    // win.webContents.openDevTools()

    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true,
        webPreferences: {
            nodeIntegration: true
        }
    }))
}

app.on('ready',() =>{
    createWindows()
     globalShortcut.register('CommandOrControl+Y', () => {
        // Do stuff when Y and either Command/Control is pressed.
    })

})

