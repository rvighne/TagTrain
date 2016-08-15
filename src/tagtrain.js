"use strict";

// Object.assign polyfill
if (typeof Object.assign !== 'function') {
	Object.defineProperty(Object, 'assign', {
		configurable: true,
		enumerable: false,
		writable: true,

		value: function assign(target, sources) {
			if (typeof target === 'undefined')
				throw new TypeError("undefined cannot be converted to Object");
			else if (target === null)
				throw new TypeError("null cannot be converted to Object");
			else
				target = Object(target);

			for (var i = 1; i < arguments.length; ++i) {
				var nextSource = Object(arguments[i]);
				for (var key in nextSource)
					if (nextSource.hasOwnProperty(key))
						target[key] = nextSource[key];
			}
			
			return target;
		}
	});
}

// Constructor
function TagTrain(opts) {
	this.opts = Object.assign({}, TagTrain.defaultOpts, opts);
	this.tags = [];
	this.tagCount = 0;

	this.el = document.createElement('div');
	this.el.classList.add(TagTrain.classNames.container);

	this.tagList = document.createElement('ul');
	this.tagList.classList.add(TagTrain.classNames.tagList);
	this.el.appendChild(this.tagList);

	this.input = document.createElement('input');
	this.input.classList.add(TagTrain.classNames.input);
	this.el.appendChild(this.input);

	this.el.addEventListener('click', TagTrain.removeItem.bind(this));
	this.el.addEventListener('click', TagTrain.focusInput.bind(this));
	this.input.addEventListener('keydown', TagTrain.tagInput.bind(this));
}

/* Static properties */
TagTrain.classNames = {
	container: 'TagTrain-container',
	tagList: 'TagTrain-tag-list',
	tagItem: 'TagTrain-tag',
	removeBtn: 'TagTrain-remove-btn',
	input: 'TagTrain-input'
};

TagTrain.idPrefix = 'TagTrain-tag-';

TagTrain.defaultOpts = {
	delimiters: [9, 13, 32, 188],
	removeLast: 8,
	invalidTag: /\W/,
	maxTags: Infinity
};

TagTrain._getItemIndex = function _getItemIndex(item) {
	return parseInt(item.id.slice(TagTrain.idPrefix.length), 10);
}

/* Instance methods */
TagTrain.prototype.addTag = function addTag(value) {
	if (value !== '' && this.tagCount < this.opts.maxTags && !this.opts.invalidTag.test(value) && this.tags.indexOf(value) === -1) {
		var item = document.createElement('li');
		item.classList.add(TagTrain.classNames.tagItem);
		item.id = TagTrain.idPrefix + this.tags.length;
		item.appendChild(document.createTextNode(value));

		var removeBtn = document.createElement('span');
		removeBtn.classList.add(TagTrain.classNames.removeBtn);
		item.appendChild(removeBtn);

		this.tagList.appendChild(item);

		this.tags.push(value);
		++this.tagCount;

		return true;
	} else {
		return false;
	}
};

// Used internally
TagTrain.prototype._removeItem = function _removeItem(item) {
	this.tagList.removeChild(item);
	delete this.tags[TagTrain._getItemIndex(item)];
	--this.tagCount;
}

TagTrain.prototype.removeAll = function removeAll() {
	var child;
	while (child = this.tagList.lastChild) {
		this.tagList.removeChild(child);
	}

	this.tags.length = this.tagCount = 0;
};

TagTrain.prototype.setTags = function setTags(tags) {
	this.removeAll();
	for (var i = 0; i < tags.length; ++i) {
		this.addTag(tags[i]);
	}
};

TagTrain.prototype.takeFocus = function takeFocus() {
	this.input.select();
}

/* Event handlers -- static, but must be bound to instance before registering */
TagTrain.removeItem = function removeItem(e) {
	if (e.target.classList.contains(TagTrain.classNames.removeBtn)) {
		this._removeItem(e.target.parentNode);
	}
};

TagTrain.focusInput = function focusInput(e) {
	var sel = document.getSelection();
	if (e.target !== this.input && (sel.isCollapsed || !sel.containsNode(this.el, true))) {
		this.input.select();
	}
};

TagTrain.tagInput = function tagInput(e) {
	if (this.opts.delimiters.indexOf(e.keyCode) !== -1) {
		e.preventDefault();
		if (this.addTag(this.input.value)) {
			this.input.value = '';
		}
	} else if (e.keyCode === this.opts.removeLast && this.input.selectionStart === 0 && this.input.selectionStart === this.input.selectionEnd) {
		e.preventDefault();
		this._removeItem(this.tagList.lastChild);
	}
};