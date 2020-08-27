# import-esm-directory

* 在node的ts环境中使用，ts默认支持es module, 注意环境需要满足两个条件：

  1. node
  
  2. ts(都什么年代了，还不用ts😁,用过不后悔)

* 如果帮助到您，可否在github上赐我一颗 ⭐️小星星 ⭐

## 历史版本

* [version 1.x](https://github.com/pomelott/import-esm-directory/blob/master/v1.md)

## 快速使用

* 例如有如下目录:

```bash
root
|——main.ts
└——router
    |———index.ts
    |———list
    |    |——— listInter
    |    |      └———newList.ts
    |    |——— userList.ts
    |    └——— news.ts
    |———main
    |     └——— mainInter
    |            └——— domain.ts
    └———user
         └——— priority.ts
```

### 使用默认导出方法

* router/index.ts

```ts
import importEsmDirectory from 'import-esm-directory';
export default importEsmDirectory(module);
```

* import the directory in main.ts

```ts
import routerDirectoryPromise from './router';
routerDirectoryPromise.then((esmDirectory) => {
    console.log(esmDirectory);
})
/* output
{
	list: {
		listInter: {
			newlist: [Object]
		},
		news: {},
		userList: {
			index: [Object]
		}
	},
	main: {
		mainInter: {
			domain: [Object]
		}
	},
	user: {
		priority: [Function]
	}
}
*/
```

### 使用多类型module解析方法

* router/index.ts

```ts
import {importParseDirectory} from 'import-esm-directory';
export default importParseDirectory(module);
```

* import the directory in main.ts

```ts
import routerDirectoryPromise from './router';
routerDirectoryPromise.then((esmDirectory) => {
    console.log(esmDirectory)
})
/*  output
{
	deepModule: {
		list: {
			listInter: [Object],
			news: {},
			userList: [Object]
		},
		main: {
			mainInter: [Object]
		},
		user: {
			priority: [Function]
		}
	},
	layerModule: {
		'list/listInter/newlist': {
			name: 'newslist'
		},
		'list/news': {},
		'list/userList': {
			index: [Object]
		},
		'main/mainInter/domain': {
			name: 'domain'
		},
		'user/priority': [Function]
	}
}
*/
```

## 描述

* 在不用的系统上，分割符会有区别，如 windows 上为 `\\`
* 因为是基于es6的动态导出，所以本工具返回一个promise对象
