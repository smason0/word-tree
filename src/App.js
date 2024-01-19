import React, { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import './App.css';

class TreeNode {
  constructor(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class TreeNodeDatum {
  constructor(name) {
    this.name = name;
  }

  children = [];
}

class EmptyNodeDatum extends TreeNodeDatum {
  constructor() {
    super();
    this.name = '';
  }
}

function App() {
  const [treeData, setTreeData] = useState(null);
  const [wordCount, setWordCount] = useState(null);
  const [translate, setTranslate] = useState(null);
  const textareaRef = useRef();
  const treeWrapperRef = useRef();
  const wordMap = new Map();

  const updateWordMap = (value) => {
    if (!wordMap.has(value)) {
      wordMap.set(value, 1);
    } else {
      let currentCount = wordMap.get(value);
      wordMap.set(value, currentCount + 1);
    }
  }

  const insertNode = (node, value) => {
    if (!node) {
      updateWordMap(value);
      return new TreeNode(value);
    }

    if (value > node.val) {
      node.right = insertNode(node.right, value);
    } else if (value < node.val) {
      node.left = insertNode(node.left, value);
    } else {
      updateWordMap(value);
    }

    return node;
  }

  const insertDatum = (node) => {
    if (!node) {
      return new EmptyNodeDatum();
    }
    let count = wordMap.get(node.val);
    let datum = new TreeNodeDatum(count > 1 ? `${node.val} (${count})` : node.val);
    datum.children.push(insertDatum(node.left));
    datum.children.push(insertDatum(node.right));

    return datum;
  }

  const generateJsonData = (node) => {
    let root;
    if (node) {
      root = new TreeNodeDatum(node.val);
    }

    let data = insertDatum(node, root);
    
    return data;
  }

  const generateTree = (node, wordList) => {
    if (!wordList.length) {
      return node;
    }

    let root;
    for (let word of wordList) {
      root = insertNode(node, word);
    }

    const data = generateJsonData(root);
    setTreeData(data);
  }

  const handleGenerateBtnClick = () => {
    const { value } = textareaRef.current;
    const { width, height } = treeWrapperRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: height / 4 });

    if (!value) {
      setWordCount(null);
      setTreeData(null);
      return;
    }

    const wordList = [...value.match(/\b(\w+)'?(\w+)?\b/g)].map((word) => word.toUpperCase());
    setWordCount(wordList.length);
    const rootNode = new TreeNode(wordList[0]);
    generateTree(rootNode, wordList);
  }

  return (
    <div className="App">
      <div className="inputbox">
        <label htmlFor="textarea" className="textareaLabel">Paste/enter text here:</label>
        <textarea id="textarea" ref={textareaRef} />
      </div>
      <button className="generateButton" onClick={handleGenerateBtnClick}>Generate</button>
      <div>
        {!!wordCount ? <span>Total words: {wordCount}</span> : null}
      </div>
      <div id="treeWrapper" style={{ width: '100%', height: '100vh' }} ref={treeWrapperRef}>
        {
          treeData ? (
            <Tree
              data={treeData}
              orientation='vertical'
              pathFunc='straight'
              separation={{ siblings: 1, nonSiblings: 1 }}
              translate={translate}
            />
          ) : null
        }
      </div>
    </div>
  );
}

export default App;
