const {app,BrowserWindow,Menu,ipcMain,ipcRenderer,screen}=require('electron');
const express=require('express')
const path=require('path');
const fs=require('fs');
app.on('ready',()=>{
	let screenWidth=require('electron').screen.getPrimaryDisplay().workAreaSize.width;
	let screenHeight=require('electron').screen.getPrimaryDisplay().workAreaSize.height;
	let server=express();
	server.get('*',(req,res)=>{
		let page=fs.readFileSync(path.resolve(__dirname, './start.html'), 'utf-8')
	});
	server.listen(8080);
	Menu.setApplicationMenu(null);
	let menuWindow=new BrowserWindow({
		x:0,
		y:0,
		width:screenWidth,
		height:parseInt((screenHeight-768)/2),
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
	
	ipcMain.on('closeWindow',function(){
		openingWindow.close();
		menuWindow.close();
	});
	ipcMain.on('minWindow',function(){
		openingWindow.minimize();
	});
	ipcMain.on('maxWindow',function(){
		if(openingWindow.isMaximized()){
			openingWindow.unmaximize();
		}
		else{
			openingWindow.maximize();
		}
	});
	let aboutWindow;
	ipcMain.on('about',function(){
		aboutWindow=new BrowserWindow({
			width:600,
			height:400,
			movable:true,
			resizeable:true,
			frame:false,
			// transparent:true,
			webPreferences:{
				nodeIntegration:true
			}
		});
		aboutWindow.loadURL(path.join('file://',__dirname,'./about.html'));
		aboutWindow.on('close',()=>{
			aboutWindow=null;
		});
	});
	ipcMain.on('closeAboutWindow',function(){
		aboutWindow.close();
	});
	ipcMain.on('editMode',function(){
		let editWindow=new BrowserWindow({
			width:1024,
			height:768,
			movable:true,
			resizeable:true,
			transparent:true
		});
		openingWindow.close();
		editWindow.loadURL(path.join('file://',__dirname,'./editingMode.html'));
		editWindow.on('close',()=>{
			editWindow=null;
		});
	});
	ipcMain.on('changeMode',function(){
		let changeWindow=new BrowserWindow({
			width:1024,
			height:768,
			movable:true,
			resizeable:true,
			transparent:true
		});
		editWindow.loadURL(path.join('file://',__dirname,'./changingMode.html'));
		openingWindow.close();
		changeWindow.on('close',()=>{
			changeWindow=null;
		});
	});
	openingWindow.on('close',function(){
		openingWindow=null
	});

});