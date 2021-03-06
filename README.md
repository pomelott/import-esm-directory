# import-esm-directory

import es-module directory conveniently when export es-module in an environment that support es-module.

* [🇨🇳中文文档](https://github.com/pomelott/import-esm-directory/blob/master/CHINESE.md)

&nbsp;
note that the env need to meet two conditions：

  1. node

  2. support es-module (such as ts)

* if useful, could you please give me a ⭐️star⭐ on github.

## history versions

* [version 1.x](https://github.com/pomelott/import-esm-directory/blob/master/v1.md)

## fast use

Notice: this takes typescript as an example.

* directory eg:

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

### use default function

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

### use parse function

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

## description

* for specific example: [koa-ts-node](https://github.com/pomelott/koa-ts-node)
* the separator of path may be different on windows.
* because that this use dynamic import of es6, so the package returns a promise object
