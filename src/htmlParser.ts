class ElementObject {
  tag: string
  selfClose: boolean
  attributes?: {
    [key: string]: string | number | object
  }
  text?: string
  children: ElementObject[]

  constructor(element: Element) {
    // 标签类型
    this.tag = element.tagName

    // 自闭合和子标签
    const nodeList = element.children
    if (nodeList && nodeList.length) {
      this.selfClose = false
      const children: ElementObject[] = []
      for (let i = 0; i < nodeList.length; i++) {
        children.push(new ElementObject(nodeList[i]))
      }
      this.children = children
    } else {
      this.children = []

      // 自闭合检测有问题，outerHTML出来默认是有闭合标签的，自闭合也会变成非自闭合。
      if (element.outerHTML.charAt(element.outerHTML.length - 2) === '/') this.selfClose = true
      else this.selfClose = false
    }
    // 属性检测
    if (element.hasAttributes()) {
      const attrs = element.attributes
      this.attributes = {}
      for (let i = 0; i < attrs.length; i++) {
        this.attributes[attrs[i].name] = attrs[i].value
      }
    }
  }
}

const e = new DOMParser()
const doc = e.parseFromString('<div id="main" data-x="hello">Hello<span id="sub" /></div>', 'text/html').getElementsByTagName('body')[0].children[0]

const obj = new ElementObject(doc)
console.log(obj)