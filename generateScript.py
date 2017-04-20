import json
import tempfile
import os
from subprocess import call

f = open("generated.py", 'a')

def initializeScript(browser_type):

    template = """
driver = webdriver.{0}()
browser = Browser(driver)
"""
    print(template.format(browser_type), file=f)
    
    
def handleClick(selector):

    print("browser.click('{0}')".format(selector), file=f)


def handleExists(selector):

    print("browser.exists('{0}')".format(selector), file=f)

def handleDoesNotExist(selector):

    print("browser.doesNotExist('{0}')".format(selector), file=f)

def handleNavigateToUrl(url):

    print("driver.get('{0}')".format(url), file=f)

    
def processEvent(event):

    action = event['action']
    
    if action == "click":
        
        handleClick(event['selector'])

    elif action == "exists":

        handleExists(event['selector'])

    elif action == "does not exist":

        handleDoesNotExist(event['selector'])
        
    elif action == "navigate to url":

        handleNavigateToUrl(event['url'])
        
    else:

        return

def main():

    with open('example.json') as data_file:
        data = json.load(data_file)

    initializeScript(data['browser_type'])
        
    timeline = data['input']
    for event in timeline:
        generated_code = processEvent(event)

    f.close()
        
    call(['./concat.sh'])

    os.remove('./generated.py')

if __name__ == "__main__":
    main()
    
