This tool will create an archive of your package similar to `npm pack`, but will generate a zip file instead of a tarball.

It is designed to help you deploy NPM packages to AWS Lambda.

This project uses the npm-packlist project to build up the list of files to include and all bundle dependencies. Check out their [documentation](https://www.npmjs.com/package/npm-packlist) on how to exclude files from the archive. 

## Installation

`npm install --save-dev @bubuntux/lambda-pack`

## Example

_my-lambda_ is an npm package I want to run as an AWS Lambda Function.

Install _pack-zip_ locally in _my-lambda_
```
npm install --save-dev @bubuntux/lambda-pack
```

Install any runtime dependencies of _my-lambda_.
```
npm install
```

Modify _my-lambda/package.json_:
```
"scripts": {
    "pack": "lambda-pack"
    ...
}
```

Create the .zip file containing _my-lambda_ and its dependencies, ready to upload to AWS Lambda
```
npm run pack
```

## Creating a layer

Using the argument `--layer` the zip will have the following structure

```
 package.zip 
    - nodejs
        -node_modules
            ... (bundledDependencies)
            package/
                index.js
                package.json
                ...
```
