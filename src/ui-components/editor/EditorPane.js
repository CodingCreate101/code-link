import React, { useState, useContext, useEffect } from 'react';
import Gutter from './Gutter';
import { ThemeContext } from '../../theme/theme-context'
import TextEditor from './TextEditor';
import PluginReader from '../../lexer/PluginReader';
import Chopstring from '../../lexer/chopstring';

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
        value: "function triple(param1: String) {\n    const x = 101 + param1\n}",
        tokens: [],
        selectionStart: 0,
        selectionEnd: 0
    })

    /**
     * Plugin reader to parse the language plugin.
     */
    const pluginReader = PluginReader()

    /**
     * Tokeniser library chopstring.js
     */
    const chopstring = Chopstring()

    /**
     * Read the current selected language plugin to parse the text.
     */
    useEffect(() => {
        // read the js plugin,
        pluginReader.readPlugin('./src/lexer/language-plugins/javascript-plugin.json')
            .then(result => {
                console.log(result)
                const tokens = chopstring.applyPatterns(textEditor.value, result)
                setTextEditor({
                    plugin: result,
                    value: textEditor.value,
                    tokens: tokens,
                    selectionStart: textEditor.selectionStart,
                    selectionEnd: textEditor.selectionEnd
                })
            })
            .catch(error => {
                console.log(error)
            })
    },
    [])

    /**
     * Handles the text area change event setting it to state.
     * @param {React.SyntheticEvent} event JSX event.
     */
    function onChange(event) {
        const tokens = chopstring.applyPatterns(event.currentTarget.value, textEditor.plugin)
        setTextEditor({
            plugin: textEditor.plugin,
            value: event.currentTarget.value,
            tokens: tokens,
            selectionStart: textEditor.selectionStart,
            selectionEnd: textEditor.selectionEnd
        })
    }

    return (
        <div className="editor-pane">
            {/* Pass the text value to the gutter. */}
            <Gutter text={textEditor.value}/>
            <TextEditor textEditor={textEditor}
                onChange={onChange}/>
        </div>
    )
}