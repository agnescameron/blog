---
layout: post
title:  "netlify / airtable tutorial"
date:  2020-06-01
description: how to make a free, secure CMS with airtable and netlify
tags: CMS, tutorial
status: draft
---

A while back, set up for airtable and Netlify for FO website. Neat cause you don't have to pay for hosting, a nice CMS solution for people who want something simple cheap easy to maintain.

However not much good documentation online: working from these 2 tutorials but both quite patchy and poorly explained. Having gone through process with a few people now I thought it would be nice to have a document to share.

### process

```
npm install --save netlify netlify-lambda node-fetch npm-run-all
```

change `package.json`
replace start with 
```
"scripts" {
	"start": "npm-run-all --parallel start:app start:server",
	"start:app": "react-scripts start",
	"start:server": "netlify-lambda serve ./lambda",
	"build": "run-p build:**",
	"build:app": "react-scripts build",
	"build:lambda": "netlify-lambda build ./lambda"
}
```
add to top level of object, under name

```
  "proxy": "http://localhost:9000",
```

Next, create a file called `netlify.toml` in the top level of the folder, and add in the following information. This will tell netlify where to look for your functions once they're built.

```
[build]
	functions = "functions/"
	publish = "build/"
	command = "npm run build"
```

Now, add to the `.gitignore`:

```
	#netlify ignore
	functions/
	build/
```


add to the lambda function file (e.g. ./lambda/fetch.js)

```
	import fetch from 'node-fetch';
		const process_api_key = process.env.AIRTABLE_API_KEY;
		const MAX_RECORDS = 50;
		exports.handler = async (event) => {
		  // Retrive type of http method
		  const { httpMethod } = event;
		  if (httpMethod === 'GET') {
			const response = await fetch(`https://api.airtable.com/v0/app379cZrnZxEWyFK/Recipes?maxRecords=${MAX_RECORDS}&view=Grid%20view`, {
		 	"headers": {"Authorization": `Bearer ${process_api_key}`} })
		 	const data = await response.text();
			return { statusCode: 200, body: data };
		  }
		  return { statusCode: 404 };
		}
```

add `_redirects` file to the `public/` directory which contains the line:

	'/*    /index.html   200'

This part I really am not too sure on why it's necessary, but it enables the proxy to work once you're on Netlify.

Now, try running `npm run start` to check that it builds, and push to git.

Sometimes, the line `import fetch from 'node-fetch';` causes issues with directory trees. In order to resolve this, you need to create a `.env`

Now: get API key from Airtable
edit bash profile (run `'open ~/.bash_profile'`)
add to bash profile something like

```
	#Airtable Lambda Key
	export AIRTABLE_API_KEY="thekeyfromairtable"
```

quit and restart terminal to refresh the bash stuff, or run `source ~/.bash_profile` inside the terminal that you'd like to start from.

make sure fetch.js refers to
	... process.env.YOUR_BASH_API_KEY_NAME
and it is fetching the correct API url to your airtable
run the server 'npm run start' and try

```
curl 'http://localhost:9000/.netlify/functions/fetch'
```

This should print the contents of the airtable to your command line.