var Model = require('services/Model');

function DetailView() {
	var self = Ti.UI.createView({
	});
	
	var groupData = Ti.UI.createTableViewSection({
		headerTitle: '総額: ' + Model.money + '円'
	});

	var masterRow = Ti.UI.createTableViewRow({
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	groupData.add(masterRow);
	var masterLabel;
	masterRow.add(masterLabel = Ti.UI.createLabel({
		text: '幹事: 10000円',
		left: 5,
		width: 300,
		top: 5,
		bottom: 5,
		height: 'auto'
	}));
	var setMaster = function(value) {
		masterLabel.text = '幹事: ' + value + '円';
	};

	var money = Model.money;
	var people = Model.people;
	var unit = Model.unit;

	var amount = money;
	var defaultPrice = Model.calcFunc(money / people / unit) * unit;
	var max = Math.min(money, defaultPrice * 5);

	var peopleList = [];
	for(var i = 0; i < people - 1; i++) {
		(function() {
			var info = {};
			peopleList.push(info);
			amount -= defaultPrice;
			var row = Ti.UI.createTableViewRow({
				touchEnabled: false,
				selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
			});
			groupData.add(row);

			var background = Ti.UI.createView({
				left: 0,
				right: 0,
				height: 30
			});
			row.add(background);

			var button = Ti.UI.createButton({
				left : 5
			});
			background.add(button);
			button.addEventListener('click', function() {
				info.selected = !info.selected;
				info.updateBackground();
			});

			var label = Ti.UI.createLabel({
				text: defaultPrice + '円',
				left: 33,
				top: 5,
				width: 300,
				bottom: 5,
				height: 'auto'
			});
			background.add(label);
			info.setPrice = function(value) {
				label.text = value + '円';
				info.price = value;
				if(slider.value != value) {
					slider.value = value;
				}
			};
			info.price = defaultPrice;

			var slider = Ti.UI.createSlider({
				min: 0,
				max: max,
				value: defaultPrice,
				left: 95,
				right: 60
			});
			slider.addEventListener('change', function() {
				if(info.price == slider.value) {
					return;
				}
				if(info.price < 0 && slider.value == 0) {
					return;
				}
				if(info.price > max && slider.value == max) {
					return;
				}
				if(!info.selected) {
					clearSelected();
				}
				info.selected = true;
				calcAllPrice(Model.calcFunc(slider.value / unit) * unit);
			});
			background.add(slider);

			var tabbed = Ti.UI.createTabbedBar({
				index: 0,
				labels: ['未', '確'],
				right: 5,
				width: 55,
				height: 25
			});
			background.add(tabbed);
			tabbed.addEventListener('click', function(e) {
				info.setFix(e.index == 1);
			});
			info.setFix = function(value) {
				tabbed.index = value? 1: 0;
				info.fix = value;
				info.updateBackground();
			};

			info.updateBackground = function() {
				var bg = '#fff';
				if(info.selected) {
					bg = '#f88';
				} else if(info.fix) {
					bg = '#ccc';
				}
				background.backgroundColor = bg;
			};
		})();
	}
	setMaster(amount);
	var clearSelected = function() {
		for(var i = 0; i < peopleList.length; i++) {
			peopleList[i].selected = false;
			peopleList[i].updateBackground();
		}
	};
	var calcAllPrice = function(value) {
		var amount = money;
		var people = 1;
		var rest = [];
		for(var i = 0; i < peopleList.length; i++) {
			var info = peopleList[i];
			if(info.selected) {
				info.setPrice(value);
				info.setFix(true);
				amount -= value;
			} else if(info.fix) {
				amount -= info.price;
			} else {
				people += 1;
				rest.push(info);
			}
			info.updateBackground();
		}
		var price = Model.calcFunc(amount / people / unit) * unit;
		for(var i = 0; i < rest.length; i++) {
			var info = rest[i];
			info.setPrice(price);
			amount -= price;
		}
		setMaster(amount);
	};

	var tableView = Ti.UI.createTableView({
		data: [groupData],
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	self.add(tableView);

	return self;
};

module.exports = DetailView;
