# pluck-stream
> Pluck a property (or properties) from a JSON stream

```sh
$ npm install --save pluck-stream
```
```js
var pluck = require('pluck-stream')
var rs = fs.createReadStream('./package.json')

pluck(rs, 'version', function (err, version) {
  // version = 1.0.0
})
```

Pluck can also emit events as they are parsed. Just leave out the callback.

```js
pluck(res, 'version').on('version', function (version) {
  // version = 1.0.0
})
```

This module wraps [JSONStream](https://gitnpm.com/jsonstream) simply to avoid some of the plumbing.

#### pluck(stream, properties, [callback])

##### stream

- Type: `Stream`

The source stream to pluck properties from.

##### properties

- Type: `String`, `String[]`

The accepted notation is the same as documented [JSONStream.parse](https://github.com/dominictarr/JSONStream/blob/b89b855ffa3c88693cf28dc5dae6311842dd3acf/readme.markdown#jsonstreamparsepath).

##### callback(err, results)

- Type: `Function`
- Optional

If a callback is provided, when the stream is ended, the callback is executed with the following parameters.

If a callback is not provided, [`pluck.stream`](#stream) is automatically engaged.

###### callback.err

- Type: `?Error`

An error that ocurred while parsing the stream. Errors on the source stream need to be listened to independently.

###### callback.results

- Type: `*`

If multiple `properties` were provided, this is a hash of property key -> parsed value. If a single property was given, this is just the value.

<a name="stream"></a>
#### pluck.stream(properties...)

- Type: `Function`
- Returns: `Stream`

Use this function to get multiple results as they arrive. Events are emitted under the same name as the given property string.

```js
var pluck = require('pluck-stream')
var rs = fs.createReadStream('./package.json')

rs.pipe(pluck.stream('version'))
  .on('version', function(version) {
    // version = 1.0.0
  })
```

##### properties...

- Type: `String`, `String[]`

All arguments are combined into an array of property strings to parse. The accepted notation is the same as documented [JSONStream.parse](https://github.com/dominictarr/JSONStream/blob/b89b855ffa3c88693cf28dc5dae6311842dd3acf/readme.markdown#jsonstreamparsepath).


