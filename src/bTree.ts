class TreeNode {
  val: string | number
  left: TreeNode | null
  right: TreeNode | null

  constructor(val: string | number) {
    this.val = val
    this.left = this.right = null
  }
}

const compare = (t1: TreeNode | null, t2: TreeNode | null): boolean => {
  if (t1 === null || t2 === null) {
    return t1 === t2
  }
  if (t1.val !== t2.val) {
    return false
  }
  return compare(t1.left, t2.left) && compare(t1.right, t2.right)
}
