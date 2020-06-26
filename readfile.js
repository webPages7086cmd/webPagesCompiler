function readfile(){
	const {dialog}=require('electron').remote;
	dialog.showOpenDialog({
		title:'打开文件',
		filters:[
			{
				name:'webPages文档',
				extensions:[
					'webpage',
					'wp',
					'wpage',
					'webp'
				]
			},
			{
				name:'所有文件',
				extensions:[
					'*'
				]
			}
		]
	}).then(result=>{
		const fs=require('fs'); // 引入'fs'
		var neiRong=fs.readFileSync(String(result.filePaths),'utf-8');
		const {ipcRenderer}=require('electron');
		ipcRenderer.send('openFile',neiRong);
		console.log('send');
	});
}