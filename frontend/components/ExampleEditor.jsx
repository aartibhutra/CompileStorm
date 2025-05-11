import Editor from '@monaco-editor/react'

export const ExampleEditor = () => {
    const handleEditorChange = (value, event) => {
        console.log("Editor content :", value)
    }

    return(
        <Editor
        height="500px"
        defaultLanguage="javascript"
        defaultValue="// type your code here"
        onChange={handleEditorChange}
        theme="vs-dark"
        />
    )
}