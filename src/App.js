import React, { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import { TreeNode, TreeNodeDatum, EmptyNodeDatum } from './objects';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [wordCount, setWordCount] = useState(null);
  const [translate, setTranslate] = useState(null);
  const [treeNodes, setTreeNodes] = useState(null);
  const [isBalanced, setIsBalanced] = useState(false);
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
    if (node == null) {
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
    if (node == null) {
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
    if (node != null) {
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
    setTreeNodes(root);

    const data = generateJsonData(root);
    setTreeData(data);
  }

  const getInorderNodes = (root, nodes) => {
    if (root == null) {
      return;
    }

    getInorderNodes(root.left, nodes);
    nodes.push(root);
    getInorderNodes(root.right, nodes);
  }

  const buildBST = (nodes, start, end) => {
    if (start > end) {
      return null;
    }

    let mid = parseInt((start + end) / 2, 10);
    let node = nodes[mid];

    node.left = buildBST(nodes, start, mid - 1);
    node.right = buildBST(nodes, mid + 1, end);

    return node;
  }

  // Balance the tree by using inorder traversal on nodes and then binary search
  const balanceTree = (root) => {
    let nodes = [];
    getInorderNodes(root, nodes);

    const newRoot = buildBST(nodes, 0, nodes.length - 1);

    setIsBalanced(true);
    return generateJsonData(newRoot);
  }

  const handleGenerateBtnClick = () => {
    const { value } = textareaRef.current;
    const { width, height } = treeWrapperRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: height / 4 });

    if (isBalanced) {
      setIsBalanced(false);
    }

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

  const handleBalanceBtnClick = () => {
    if (isBalanced) {
      return;
    }
    setTreeData(balanceTree(treeNodes));
  }

  return (
    <div className="App">
      <div className="inputbox">
        <label htmlFor="textarea" className="textareaLabel">Paste/enter text here:</label>
        <textarea id="textarea" ref={textareaRef} />
      </div>
      <button className="generateButton" onClick={handleGenerateBtnClick}>Generate</button>
      <button className="balanceButton" disabled={!treeData} onClick={handleBalanceBtnClick}>Balance</button>
      <div className="wordCountLabel">
        {!!wordCount ? <span>Total words: {wordCount}</span> : null}
      </div>
      <div id="treeWrapper" style={{ width: "100%", height: "100vh" }} ref={treeWrapperRef}>
        {
          treeData ? (
            <Tree
              data={treeData}
              orientation="vertical"
              pathFunc="straight"
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
