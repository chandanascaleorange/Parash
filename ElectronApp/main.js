const { app, BrowserWindow } = require('electron');
const net = require('net');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {       
      nodeIntegration: true,
      contextIsolation: false,
    },  
  });   

  win.loadFile('client-app/build/index.html');
}   

function isPortOpen(port, callback) {
  const server = net.createServer();
  server.unref();
  server.on('error', () => callback(false));
  server.listen(port, () => {
    server.close(() => callback(true));
  });
}   

app.whenReady().then(() => {
  // Start the backend server
  const backendProcess = spawn('node', ['./Backend/app.js'], {
    stdio: 'inherit',
  });
  
  // Add a delay before checking if the port is open
  setTimeout(() => {
    isPortOpen(7000, (open) => {
      if (open) {
        console.log('Backend is running on port 7000');
      } else {
        console.error('Backend is not running on port 7000');
      }
      createWindow();
    });
  }, 3000); // Wait 3 seconds (adjust as needed)

  // Handle process exit
  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
    app.quit();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, create a window if the app is activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
