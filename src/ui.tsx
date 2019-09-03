import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

declare function require(path: string): any;

type Props = {};
type States = {
    nameList: { family: string; styles: string[] }[];
    pinnedFont: { family: string; styles: string[] };
};

class App extends React.Component<Props, States> {
    constructor(props) {
        super(props);
        this.fetchFontList();
        this.state = { nameList: [], pinnedFont: { family: '', styles: [] } };
    }

    fetchFontList() {
        parent.postMessage({ pluginMessage: { type: 'name' } }, '*');
    }

    sendFont(font) {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'change',
                    fontFamily: font.family,
                    fontStyles: font.styles,
                },
            },
            '*'
        );
    }

    pinFont(font) {
        this.setState({ pinnedFont: font });
        console.log(this.state.pinnedFont);
    }

    sendPinnedFont() {
        const { family, styles } = this.state.pinnedFont;
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'change',
                    fontFamily: family,
                    fontStyles: styles,
                },
            },
            '*'
        );
    }

    closePlugin() {
        parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
    }

    render() {
        onmessage = event => {
            const { pluginMessage } = event.data.pluginMessage;
            switch (pluginMessage.type) {
                case 'nameList':
                    const { fontList } = pluginMessage.data;
                    const nameList = fontList.map(font => {
                        return (
                            <li
                                key={font.family}
                                className="selector-font"
                                onMouseOver={() => this.sendFont(font)}
                                onClick={e => {
                                    this.pinFont(font);
                                }}
                            >
                                {font.family}
                            </li>
                        );
                    });
                    this.setState({ nameList });
                    break;
            }
        };
        return (
            <div>
                <div className="main-container">
                    <div className="nav-container">
                        <div className="nav-menu-wrapper">
                            <div id="name" className="nav-menu">
                                Name
                            </div>
                            <div id="style" className="nav-menu">
                                Style
                            </div>
                            <div id="size" className="nav-menu">
                                Size
                            </div>
                        </div>
                        <button
                            className="btn-apply"
                            onClick={() => {
                                this.closePlugin();
                            }}
                        >
                            Apply
                        </button>
                    </div>
                    <div className="selector-container">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={e => {
                                    console.log(e.target.value);
                                }}
                            />
                        </div>
                        <ul
                            onMouseOut={() => {
                                this.sendPinnedFont();
                            }}
                        >
                            {this.state.nameList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-page'));
