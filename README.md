# Novel API
This API makes requests to m.wuxiaworld.co, a novel indexer, and returns the data you want. Every request, except the update featured route, is made in runtime, so the original server is not overloaded with requests.

## Routes

### /filter
#### Request Body: 

```
{ 
  "novel": "Martial God Asura" 
}
```

##### Request type: ```String```

Filters both title and author of a novel, returning matches.

### /list
#### Request Body: 

```
{ 
  "page": 1 
}
```

##### Request Type: ```Number```
Lists novels from the database. Returns 10 items per page.

### /list/chapters
#### Request Body: 

```
{ 
   "link": "/A-Record-of-a-Mortal’s-Journey-to-Immortality/" 
} 
```

##### Request Type: ```String```
Lists all chapters of a given novel.

### /list/featured
#### Request Body: 

```
{}
```

##### Request Type: ```Null```
Returns all weekly featured novels.

### /chapter/content
#### Request Body: 
``` 
{ 
  "link": "/A-Record-of-a-Mortal’s-Journey-to-Immortality/", 
  "chapter": "3002024.html" 
}
 ```
##### Request type: ```String```
Returns all weekly featured novels.

### /get/novel
#### Request Body: 
``` 
{ 
  "link": "/A-Record-of-a-Mortal’s-Journey-to-Immortality/"
}
 ```
##### Request type: ```String```
Returns data from specified novel
