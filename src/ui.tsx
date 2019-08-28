import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

declare function require(path: string): any

type Props = {};
type States = {
    nameList: { family: string, styles: string[] };
};

class App extends React.Component<Props, States> {
    constructor(props) {
        super(props);
        this.fetchFontList()
        this.state = { nameList: {family:'', styles:[]}}
    }

    fetchFontList() {
        parent.postMessage({pluginMessage: { type: 'name' }}, '*');
    }

    changeFont(fontFamily, fontStyles) {
        parent.postMessage({ pluginMessage: {type: 'change', fontFamily, fontStyles}}, '*')
    }

    render() {
        onmessage = event => {
            const {pluginMessage} = event.data.pluginMessage;
            switch(pluginMessage.type) {
                case 'nameList':
                    const {fontList} = pluginMessage.data;
                    const nameList = fontList.map(font => {
                        return (
                            <li key={font.family} className="selector-font" onMouseOver={() => this.changeFont(font.family, font.styles)}>{font.family}</li>
                        )
                    })
                    this.setState({nameList})
                    break;
            }
        }
        return (
            <div>
            <div className="main-container">
                <div className="nav-container">
                    <div className="nav-menu-wrapper">
                        <div id="name" className="nav-menu">Name</div>
                        <div id="style" className="nav-menu">Style</div>
                        <div id="size" className="nav-menu">Size</div>
                    </div>
                    <button className="btn-apply">Apply</button> 
                </div>
                    <div className="selector-container">
                        <ul>
                            {this.state.nameList}
                        </ul>
                    </div>
            </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-page'))