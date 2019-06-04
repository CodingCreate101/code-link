import React, { useState, useContext, useEffect } from 'react';
import Gutter from './gutter/Gutter';
import { ThemeContext } from '../../theme/theme-context'
import TextEditor from './TextEditor';
import PluginReader from '../../lexer/PluginReader';
import Chopstring from '../../lexer/chopstring';
import Line from './Line';

/**
 * Editor window handling text input and displaying code text. Displays a code editor
 * and a gutter to the left hand side for code editing functionality.
 * @see TextEditor
 * @see Gutter
 */
export default function EditorPane() {

    /**
     * The App-wide context reference.
     * @see ThemeContext
     * @see useContext
     */
    const [theme, setTheme] = useContext(ThemeContext)

    /**
     * Text area editText state object stores the current value and the
     * selection range of the text.
     * @see useState
     */
    const [textEditor, setTextEditor] = useState({
        plugin: {},
        lines: []
    })

    /**
     * Read the current selected language plugin to parse the text.
     */
    useEffect(() => {
        console.log('Startup Editor Pane. Reading plugin...')

        /**
         * Tokeniser library chopstring.js
         */
        const chopstring = Chopstring()
        
        /**
         * Plugin reader to parse the language plugin.
         */
        const pluginReader = PluginReader()

        // read the js plugin,
        pluginReader.readPlugin('./src/lexer/language-plugins/javascript-plugin.json')
            .then(result => {
                console.log(result)
                const lines = chopstring.splitLines('// A comment "has been" made\nfunction \'But lwhayyy\' triple(param1: String) { // and why not?\n    const x = 101 +param1 + \'Hey \\\' now \'+  `Dont do it` // A comment + 42;\n    "Why tho?"\n}')
                // set the text editor state,
                setTextEditor({
                    plugin: result,
                    lines: lines
                })
            })
            .catch(error => {
                console.log(error)
            })
    },
    [])

    /**
     * Handles the text area text change from the text editor.
     * @param event 
     */
    function onTextChange(event: React.SyntheticEvent) {
        /**
         * Tokeniser library chopstring.js
         */
        const chopstring = Chopstring()
        
        const lines = chopstring.splitLines(event.currentTarget.value)
        // set the text editor state,
        setTextEditor({
            plugin: textEditor.plugin,
            lines: lines
        })
    }

    return (
        <div className="editor-pane">
            {/* Pass the text value to the gutter. */}
            <Gutter lines={textEditor.lines}/>
            <TextEditor onTextChange={onTextChange} textEditor={textEditor}/>
        </div>
    )
}