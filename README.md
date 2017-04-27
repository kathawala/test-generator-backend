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

## Features

Looking at `example.json` should tell you how many actions we support currently.

Right now the generator supports `click`, `exists`, `does not exist`, and `navigate to url` actions.
