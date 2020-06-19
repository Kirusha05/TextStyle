const span = document.getElementById('inputfield');
const italic = document.getElementById('italicBtn');
const bold = document.getElementById('boldBtn');

let blankChar = '&#8203'; // zero-width chars

span.innerHTML = blankChar;
span.focus();

let selection = window.getSelection; // shorthand

console.log(selection());

let boldSelected = false;
let italicSelected = false;
let deselected;
let firstSelected;

span.addEventListener('keydown', function(e) {
	if (e.keyCode === 13) e.preventDefault(); // 13 is Enter
});

span.addEventListener('keyup', e => {
	if (e.key === 'Backspace') handleBackspace();
})

function handleBackspace() {
	if (!span.innerText) {
		bold.classList.remove('bold-selected');
		italic.classList.remove('italic-selected');
		boldSelected = false;
		italicSelected = false;
		firstSelected = false;
		deselected = null;
	}

	console.log(selection().anchorNode)
}

bold.addEventListener('click', () => {
	bold.classList.toggle('bold-selected'); // make the button gray or white
	if (bold.classList.contains('bold-selected')) { // if the button is gray, so if it's selected
		boldSelected = true;
		if (!firstSelected) firstSelected = 'bold';
		createBoldTag(); // create strong tag and set the caret in it
	} else { // if the button is white, not selected

		deselected = 'bold';
		checkAndSetCaretPosition();

		firstSelected = (firstSelected === 'bold' && !italicSelected) ? null : 'italic'; // set to null if only the bold is selected, else set the opposite button
		boldSelected = false;
	}
});

italic.addEventListener('click', () => {
	italic.classList.toggle('italic-selected');
	if (italic.classList.contains('italic-selected')) { // if the button is gray, so if it's selected
		italicSelected = true;
		if (!firstSelected) firstSelected = 'italic';
		createItalicTag(); // create italic tag and set the caret in it
	} else { // if the button is white, not selected

		deselected = 'italic';
		checkAndSetCaretPosition(); // set caret in the parent

		firstSelected = (firstSelected === 'italic' && !boldSelected) ? null : 'bold'; // set to null if only the italic is selected, else set the opposite button
		italicSelected = false;
	}
});

function createBoldTag() {
	let strongEl = document.createElement('strong');
	strongEl.innerHTML = blankChar;

	/**  
	 selection().anchorNode === span ---- means the span itself is selected
	 selection().anchorNode.parentElement === span ---- means the text in the span is selected
	*/
	if (selection().anchorNode === span || selection().anchorNode.parentElement === span) {
		span.appendChild(strongEl);
		setCaretInStyledTag(strongEl);
		strongEl.focus();
		return;
	} 
	
	if (selection().anchorNode.parentElement.localName === 'em') {
		let parent = window.getSelection().anchorNode.parentElement;
		parent.appendChild(strongEl);
		setCaretInStyledTag(strongEl);
		strongEl.focus();
		return;
	}
}


function createItalicTag() {
	let italicEl = document.createElement('em');
	italicEl.innerHTML = blankChar;

	/**  
	 selection().anchorNode === span ---- means the span itself is selected
	 selection().anchorNode.parentElement === span ---- means the text in the span is selected
	*/
	if (selection().anchorNode === span || selection().anchorNode.parentElement === span) {
		span.appendChild(italicEl);
		setCaretInStyledTag(italicEl);
		italicEl.focus();
		return;
	} 
	
	if (selection().anchorNode.parentElement.localName === 'strong') {
		let parent = window.getSelection().anchorNode.parentElement;
		parent.appendChild(italicEl);
		setCaretInStyledTag(italicEl);
		italicEl.focus();
		return;
	}
}

function setCaretInStyledTag(element) {
	element.focus();
	let range = document.createRange();
	let selection = window.getSelection();
	range.selectNodeContents(element);
	range.collapse(false);
	range.setStart(element.childNodes[0], 1);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}

function setCaretAtEnd(element) {
	element.focus();
	element.innerHTML += blankChar;
	let range = document.createRange();
	let selection = window.getSelection();
	range.selectNodeContents(element);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
}

function checkAndSetCaretPosition() {
	
	// 1. only bold was selected
	if (deselected === 'bold' && !italicSelected) {
		setCaretAtEnd(span);
		return;
	}

	// 2. only italic was selected
	if (deselected === 'italic' && !boldSelected) {
		setCaretAtEnd(span);
		return;
	}
	
	// 3. bold was deselected inside first-selected italic
	if (firstSelected === 'italic' && deselected === 'bold') {
		let parentItalic = selection().anchorNode.parentElement.parentElement;
		setCaretAtEnd(parentItalic);
		return;
	}

	// 4. italic was deselected inside first-selected bold
	if (firstSelected === 'bold' && deselected === 'italic') {
		let parentBold = selection().anchorNode.parentElement.parentElement;
		setCaretAtEnd(parentBold);
		return;
	}

	// 5. bold was first selected, the italic is still selected but the bold was deselected
	if (firstSelected === 'bold' && italicSelected && deselected === 'bold') {
		setCaretAtEnd(span);
		createItalicTag();
		return;
	}

	// 6. italic was first selected, the bold is still selected but the italic was deselected
	if (firstSelected === 'italic' && boldSelected && deselected === 'italic') {
		setCaretAtEnd(span);
		createBoldTag();
		return;
	}
}

/* setInterval(() => {
	console.clear();
	console.log("First selected:", firstSelected);
	console.log("Bold selected:", boldSelected);
	console.log("Italic selected:", italicSelected);
	// console.log("Last selected:", lastSelected)
}, 1000) */