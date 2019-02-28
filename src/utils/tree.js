export function treeSelectNormalizer ({id = 'id', label = 'label', children = 'children'}) {
  return (node) => {
    return {
      id: node[id],
      label: node[label],
      children: node[children]
    }
  }
}

export function setTreeDisable (id, tree) {
  tree.forEach(item => {
    if (item.id === id) {
      item.isDisabled = true
    } else if (item.children && item.children.length) {
      setTreeDisable(id, item.children)
    }
  })
}
