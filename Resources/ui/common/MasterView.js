var DetailView = require('ui/common/DetailView');
var Model = require('services/Model');

//Master View Component Constructor
function MasterView() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
	});

	var groupData = Ti.UI.createTableViewSection({
	});

	var moneyRow = Ti.UI.createTableViewRow({
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	groupData.add(moneyRow);
	moneyRow.add(Ti.UI.createLabel({
		text: '金額',
		left: 5,
		top: 5,
		bottom: 5,
		height: 'auto'
	}));
	var moneyField = Ti.UI.createTextField({
		hintText: '総額を入力',
		right: 5,
		width: 200,
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
	});
	moneyField.addEventListener('change', function() {
		Model.money = moneyField.value | 0;
	});
	moneyRow.add(moneyField);

	var peopleRow = Ti.UI.createTableViewRow({
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	groupData.add(peopleRow);
	peopleRow.add(Ti.UI.createLabel({
		text: '人数',
		left: 5,
		top: 5,
		bottom: 5,
		height: 'auto'
	}));
	var peopleField = Ti.UI.createTextField({
		hintText: '幹事も含めて入力',
		right: 5,
		width: 200,
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
	});
	peopleField.addEventListener('change', function() {
		Model.people = peopleField.value | 0;
	});
	peopleRow.add(peopleField);

	var unitRow = Ti.UI.createTableViewRow({
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	groupData.add(unitRow);
	var unitLabel;
	unitRow.add(unitLabel = Ti.UI.createLabel({
		text: '500円単位で計算',
		left: 5,
		top: 5,
		width: 300,
		bottom: 5,
		height: 'auto'
	}));
	var unitField = Ti.UI.createSlider({
		min: 0,
		max: 8,
		value: 5,
		right: 5,
		left: 155,
		keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
	});
	Model.unit = 5;
	unitField.addEventListener('change', function() {
		var units = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
		var unit = units[Math.round(unitField.value)];
		Model.unit = unit;
		unitLabel.text = unit + '円単位で計算';
	});
	unitRow.add(unitField);

	var calcPositiveRow = Ti.UI.createTableViewRow({
	});
	groupData.add(calcPositiveRow);
	calcPositiveRow.add(Ti.UI.createLabel({
		text: '幹事有利で計算',
		top: 5,
		bottom: 5,
		height: 'auto'
	}));

	var calcNegativeRow = Ti.UI.createTableViewRow({
	});
	groupData.add(calcNegativeRow);
	calcNegativeRow.add(Ti.UI.createLabel({
		text: '幹事不利で計算',
		top: 5,
		bottom: 5,
		height: 'auto'
	}));

	var tableView = Ti.UI.createTableView({
		data: [groupData],
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	tableView.addEventListener('click', function(e) {
		if(e.index == 3 || e.index == 4) {
			if(!Model.money || !Model.people) {
				var dialog = Titanium.UI.createAlertDialog();
				dialog.setTitle('不正な入力です');
				dialog.setMessage('金額と人数を入力してください。'); 
				dialog.show();
			} else {
				Model.calcFunc = (e.index == 3)? Math.ceil: Math.floor;
				var win = Ti.UI.createWindow({
					title: '計算結果',
					backButtonTitle: '戻る'
				});
				var detailView = new DetailView(win);
				win.add(detailView);
				self.nav.open(win);
			}
		}
	});
	self.add(tableView);
	
	return self;
};

module.exports = MasterView;
