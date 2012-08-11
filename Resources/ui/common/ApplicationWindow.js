function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView');
		
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var masterView = new MasterView();
		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title: '割り勘アプリ'
	});
	masterContainerWindow.add(masterView);
	
	//create iOS specific NavGroup UI
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window:masterContainerWindow
	});
	masterView.nav = navGroup;
	self.add(navGroup);
	
	return self;
};

module.exports = ApplicationWindow;
