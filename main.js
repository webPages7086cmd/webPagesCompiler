const {app,BrowserWindow,Menu,ipcMain,ipcRenderer,screen,dialog}=require('electron');
// const express=require('express');
const path=require('path');
const fs=require('fs');
app.on('ready',()=>{
	let opa=false;
	let screenWidth=require('electron').screen.getPrimaryDisplay().workAreaSize.width;
	let screenHeight=require('electron').screen.getPrimaryDisplay().workAreaSize.height;
	// let server=express();
	// server.get('*',(req,res)=>{
	// 	let page=fs.readFileSync(path.resolve(__dirname, './start.html'), 'utf-8')
	// });
	// server.listen(8080);
	Menu.setApplicationMenu(null);
	let goWindow;
	goWindow=new BrowserWindow({
		width:500,
		height:300,
		movable:false,
		resizeable:false,
		frame:false,
		transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	goWindow.loadURL(path.join('file://',__dirname,'./index.html'));
	setTimeout(()=>{
		goWindow.close();
	},6500);
	goWindow.on('close',()=>{
		goWindow=null;
	});
	let menuWindow=new BrowserWindow({
		x:0,
		y:5,
		width:screenWidth,
		height:parseInt((screenHeight-768)/3.2),
		movable:false,
		resizeable:false,
		frame:false,
		transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	menuWindow.loadURL(path.join('file://',__dirname,'./startMenu.html'));
	// menuWindow.maximize();
	// menuWindow.unmaximize();
	let openingWindow=new BrowserWindow({
		width:1024,
		height:768,
		movable:true,
		resizeable:true,
		frame:false,
		transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	// openingWindow.loadURL('http://127.0.0.1');
	openingWindow.loadURL(path.join('file://',__dirname,'./start.html'));
	
	ipcMain.on('closeWindow',()=>{
		openingWindow.close();
		menuWindow.close();
	});
	ipcMain.on('minWindow',()=>{
		openingWindow.minimize();
	});
	ipcMain.on('maxWindow',()=>{
		if(openingWindow.isMaximized()){
			openingWindow.unmaximize();
		}
		else{
			openingWindow.maximize();
		}
	});
	let aboutWindow;
	ipcMain.on('about',()=>{
		// goWindow.close();
		if(opa==false){
			opa=true;
			aboutWindow=new BrowserWindow({
				width:600,
				height:400,
				movable:true,
				resizeable:true,
				frame:false,
				transparent:true,
				webPreferences:{
					nodeIntegration:true
				}
			});
			aboutWindow.loadURL(path.join('file://',__dirname,'./about.html'));
			aboutWindow.on('close',()=>{
				aboutWindow=null;
			});
		}
		else{
			// dialog.showErrorMessage("禁止套娃");
			dialog.showErrorBox("无法打开窗口，因为：","软件已经设置，禁止套娃");
		}
	});
	ipcMain.on('closeAboutWindow',()=>{
		opa=false;
		aboutWindow.close();
	});
	let editWindow;
	ipcMain.on('editMode',()=>{
		// goWindow.close();
		editWindow=new BrowserWindow({
			width:1024,
			height:768,
			movable:true,
			resizeable:true,
			transparent:true,
			frame:false,
			webPreferences:{
				nodeIntegration:true
			}
		});
		editWindow.loadURL(path.join('file://',__dirname,'./editingMode.html'));
		openingWindow.close();
	});
	ipcMain.on('closeEditWindow',()=>{
		editWindow.close();
	});
	ipcMain.on('minEditWindow',()=>{
		editWindow.minimize();
	});
	ipcMain.on('maxEditWindow',()=>{
		if(editWindow.isMaximized()){
			editWindow.unmaximize();
		}
		else{
			editWindow.maximize();
		}
	});
	let changeWindow;
	ipcMain.on('changeMode',()=>{
		menuWindow.loadURL(path.join('file://',__dirname,'./changingModeMenu.html'));
		changeWindow=new BrowserWindow({
			y:500,
			width:1500,
			height:900,
			movable:true,
			resizeable:true,
			transparent:true,
			frame:false,
			webPreferences:{
				nodeIntegration:true
			}
		});
		// goWindow.close();
		changeWindow.loadURL(path.join('file://',__dirname,'./changingMode.html'));
		changeWindow.webContents.openDevTools();
		menuWindow.webContents.openDevTools();
		openingWindow.close();
		changeWindow.on('close',()=>{
			changeWindow=null;
		});
	});
	ipcMain.on('changed',(event,arg)=>{
		console.log("\n转换后："+arg);
		menuWindow.webContents.send('change',arg);
		console.log('send');
	});
	ipcMain.on('closeChangeWindow',()=>{
		changeWindow.close();
	});
	ipcMain.on('minChangeWindow',()=>{
		changeWindow.minimize();
	});
	ipcMain.on('maxChangeWindow',()=>{
		if(changeWindow.isMaximized()){
			changeWindow.unmaximize();
		}
		else{
			changeWindow.maximize();
		}
	});
	ipcMain.on('openFile',(event,arg)=>{
		console.log("文件内容："+arg);
		changeWindow.webContents.send('read',arg);
	});

	openingWindow.on('close',()=>{
		openingWindow=null;
	});
});
