async function initData() {
	const selection = figma.currentPage.selection;
	if (selection.length == 0 || selection[0].type != 'TEXT') {
		alert('Please select a text node')
		figma.closePlugin()
	}
	let fontList = [];
	let fontNames = [];
	const availableFonts = await figma.listAvailableFontsAsync();
	availableFonts.forEach(font => {
		const { family, style } = font.fontName
		if (fontNames.includes(family)) {
			const index = fontNames.indexOf(family);
			fontList[index].styles.push(style);
		} else {
			fontNames.push(family);
			fontList.push({
				family,
				styles: [style],
			});
		}
	})

    return { fontList };
}

initData().then(data => {
	figma.showUI(__html__, { width: 320, height: 480 });
	const { fontList } = data;
	const selection = figma.currentPage.selection;
    figma.ui.onmessage = pluginMessage => {
		switch (pluginMessage.type) {
			case 'name':
				figma.ui.postMessage({ pluginMessage: { type: 'nameList', data: { fontList } } })
				break;
			case 'change':
				const text = selection[0] as TextNode;
				const textLength = text.characters.length;
				const { fontFamily, fontStyles } = pluginMessage;
				const fontStyle = fontStyles.includes('Regular') ? 'Regular' : fontStyles[0];
				figma.loadFontAsync({ family: fontFamily, style: fontStyles[0] })
					.then(() => { text.setRangeFontName(0, textLength, { family: fontFamily, style: fontStyle }) })
					.catch(() => { text.setRangeFontName(0, textLength, { family: fontFamily, style: fontStyles[0] }) })
				break;
			default:
				break;
        }
    };
});
