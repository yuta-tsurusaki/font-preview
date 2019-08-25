async function initData() {
    let fontList = [];
    let fontNames = [];
    let availableFontNames = [];
    const availableFonts = await figma.listAvailableFontsAsync();
    for (let font of availableFonts) {
        availableFontNames.push(
            font.fontName.family + ' ' + font.fontName.style
        );
        if (fontNames.includes(font.fontName.family)) {
            const index = fontNames.indexOf(font.fontName.family);
			fontList[index].styles.push(font.fontName.style);
        } else {
            fontNames.push(font.fontName.family);
            fontList.push({
                name: font.fontName.family,
                styles: [font.fontName.style],
            });
        }
    }

    return { availableFontNames, fontList };
}

initData().then(data => {
	figma.showUI(__html__, { width: 320, height: 480 });
	const { availableFontNames, fontList } = data;
    figma.ui.onmessage = pluginMessage => {
        switch (pluginMessage.type) {
            case 'name':
				figma.ui.postMessage({ pluginMessage: { type: 'nameList', data: { fontList }}})
                break;
            case 'style':
                break;
            case 'size':
                break;
        }
    };
});
