# import-esm-directory

* require es-module directory when use ts in node environment
* notice: use with ts in node env !! (ts module can use es-module directly.)
* if useful, could you please give me a start on github.

## fast use

* directory eg:

```bash
root
|——main.ts
└——router
    |———index.ts
    │———user.ts
    └———message
         |——— news
         |     |———list.ts
         |     └———today
         |          └———newsToday.ts
         └———show.ts
```

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
    console.log(esmDirectory.user);
    console.log(esmDirectory.message.news.list);
    console.log(esmDirectory.message.news.today.newsToday);
})
```
