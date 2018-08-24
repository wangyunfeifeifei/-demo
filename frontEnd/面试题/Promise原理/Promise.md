# Promise原理基础
## Promise是什么
Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。主流的规范是Promise/A+。  
Promise叫通常的回调、事件/消息，在处理异步操作时有显著的优势。其中最为重要的一点是：Promise在语义上代表了异步操作的主体。这种准确、清晰的定位极大推动了它在编程中的普及，因为具有单一职责，而且将分内事做到机制的事物总是具有病毒式的传染力。分离输入输出参数、错误冒泡、串行/并行控制流等特性都成为Promise横扫异步操作编程领域的重要筹码,以及ES6都将其收录，并在Chrome、Firefox等现代浏览器中实现。
## 内部机制
本文有以下约定：
+ Promise：代表由Promise/A+规范定义的异步操作封装方式
+ promise: 代表一个Promise实例

## 基础实现
实例： 通过异步请求获取用户id, 然后做一些处理。  
在平时大家都是习惯用回调或者事件来处理，下面看Promise的处理方式
```js
function getUserId() {
    return new Promise(function (resolve) {
        // 异步请求
        Y.io('/userid', {
            on: {
                success: function(id, res) {
                    resolve(JSON.parse()res).id
                }
            }
        })
    })
}

getUserId().then(funtion(id) {
    // do sth with id 
})
```
`getUserId`方法返回一个promise, 可以通过它的`then`方法注册在promise异步操作成功时执行的回调。自然、表意的API，用起来十分顺手。  
满足这样一种使用场景的Promise是如何构建的呢？其实并不复杂， 下面给出最基础的实现：
```js
function Promise(fn) {
    var value = null,
        deferreds = [];
    
    this.then = function (onFulfilled) {
        deferreds.push(onFulfilled);
    }

    functino resolve(value) {
        deferreds.forEach(funciton(deferred) {
            deferred(value)
        })
    }

    fn(resolve)
}
```
代码简短，逻辑也很简单
+ 调用`then`方法，将想要在Promise异步操作成功时执行的回调放入`deferreds`队列；
+ 创建Promise实例时传入函数被赋予一个函数类型的参数，即`resolve`，用以在合适的时机触发异步操作成功。真正执行的操作是将`deferreds`队列中的回调一一执行
+ resolve接收一个参数，即异步操作返回的结果，方便回调使用

有时需要使用多个回调如果能支持jQuery那样的链式操作就好了，这非常容易实现
```js
    this.then = function (onFulfilled) {
        deferreds.push(onFulfilled);
        return this
    }
```
# 待续...