const {app,BrowserWindow,Menu,ipcMain,ipcRenderer}=require('electron');
const express=require('express')
const path=require('path');
const fs=require('fs');
app.on('ready',()=>{
	let server=express();
	server.get('*',(req,res)=>{
		let page=fs.readFileSync(path.resolve(__dirname, './start.html'), 'utf-8')
	});
	server.listen(8080);
	Menu.setApplicationMenu(null);
	let openingWindow=new BrowserWindow({
		width:1024,
		height:768,
		movable:true,
		resizeable:true,
		frame:false,
		// transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	// openingWindow.loadURL('http://127.0.0.1');
	openingWindow.loadURL(path.join('file://',__dirname,'./start.html'));
	
	ipcMain.on('closeWindow',function(){
		app.quit();
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
	ipcMain.on('editMode',function(){
		let editWindow=new BrowserWindow({
			width:1024,
			height:768,
			movable:true,
			resizeable:true,
			transparent:true
		});
		openingWindow.close();
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
		openingWindow.close();
		changeWindow.on('close',()=>{
			changeWindow=null;
		});
	});

});