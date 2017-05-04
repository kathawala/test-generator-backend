# test-generator-backend
Backend work for an automatic Selenium Webdriver test generator

## How to Use

### Step 1: Clone the repo and make a virtualenv for this project.

Run the following commands

```
$ git clone https://github.com/kathawala/test-generator-backend.git
$ cd test-generator-backend
$ pip install virtualenvwrapper
...
$ export WORKON_HOME=~/Envs
$ mkdir -p $WORKON_HOME
$ source /usr/local/bin/virtualenvwrapper.sh
$ mkvirtualenv generator
```

Now you have a virtualenv for this project.
When you enter the `test-generator-backend` directory,
you should run the following command before starting work:

```
workon generator
```

And run this command when you're done:

```
deactivate
```

### Step 2: Install requirements

Run the following commands

```
$ pip install -r requirements.txt
```

### Step 3: Code! Run tests! Launch the server!

To launch the server do the following:

```
$ cd webapp
$ export FLASK_APP=app.py
$ flask run
```

To send a test request to the newly launched server, do the following from the root directory of the project:

```
$ python test.py
```

## API

The backend accepts JSON submitted in a POST request to the /generate URL.

In other words, if the application's URL is `www.example.com` then the JSON
should be posted to `www.example.com/generate`.

### Setup

A valid JSON request will be styled as follows

```Javascript
{
  "browser_type": "Firefox",
  "input": [
  	   // actions go in this array
  ]
}
```

Sending the `browser_type` variable is necessary. Then, for every action
which needs to be generated, make the appropriate object for that action
and insert it into the array. The order of the actions in the array is the order
of execution of the generated program.

### Actions

#### `click`

```Javascript
{
    "selector": "div.feature-byline",
    "action": "click"
}
 
```

#### `exists`

```Javascript
{
    "selector": "div.feature-byline",
    "action": "exists"
}
```

#### `does not exist`

```Javascript
{
    "selector": "div.nonexistent-class",
    "action": "does not exist"
}
```

#### `navigate to url`

```Javascript
{
    "action": "navigate to url",
    "url": "https://www.poetryfoundation.org/"
}
```
### Full Example

Looking at `example.json` should give you a full working example.