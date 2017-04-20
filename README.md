# test-generator-backend
Backend work for an automatic Selenium Webdriver test generator


## How to Use

Make sure your `python` command is running Python 3. Then just

```bash
python generateScript.py
```

You should find a file called `seleniumtest.py` after running the above command.
You will need Selenium Webdriver and its python bindings installed to run this test, but it should work!
Currently the test returns the following output (on purpose):

```
$ python seleniumtest.py
ERROR: Action('exists') | Couldn't find element(s) specified by CSS selector: div.nonexistent-class
$
```

## Features

Looking at `example.json` should tell you how many actions we support currently.

Right now the generator supports `click`, `exists`, `does not exist`, and `navigate to url` actions.
