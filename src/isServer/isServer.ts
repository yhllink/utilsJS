// 判断当前运行环境是否为Node.js环境
// 在Node.js环境中，window对象是未定义的，而在浏览器环境中，window对象是全局可用的
// 通过判断window对象是否定义，可以确定代码是在哪个环境下运行
// 这种方法常用于在需要区分运行环境的情况下，进行条件加载或功能实现的适配
export default typeof window === 'undefined'
