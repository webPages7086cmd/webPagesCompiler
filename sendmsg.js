function sendMsg(){
	require('electron').ipcRenderer.send('changed',changedNr);
	console.log('fs');
}