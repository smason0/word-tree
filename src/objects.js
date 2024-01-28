class TreeNode {
  constructor(val, left, right) {
    this.val = (val !== undefined) ? val : null;
    this.left = (left !== undefined) ? left : null;
    this.right = (right !== undefined) ? right : null;
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

export {
  TreeNode,
  TreeNodeDatum,
  EmptyNodeDatum,
};
