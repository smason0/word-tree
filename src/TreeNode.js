import React from 'react';

function TreeNode(props) {
    const { val, leftNode, rightNode } = props;

    return (
        <div>
            <p>{val}</p>
        </div>
    )
}

TreeNode.defaultProps = {
    val: null,
    leftNode: null,
    rightNode: null,
}

export default TreeNode;
