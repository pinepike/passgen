'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	"use strict";

	var PasswordGeneratorCore = function () {
		function PasswordGeneratorCore() {
			_classCallCheck(this, PasswordGeneratorCore);
		}

		_createClass(PasswordGeneratorCore, null, [{
			key: 'getRandomChar',
			value: function getRandomChar(selectedCharTypes) {
				var types = selectedCharTypes && selectedCharTypes.length && selectedCharTypes || this.presets.charTypes;
				var randomCharType = types[Math.floor(Math.random() * types.length)];
				var charsetByType = this.presets.charset[randomCharType];
				var randomChar = charsetByType[Math.floor(Math.random() * charsetByType.length)];
				return randomChar;
			}
		}, {
			key: 'generatePassword',
			value: function generatePassword(len, selectedCharTypes) {
				var _this = this;

				len = len || this.presets.length;
				if (len > this.presets.maxLength) {
					len = this.presets.maxLength;
				}
				if (len < this.presets.minLength) {
					len = this.presets.minLength;
				}
				return Array.from(Array(len), function () {
					return _this.getRandomChar(selectedCharTypes);
				}).join('');
			}
		}]);

		return PasswordGeneratorCore;
	}();

	PasswordGeneratorCore.presets = {
		length: 16,
		minLength: 6,
		maxLength: 256,
		charTypes: ['numbers', 'uppercase', 'lowercase', 'special'],
		charset: {
			'numbers': '1234567890',
			'uppercase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'lowercase': 'abcdefghijklmnopqrstuvwxyz',
			'special': '!#$%&()*+,-./:;<=>?@[]^_{|}~'
		}
	};

	var PasswordGeneratorWidget = function () {
		function PasswordGeneratorWidget(options) {
			var _this2 = this;

			_classCallCheck(this, PasswordGeneratorWidget);

			this.CSS_CLASS_NAMES = {
				BUTTON: 'password-generator__button',
				PASSWORD: 'password-generator__password',
				PASSWORD_CONTAINER: 'password-generator__password-container',
				LENGTH: 'password-generator__length',
				LENGTH_CONTAINER: 'password-generator__length-container',
				TOOLBAR: 'password-generator__toolbar',
				PASSWORD_GENERATOR: 'password-generator',
				CLEARFIX: 'clearfix',
				TOOLTIP: 'password-generator__tooltip',
				CHARSET_LIST: 'password-generator__charset-list',
				CHARSET_LIST_LABEL: 'password-generator__charset-list__label',
				CHARSET_LIST_CHECKBOX: 'password-generator__charset-list__checkbox'
			};
			this.SELECTORS = {
				CONTAINER: '#password-generator'
			};
			this.elements = {};
			this.CONSTANTS = { DELAY: 1000 };
			this.MESSAGES = {
				PASSWORD_COPIED: 'copied',
				HIDE: 'hide',
				SHOW: 'show'
			};

			this.passwordOnMouseUpHandler = function (e) {
				var elem = e.target;

				// selects password and copy it to clipboard
				// does not work on iOS devices
				elem.setSelectionRange(0, elem.value.length);
				document.execCommand('copy');
			};

			this.onCopyEventHandler = function (event) {
				if (_this2.elements.tooltip) {
					return;
				}

				//creates notification message
				var tooltip = _this2.createElement('div', { className: _this2.CSS_CLASS_NAMES.TOOLTIP }, [_this2.MESSAGES.PASSWORD_COPIED]);
				_this2.elements.tooltip = tooltip;
				var passwordElem = _this2.elements.password;
				passwordElem.parentNode.insertBefore(tooltip, passwordElem.nextSibling);

				//sets a notification display timeout
				setTimeout(function () {
					tooltip.remove();_this2.elements.tooltip = null;
				}, _this2.CONSTANTS.DELAY);
			};

			this.lenghOnChangeHandler = function (event) {
				var elem = event.target;
				_this2.length = parseInt(elem.value);
			};

			this.buttonClickHandler = function (e) {
				e.preventDefault();
				_this2.elements.password.value = _this2.core.generatePassword(_this2.length, _this2.getCharsetList());
			};

			this.injectDependencies();
			this.initOptions(options);
			this.initWidget();
			this.assignListeners();
		}

		_createClass(PasswordGeneratorWidget, [{
			key: 'injectDependencies',
			value: function injectDependencies() {
				this.core = PasswordGeneratorCore;
				this.createElement = createElement;
			}
		}, {
			key: 'initOptions',
			value: function initOptions() {
				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				this.length = options.length || this.core.presets.length;
				this.minLength = options.minLength || this.core.presets.minLength;
				this.maxLength = options.maxLength || this.core.presets.maxLength;
				this.container = document.querySelector(options.selector || this.SELECTORS.CONTAINER);
				this.charset = options.charset || this.core.presets.charset;
				this.charTypes = options.charTypes || this.core.presets.charTypes;
			}
		}, {
			key: 'initWidget',
			value: function initWidget() {
				this.widget = this.generateWidgetContent(this.container);
				this.elements.password.value = this.core.generatePassword(this.length, this.getCharsetList());
			}
		}, {
			key: 'assignListeners',
			value: function assignListeners() {
				this.elements.button.addEventListener('click', this.buttonClickHandler);
				//shows notification after password was copied
				this.widget.addEventListener('copy', this.onCopyEventHandler);
				this.elements.password.addEventListener('mouseup', this.passwordOnMouseUpHandler);
				this.elements.length.addEventListener('change', this.lenghOnChangeHandler);
			}
		}, {
			key: 'generateWidgetContent',
			value: function generateWidgetContent(widgetContainer) {
				var password = this.createElement('input', { className: this.CSS_CLASS_NAMES.PASSWORD, type: 'text', value: 'password' });
				this.elements.password = password;
				var passwordContainer = this.createElement('div', { className: this.CSS_CLASS_NAMES.PASSWORD_CONTAINER }, [password]);
				var generateButton = this.createElement('input', { className: this.CSS_CLASS_NAMES.BUTTON, type: 'button', value: 'generate' });
				this.elements.button = generateButton;
				var length = this.generateLengthElement();
				this.elements.length = length;
				var lengthContainer = this.createElement('div', { className: this.CSS_CLASS_NAMES.LENGTH_CONTAINER }, [length]);
				var charsetList = this.generateCharsetListElement();
				this.elements.charsetList = charsetList;
				var widget = this.createElement('div', { className: this.CSS_CLASS_NAMES.PASSWORD_GENERATOR + ' ' + this.CSS_CLASS_NAMES.CLEARFIX }, [passwordContainer, generateButton, lengthContainer, charsetList]);
				widgetContainer.appendChild(widget);
				return widget;
			}

			//copies password to clipboard


			//shows "copied" notification

		}, {
			key: 'getCharsetList',
			value: function getCharsetList() {
				var list = this.elements.charsetList.items.slice() || [];
				list = list.filter(function (item) {
					return item.checked;
				}).map(function (item) {
					return item.name;
				});
				return list;
			}
		}, {
			key: 'generateLengthElement',
			value: function generateLengthElement() {
				var container = this.createElement('select', { className: this.CSS_CLASS_NAMES.LENGTH });

				for (var l = 0; l <= this.maxLength - this.minLength; l++) {
					var value = l + this.minLength;
					var option = this.createElement('option', { value: value, innerHTML: value, selected: value === this.length ? true : false });
					container.appendChild(option);
				}

				return container;
			}
		}, {
			key: 'generateCharsetListElement',
			value: function generateCharsetListElement() {
				var container = this.createElement('div', { className: this.CSS_CLASS_NAMES.CHARSET_LIST, items: [] });

				for (var str in this.charset) {
					var input = this.createElement('input', { className: this.CSS_CLASS_NAMES.CHARSET_LIST_CHECKBOX, type: 'checkbox', name: str, value: str, checked: this.charTypes.includes(str) ? true : false });
					var label = this.createElement('label', { className: this.CSS_CLASS_NAMES.CHARSET_LIST_LABEL }, [input, str]);
					container.items.push(input);
					container.appendChild(label);
				}

				return container;
			}
		}]);

		return PasswordGeneratorWidget;
	}();

	window.PasswordGeneratorWidget = PasswordGeneratorWidget;
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsiUGFzc3dvcmRHZW5lcmF0b3JDb3JlIiwic2VsZWN0ZWRDaGFyVHlwZXMiLCJ0eXBlcyIsImxlbmd0aCIsInByZXNldHMiLCJjaGFyVHlwZXMiLCJyYW5kb21DaGFyVHlwZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoYXJzZXRCeVR5cGUiLCJjaGFyc2V0IiwicmFuZG9tQ2hhciIsImxlbiIsIm1heExlbmd0aCIsIm1pbkxlbmd0aCIsIkFycmF5IiwiZnJvbSIsImdldFJhbmRvbUNoYXIiLCJqb2luIiwiUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQiLCJvcHRpb25zIiwiQ1NTX0NMQVNTX05BTUVTIiwiQlVUVE9OIiwiUEFTU1dPUkQiLCJQQVNTV09SRF9DT05UQUlORVIiLCJMRU5HVEgiLCJMRU5HVEhfQ09OVEFJTkVSIiwiVE9PTEJBUiIsIlBBU1NXT1JEX0dFTkVSQVRPUiIsIkNMRUFSRklYIiwiVE9PTFRJUCIsIkNIQVJTRVRfTElTVCIsIkNIQVJTRVRfTElTVF9MQUJFTCIsIkNIQVJTRVRfTElTVF9DSEVDS0JPWCIsIlNFTEVDVE9SUyIsIkNPTlRBSU5FUiIsImVsZW1lbnRzIiwiQ09OU1RBTlRTIiwiREVMQVkiLCJNRVNTQUdFUyIsIlBBU1NXT1JEX0NPUElFRCIsIkhJREUiLCJTSE9XIiwicGFzc3dvcmRPbk1vdXNlVXBIYW5kbGVyIiwiZSIsImVsZW0iLCJ0YXJnZXQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsInZhbHVlIiwiZG9jdW1lbnQiLCJleGVjQ29tbWFuZCIsIm9uQ29weUV2ZW50SGFuZGxlciIsImV2ZW50IiwidG9vbHRpcCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJwYXNzd29yZEVsZW0iLCJwYXNzd29yZCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJsZW5naE9uQ2hhbmdlSGFuZGxlciIsInBhcnNlSW50IiwiYnV0dG9uQ2xpY2tIYW5kbGVyIiwicHJldmVudERlZmF1bHQiLCJjb3JlIiwiZ2VuZXJhdGVQYXNzd29yZCIsImdldENoYXJzZXRMaXN0IiwiaW5qZWN0RGVwZW5kZW5jaWVzIiwiaW5pdE9wdGlvbnMiLCJpbml0V2lkZ2V0IiwiYXNzaWduTGlzdGVuZXJzIiwiY29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsInNlbGVjdG9yIiwid2lkZ2V0IiwiZ2VuZXJhdGVXaWRnZXRDb250ZW50IiwiYnV0dG9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIndpZGdldENvbnRhaW5lciIsInR5cGUiLCJwYXNzd29yZENvbnRhaW5lciIsImdlbmVyYXRlQnV0dG9uIiwiZ2VuZXJhdGVMZW5ndGhFbGVtZW50IiwibGVuZ3RoQ29udGFpbmVyIiwiY2hhcnNldExpc3QiLCJnZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudCIsImFwcGVuZENoaWxkIiwibGlzdCIsIml0ZW1zIiwic2xpY2UiLCJmaWx0ZXIiLCJpdGVtIiwiY2hlY2tlZCIsIm1hcCIsIm5hbWUiLCJsIiwib3B0aW9uIiwiaW5uZXJIVE1MIiwic2VsZWN0ZWQiLCJzdHIiLCJpbnB1dCIsImluY2x1ZGVzIiwibGFiZWwiLCJwdXNoIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxDQUFDLENBQUMsWUFBWTtBQUNiOztBQURhLEtBR1BBLHFCQUhPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQ0FpQlVDLGlCQWpCVixFQWlCNkI7QUFDdkMsUUFBTUMsUUFBUUQscUJBQXFCQSxrQkFBa0JFLE1BQXZDLElBQWlERixpQkFBakQsSUFBc0UsS0FBS0csT0FBTCxDQUFhQyxTQUFqRztBQUNBLFFBQU1DLGlCQUFpQkosTUFBTUssS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCUCxNQUFNQyxNQUFqQyxDQUFOLENBQXZCO0FBQ0EsUUFBTU8sZ0JBQWdCLEtBQUtOLE9BQUwsQ0FBYU8sT0FBYixDQUFxQkwsY0FBckIsQ0FBdEI7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LEVBQTFCLENBQWxCOztBQUVBLFNBQUssSUFBSVcsR0FBVCxJQUFnQixLQUFLNUYsT0FBckIsRUFBNkI7QUFDNUIsU0FBTTZGLFFBQVEsS0FBS2pELGFBQUwsQ0FBbUIsT0FBbkIsRUFBNEIsRUFBQ0MsV0FBVyxLQUFLbEMsZUFBTCxDQUFxQlkscUJBQWpDLEVBQXdEaUQsTUFBTSxVQUE5RCxFQUEwRWUsTUFBTUssR0FBaEYsRUFBcUZ0RCxPQUFPc0QsR0FBNUYsRUFBaUdQLFNBQVMsS0FBSzNGLFNBQUwsQ0FBZW9HLFFBQWYsQ0FBd0JGLEdBQXhCLElBQStCLElBQS9CLEdBQXNDLEtBQWhKLEVBQTVCLENBQWQ7QUFDQSxTQUFNRyxRQUFRLEtBQUtuRCxhQUFMLENBQW1CLE9BQW5CLEVBQTRCLEVBQUNDLFdBQVcsS0FBS2xDLGVBQUwsQ0FBcUJXLGtCQUFqQyxFQUE1QixFQUFrRixDQUFDdUUsS0FBRCxFQUFRRCxHQUFSLENBQWxGLENBQWQ7QUFDQTVCLGVBQVVpQixLQUFWLENBQWdCZSxJQUFoQixDQUFxQkgsS0FBckI7QUFDQTdCLGVBQVVlLFdBQVYsQ0FBc0JnQixLQUF0QjtBQUNBOztBQUVELFdBQU8vQixTQUFQO0FBQ0E7QUE1S1c7O0FBQUE7QUFBQTs7QUFvTGJpQyxRQUFPeEYsdUJBQVAsR0FBaUNBLHVCQUFqQztBQUNBLENBckxBIiwiZmlsZSI6ImpzL3Bhc3NnZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Y2xhc3MgUGFzc3dvcmRHZW5lcmF0b3JDb3JlIHtcblx0XHRcdHN0YXRpYyBwcmVzZXRzID0ge1xuXHRcdFx0XHRsZW5ndGg6IDE2LFxuXHRcdFx0XHRtaW5MZW5ndGg6IDYsXG5cdFx0XHRcdG1heExlbmd0aDogMjU2LFxuXHRcdFx0XHRjaGFyVHlwZXM6IFsnbnVtYmVycycsICd1cHBlcmNhc2UnLCAnbG93ZXJjYXNlJywgJ3NwZWNpYWwnXSxcblx0XHRcdFx0Y2hhcnNldDoge1xuXHRcdFx0XHRcdCdudW1iZXJzJzogJzEyMzQ1Njc4OTAnLFxuXHRcdFx0XHRcdCd1cHBlcmNhc2UnOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonLFxuXHRcdFx0XHRcdCdsb3dlcmNhc2UnOiAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxuXHRcdFx0XHRcdCdzcGVjaWFsJzogJyEjJCUmKCkqKywtLi86Ozw9Pj9AW11eX3t8fX4nXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIGdldFJhbmRvbUNoYXIoc2VsZWN0ZWRDaGFyVHlwZXMpIHtcblx0XHRcdFx0Y29uc3QgdHlwZXMgPSBzZWxlY3RlZENoYXJUeXBlcyAmJiBzZWxlY3RlZENoYXJUeXBlcy5sZW5ndGggJiYgc2VsZWN0ZWRDaGFyVHlwZXMgfHwgdGhpcy5wcmVzZXRzLmNoYXJUeXBlcztcblx0XHRcdFx0Y29uc3QgcmFuZG9tQ2hhclR5cGUgPSB0eXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0eXBlcy5sZW5ndGgpXTtcblx0XHRcdFx0Y29uc3QgY2hhcnNldEJ5VHlwZSA9IHRoaXMucHJlc2V0cy5jaGFyc2V0W3JhbmRvbUNoYXJUeXBlXTtcblx0XHRcdFx0Y29uc3QgcmFuZG9tQ2hhciA9IGNoYXJzZXRCeVR5cGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnNldEJ5VHlwZS5sZW5ndGgpXTtcblx0XHRcdFx0cmV0dXJuIHJhbmRvbUNoYXI7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZW5lcmF0ZVBhc3N3b3JkIChsZW4sIHNlbGVjdGVkQ2hhclR5cGVzKSB7XG5cdFx0XHRcdGxlbiA9IGxlbiB8fCB0aGlzLnByZXNldHMubGVuZ3RoO1xuXHRcdFx0XHRpZiAobGVuID4gdGhpcy5wcmVzZXRzLm1heExlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMubWF4TGVuZ3RoOyB9XG5cdFx0XHRcdGlmIChsZW4gPCB0aGlzLnByZXNldHMubWluTGVuZ3RoKSB7IGxlbiA9IHRoaXMucHJlc2V0cy5taW5MZW5ndGg7IH1cblx0XHRcdFx0cmV0dXJuIEFycmF5LmZyb20oQXJyYXkobGVuKSwgKCkgPT4gdGhpcy5nZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSkuam9pbignJyk7XG5cdFx0XHR9XG5cdH1cblxuXHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvcldpZGdldCB7XG5cdFx0Q1NTX0NMQVNTX05BTUVTID0ge1xuXHRcdFx0QlVUVE9OOiAncGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nLFxuXHRcdFx0UEFTU1dPUkQ6ICdwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkJyxcblx0XHRcdFBBU1NXT1JEX0NPTlRBSU5FUjogJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQtY29udGFpbmVyJyxcblx0XHRcdExFTkdUSDogJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoJyxcblx0XHRcdExFTkdUSF9DT05UQUlORVI6ICdwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aC1jb250YWluZXInLFxuXHRcdFx0VE9PTEJBUjogJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbGJhcicsXG5cdFx0XHRQQVNTV09SRF9HRU5FUkFUT1I6ICdwYXNzd29yZC1nZW5lcmF0b3InLFxuXHRcdFx0Q0xFQVJGSVg6ICdjbGVhcmZpeCcsXG5cdFx0XHRUT09MVElQOiAncGFzc3dvcmQtZ2VuZXJhdG9yX190b29sdGlwJyxcblx0XHRcdENIQVJTRVRfTElTVDogJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0Jyxcblx0XHRcdENIQVJTRVRfTElTVF9MQUJFTDogJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0X19sYWJlbCcsXG5cdFx0XHRDSEFSU0VUX0xJU1RfQ0hFQ0tCT1g6ICdwYXNzd29yZC1nZW5lcmF0b3JfX2NoYXJzZXQtbGlzdF9fY2hlY2tib3gnLFxuXHRcdH07XG5cblx0XHRTRUxFQ1RPUlMgPSB7XG5cdFx0XHRDT05UQUlORVI6ICcjcGFzc3dvcmQtZ2VuZXJhdG9yJyxcblx0XHR9O1xuXG5cdFx0ZWxlbWVudHMgPSB7fTtcblxuXHRcdENPTlNUQU5UUyA9IHtERUxBWTogMTAwMH07XG5cblx0XHRNRVNTQUdFUyA9IHtcblx0XHRcdFBBU1NXT1JEX0NPUElFRDogJ2NvcGllZCcsXG5cdFx0XHRISURFOiAnaGlkZScsXG5cdFx0XHRTSE9XOiAnc2hvdycsXG5cdFx0fTtcblxuXHRcdGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuXHRcdFx0dGhpcy5pbmplY3REZXBlbmRlbmNpZXMoKTtcblx0XHRcdHRoaXMuaW5pdE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0XHR0aGlzLmluaXRXaWRnZXQoKTtcblx0XHRcdHRoaXMuYXNzaWduTGlzdGVuZXJzKCk7XG5cdFx0fVxuXG5cdFx0aW5qZWN0RGVwZW5kZW5jaWVzKCkge1xuXHRcdFx0dGhpcy5jb3JlID0gUGFzc3dvcmRHZW5lcmF0b3JDb3JlO1xuXHRcdFx0dGhpcy5jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudDtcblx0XHR9XG5cblx0XHRpbml0T3B0aW9ucyhvcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfHwgdGhpcy5jb3JlLnByZXNldHMubGVuZ3RoO1xuXHRcdFx0dGhpcy5taW5MZW5ndGggPSBvcHRpb25zLm1pbkxlbmd0aCB8fCB0aGlzLmNvcmUucHJlc2V0cy5taW5MZW5ndGg7XG5cdFx0XHR0aGlzLm1heExlbmd0aCA9IG9wdGlvbnMubWF4TGVuZ3RoIHx8IHRoaXMuY29yZS5wcmVzZXRzLm1heExlbmd0aDtcblx0XHRcdHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnNlbGVjdG9yIHx8IHRoaXMuU0VMRUNUT1JTLkNPTlRBSU5FUik7XG5cdFx0XHR0aGlzLmNoYXJzZXQgPSBvcHRpb25zLmNoYXJzZXQgfHwgdGhpcy5jb3JlLnByZXNldHMuY2hhcnNldDtcblx0XHRcdHRoaXMuY2hhclR5cGVzID0gb3B0aW9ucy5jaGFyVHlwZXMgfHwgdGhpcy5jb3JlLnByZXNldHMuY2hhclR5cGVzO1xuXHRcdH1cblxuXHRcdGluaXRXaWRnZXQoKSB7XG5cdFx0XHR0aGlzLndpZGdldCA9IHRoaXMuZ2VuZXJhdGVXaWRnZXRDb250ZW50KHRoaXMuY29udGFpbmVyKTtcblx0XHRcdHRoaXMuZWxlbWVudHMucGFzc3dvcmQudmFsdWUgPSB0aGlzLmNvcmUuZ2VuZXJhdGVQYXNzd29yZCh0aGlzLmxlbmd0aCwgdGhpcy5nZXRDaGFyc2V0TGlzdCgpKTtcblx0XHR9XG5cblx0XHRhc3NpZ25MaXN0ZW5lcnMoKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnRzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnV0dG9uQ2xpY2tIYW5kbGVyKTtcblx0XHRcdC8vc2hvd3Mgbm90aWZpY2F0aW9uIGFmdGVyIHBhc3N3b3JkIHdhcyBjb3BpZWRcblx0XHRcdHRoaXMud2lkZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCB0aGlzLm9uQ29weUV2ZW50SGFuZGxlcik7XG5cdFx0XHR0aGlzLmVsZW1lbnRzLnBhc3N3b3JkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnBhc3N3b3JkT25Nb3VzZVVwSGFuZGxlcik7XG5cdFx0XHR0aGlzLmVsZW1lbnRzLmxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmxlbmdoT25DaGFuZ2VIYW5kbGVyKTtcblx0XHR9XG5cblx0XHRnZW5lcmF0ZVdpZGdldENvbnRlbnQod2lkZ2V0Q29udGFpbmVyKSB7XG5cdFx0XHRjb25zdCBwYXNzd29yZCA9IHRoaXMuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7Y2xhc3NOYW1lOiB0aGlzLkNTU19DTEFTU19OQU1FUy5QQVNTV09SRCwgdHlwZTogJ3RleHQnLCB2YWx1ZTogJ3Bhc3N3b3JkJ30pO1xuXHRcdFx0dGhpcy5lbGVtZW50cy5wYXNzd29yZCA9IHBhc3N3b3JkO1xuXHRcdFx0Y29uc3QgcGFzc3dvcmRDb250YWluZXIgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IHRoaXMuQ1NTX0NMQVNTX05BTUVTLlBBU1NXT1JEX0NPTlRBSU5FUn0sIFtwYXNzd29yZF0pO1xuXHRcdFx0Y29uc3QgZ2VuZXJhdGVCdXR0b24gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge2NsYXNzTmFtZTogdGhpcy5DU1NfQ0xBU1NfTkFNRVMuQlVUVE9OLCB0eXBlOiAnYnV0dG9uJywgdmFsdWU6ICdnZW5lcmF0ZSd9KTtcblx0XHRcdHRoaXMuZWxlbWVudHMuYnV0dG9uID0gZ2VuZXJhdGVCdXR0b247XG5cdFx0XHRjb25zdCBsZW5ndGggPSB0aGlzLmdlbmVyYXRlTGVuZ3RoRWxlbWVudCgpO1xuXHRcdFx0dGhpcy5lbGVtZW50cy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0XHRjb25zdCBsZW5ndGhDb250YWluZXIgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IHRoaXMuQ1NTX0NMQVNTX05BTUVTLkxFTkdUSF9DT05UQUlORVJ9LCBbbGVuZ3RoXSk7XG5cdFx0XHRjb25zdCBjaGFyc2V0TGlzdCA9IHRoaXMuZ2VuZXJhdGVDaGFyc2V0TGlzdEVsZW1lbnQoKTtcblx0XHRcdHRoaXMuZWxlbWVudHMuY2hhcnNldExpc3QgPSBjaGFyc2V0TGlzdDtcblx0XHRcdGNvbnN0IHdpZGdldCA9IHRoaXMuY3JlYXRlRWxlbWVudCgnZGl2Jywge2NsYXNzTmFtZTogYCR7dGhpcy5DU1NfQ0xBU1NfTkFNRVMuUEFTU1dPUkRfR0VORVJBVE9SfSAke3RoaXMuQ1NTX0NMQVNTX05BTUVTLkNMRUFSRklYfWB9LFxuXHRcdFx0XHRbcGFzc3dvcmRDb250YWluZXIsIGdlbmVyYXRlQnV0dG9uLCBsZW5ndGhDb250YWluZXIsIGNoYXJzZXRMaXN0XSk7XG5cdFx0XHR3aWRnZXRDb250YWluZXIuYXBwZW5kQ2hpbGQod2lkZ2V0KTtcblx0XHRcdHJldHVybiB3aWRnZXQ7XG5cdFx0fVxuXG5cdFx0Ly9jb3BpZXMgcGFzc3dvcmQgdG8gY2xpcGJvYXJkXG5cdFx0cGFzc3dvcmRPbk1vdXNlVXBIYW5kbGVyID0gKGUpID0+IHtcblx0XHRcdGNvbnN0IGVsZW0gPSBlLnRhcmdldDtcblxuXHRcdFx0Ly8gc2VsZWN0cyBwYXNzd29yZCBhbmQgY29weSBpdCB0byBjbGlwYm9hcmRcblx0XHRcdC8vIGRvZXMgbm90IHdvcmsgb24gaU9TIGRldmljZXNcblx0XHRcdGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UoMCwgZWxlbS52YWx1ZS5sZW5ndGgpO1xuXHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblx0XHR9O1xuXG5cdFx0Ly9zaG93cyBcImNvcGllZFwiIG5vdGlmaWNhdGlvblxuXHRcdG9uQ29weUV2ZW50SGFuZGxlciA9IChldmVudCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuZWxlbWVudHMudG9vbHRpcCkgeyByZXR1cm47IH1cblxuXHRcdFx0Ly9jcmVhdGVzIG5vdGlmaWNhdGlvbiBtZXNzYWdlXG5cdFx0XHRjb25zdCB0b29sdGlwID0gdGhpcy5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiB0aGlzLkNTU19DTEFTU19OQU1FUy5UT09MVElQfSwgW3RoaXMuTUVTU0FHRVMuUEFTU1dPUkRfQ09QSUVEXSk7XG5cdFx0XHR0aGlzLmVsZW1lbnRzLnRvb2x0aXAgPSB0b29sdGlwO1xuXHRcdFx0Y29uc3QgcGFzc3dvcmRFbGVtID0gdGhpcy5lbGVtZW50cy5wYXNzd29yZDtcblx0XHRcdHBhc3N3b3JkRWxlbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0b29sdGlwLCBwYXNzd29yZEVsZW0ubmV4dFNpYmxpbmcpXG5cblx0XHRcdC8vc2V0cyBhIG5vdGlmaWNhdGlvbiBkaXNwbGF5IHRpbWVvdXRcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4geyB0b29sdGlwLnJlbW92ZSgpOyB0aGlzLmVsZW1lbnRzLnRvb2x0aXAgPSBudWxsOyB9LCB0aGlzLkNPTlNUQU5UUy5ERUxBWSk7XG5cdFx0fTtcblxuXHRcdGxlbmdoT25DaGFuZ2VIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRjb25zdCBlbGVtID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0dGhpcy5sZW5ndGggPSBwYXJzZUludChlbGVtLnZhbHVlKTtcblx0XHR9O1xuXG5cdFx0Z2V0Q2hhcnNldExpc3QoKSB7XG5cdFx0XHRsZXQgbGlzdCA9IHRoaXMuZWxlbWVudHMuY2hhcnNldExpc3QuaXRlbXMuc2xpY2UoKSB8fCBbXTtcblx0XHRcdGxpc3QgPSBsaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY2hlY2tlZCkubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH1cblxuXHRcdGdlbmVyYXRlTGVuZ3RoRWxlbWVudCgpIHtcblx0XHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jywge2NsYXNzTmFtZTogdGhpcy5DU1NfQ0xBU1NfTkFNRVMuTEVOR1RIfSk7XG5cblx0XHRcdGZvciAobGV0IGwgPSAwOyBsIDw9IHRoaXMubWF4TGVuZ3RoIC0gdGhpcy5taW5MZW5ndGg7IGwrKykge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IGwgKyB0aGlzLm1pbkxlbmd0aDtcblx0XHRcdFx0Y29uc3Qgb3B0aW9uID0gdGhpcy5jcmVhdGVFbGVtZW50KCdvcHRpb24nLCB7dmFsdWU6IHZhbHVlLCBpbm5lckhUTUw6IHZhbHVlLCBzZWxlY3RlZDogdmFsdWUgPT09IHRoaXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlfSk7XG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblxuXHRcdGdlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KCkge1xuXHRcdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiB0aGlzLkNTU19DTEFTU19OQU1FUy5DSEFSU0VUX0xJU1QsIGl0ZW1zOiBbXX0pO1xuXG5cdFx0XHRmb3IgKGxldCBzdHIgaW4gdGhpcy5jaGFyc2V0KXtcblx0XHRcdFx0Y29uc3QgaW5wdXQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge2NsYXNzTmFtZTogdGhpcy5DU1NfQ0xBU1NfTkFNRVMuQ0hBUlNFVF9MSVNUX0NIRUNLQk9YLCB0eXBlOiAnY2hlY2tib3gnLCBuYW1lOiBzdHIsIHZhbHVlOiBzdHIsIGNoZWNrZWQ6IHRoaXMuY2hhclR5cGVzLmluY2x1ZGVzKHN0cikgPyB0cnVlIDogZmFsc2V9KTtcblx0XHRcdFx0Y29uc3QgbGFiZWwgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJywge2NsYXNzTmFtZTogdGhpcy5DU1NfQ0xBU1NfTkFNRVMuQ0hBUlNFVF9MSVNUX0xBQkVMfSwgW2lucHV0LCBzdHJdKTtcblx0XHRcdFx0Y29udGFpbmVyLml0ZW1zLnB1c2goaW5wdXQpO1xuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHRcdH1cblxuXHRcdGJ1dHRvbkNsaWNrSGFuZGxlciA9IChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRzLnBhc3N3b3JkLnZhbHVlID0gdGhpcy5jb3JlLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgsIHRoaXMuZ2V0Q2hhcnNldExpc3QoKSk7XG5cdFx0fTtcblx0fVxuXG5cdHdpbmRvdy5QYXNzd29yZEdlbmVyYXRvcldpZGdldCA9IFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0O1xufSkoKTtcbiJdfQ==
