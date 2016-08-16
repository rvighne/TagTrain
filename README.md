# TagTrain.js

![](promo/demo.gif)

A minimalistic JavaScript library for allowing tag-style input. **TagTrain.js** has no dependencies, generates a clean and minimal DOM tree, and is easily styled.

# Documentation

## API

As **TagTrain.js** is in its alpha stage, the best API documentation is the [example demo](example) and the [source code](src).

## Browser compatibility

**TagTrain.js** is compatible with most modern browsers that support the ECMAScript 5 specification. It has been tested on the latest versions of Google Chrome, Mozilla Firefox, Internet Explorer, and Microsoft Edge. Safari testers would be much appreciated!

## Generated HTML structure

```html
<div class="TagTrain-container">
	<ul class="TagTrain-tag-list">
		<li class="TagTrain-tag">
			<!-- tag value -->
			<span class="TagTrain-remove-btn"></span>
		</li>
		
		<!-- etc. -->
	</ul>
	<input class="TagTrain-input">
</div>
```