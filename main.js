const electron=require('electron');
const path=require('path');
const fs=require('fs');
const express=require('express');
const http=require('http');
const https=require('https');
const extend=require('extend');
const request=require('request');
const process=require('process');
const console=require('console');
const qs=require('querystring');
const os=require('os');
const url=require('url');
var expressApplication=express();
const app=electron.app;
const BrowserWindow=electron.BrowserWindow;
const Menu=electron.Menu;
const ipcMain=electron.ipcMain;
const screen=electron.screen;
const dialog=electron.dialog;
const globalShortcut=electron.globalShortcut;
const BrowserView=electron.BrowserView;
// const TouchBar=electron.TouchBar;
// const TouchBarLabel=TouchBar.TouchBarLabel;
// const TouchBarButton=TouchBar.TouchBarButton;
// const TouchBarSpacer=TouchBar.TouchBarSpacer;
const shell=electron.shell;
app.on('ready',()=>{
	let opa=false;
	let screenWidth=require('electron').screen.getPrimaryDisplay().workAreaSize.width;
	let screenHeight=require('electron').screen.getPrimaryDisplay().workAreaSize.height;
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
		y:2,
		width:screenWidth,
		height:128,
		movable:false,
		resizeable:false,
		frame:false,
		transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	menuWindow.loadURL(path.join('file://',__dirname,'./startMenu.html'));
	let openingWindow=new BrowserWindow({
		width:1024,
		height:768,
		movable:false,
		resizeable:false,
		frame:false,
		transparent:true,
		webPreferences:{
			nodeIntegration:true
		}
	});
	openingWindow.loadURL(path.join('file://',__dirname,'./start.html'));
	request('https://webpages7086cmd.github.io/version.upd',(error,response,body)=>{
		if(body!=='0.0.2'){
			// console.log('new Version:'+String(body));
			request('https://webpages7086cmd.github.io/update.html',(errors,reponses,bodys)=>{
				try{
					expressApplication.get('/',(response,request)=>{
					   res.send(bodys);
					});
					var server=app.listen(8888,()=>{
						var host=server.address().address;
						var port=server.address().port;
						// console.log('Server running at http://'+host+':'+port+'/');
					});
				}
				catch(error){
					http.createServer((request,response)=>{
						response.writeHead(200,{
							'Content-Type':'text/html'
						});
						response.end(bodys);
					}).listen(8888);
					// console.log('Server running at http://127.0.0.1:8888/');
				}
				let updateWindow=new BrowserWindow({
					width:1024,
					height:768,
					movable:true,
					resizeable:true,
					webPreferences:{
						nodeIntegration:true
					}
				});
				updateWindow.loadURL('http://127.0.0.1:8888');
				updateWindow.on('close',()=>{
					updateWindow=null;
				});
			});
		}
		else{
			// console.log('latest version');
		}
	});
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
		changeWindow.loadURL(path.join('file://',__dirname,'./changingMode.html'));
		// changeWindow.webContents.openDevTools();
		// menuWindow.webContents.openDevTools();
		openingWindow.close();
		changeWindow.on('close',()=>{
			changeWindow=null;
		});
	});

	
	ipcMain.on('closeChangeWindow',()=>{
		changeWindow.close();
		menuWindow.close();
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
	let documentWindow;
	ipcMain.on('document',()=>{
		documentWindow=new BrowserWindow({
			width:1920,
			height:1080,
			frame:false,
			resizeable:true,
			movable:true,
			// transparent:true,
			webPreferences:{
				nodeIntegration:true
			}
		});
		documentWindow.loadURL(path.join('file://',__dirname,'./document.html'));
		documentWindow.on('close',()=>{
			documentWindow=null;
		});
	});
	ipcMain.on('closeDocumentWindow',()=>{
		documentWindow.close();
	});
	ipcMain.on('minDocumentWindow',()=>{
		documentWindow.minimize();
	});
	ipcMain.on('maxDocumentWindow',()=>{
		if(documentWindow.isMaximized()){
			documentWindow.unmaximize();
		}
		else{
			documentWindow.maximize();
		}
	});
	ipcMain.on('openFile',(event,arg)=>{
		// console.log("文件内容："+arg);
		changeWindow.webContents.send('read',arg);
	});
	ipcMain.on('docContent',(event,arg)=>{
		// console.log(event);
		// console.log('Changed:'+arg);
		menuWindow.webContents.send('content',arg);
		// console.log('send');
	});
	ipcMain.on('changed',(event,arg)=>{
		// console.log(event);
		// console.log("\n转换后："+arg);
		menuWindow.webContents.send('change',arg);
		// console.log('send');
	});
	ipcMain.on('hel',(event,arg)=>{
		// console.log(event+'\n'+arg);
	})
	let debugWindow;
	ipcMain.on('debug',(event,arg)=>{
		debugWindow=new BrowserWindow({
			title:'Debug',
			height:768,
			width:1024,
			movable:true,
			resizeable:true
		});
		debugWindow.loadURL(path.join('file://',arg));
		debugWindow.webContents.openDevTools();
		// console.log("debug:"+arg);
		debugWindow.on('close',()=>{
			debugWindow=null;
		});
	});
	openingWindow.on('close',()=>{
		openingWindow=null;
	});
});
