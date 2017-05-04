def initializeScript(browser_type):
    
    template = """
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
class Browser:
    def __init__(self, driver):
        self.driver = driver
    def exists(self, selector):
        try:
            elem = self.driver.find_element_by_css_selector(selector)
        except NoSuchElementException:
            print ("ERROR: Action('exists') | Couldn't find element(s) specified by CSS selector: {x}".format(x=selector))
    def doesNotExist(self, selector):
        try:
            elem = self.driver.find_element_by_css_selector(selector)
            print ("ERROR: Action('does not exist') | Did find element specified by CSS selector: {x}".format(x=selector))
            print(elem)
        except NoSuchElementException:
            pass
    def send(self, selector, value):
        elems = self.driver.find_elements_by_css_selector(selector)
        if not elems:
            print ("ERROR: Action('send') | Couldn't find element(s) specified by CSS selector: {x}".format(x=selector))
        for elem in elems:
            elem.send_keys(value)
    def click(self, selector):
        elems = self.driver.find_elements_by_css_selector(selector)
        if not elems:
            print ("ERROR: Action('click') | Couldn't find element(s) specified by CSS selector: {x}".format(x=selector))
        for elem in elems:
            elem.click()
    def clear(self, selector):
        elems = self.driver.find_elements_by_css_selector(selector)
        if not elems:
            print ("ERROR: Action('clear') | Couldn't find element(s) specified by CSS selector: {x}".format(x=selector))
        for elem in elems:
            elem.clear()
"""
    
    browser_init = """
driver = webdriver.{0}()
browser = Browser(driver)
"""
    return (template + browser_init.format(browser_type))
    
    
def handleClick(selector):

    return "browser.click('{0}')\n".format(selector)


def handleExists(selector):

    return "browser.exists('{0}')\n".format(selector)

def handleDoesNotExist(selector):

    return "browser.doesNotExist('{0}')\n".format(selector)

def handleNavigateToUrl(url):

    if not url.startswith('http'):
        url = "http://" + url
    
    return "driver.get('{0}')\n".format(url)

def handleSend(selector, value):

    return "browser.send('{0}', '{1}')\n".format(selector, value)

    
def processEvent(event):

    action = event['action']
    
    if action == "click":
        
        return handleClick(event['selector'])

    elif action == "send":

        return handleSend(event['selector'], event['value'])
    
    elif action == "exists":

        return handleExists(event['selector'])

    elif action == "does not exist":

        return handleDoesNotExist(event['selector'])
        
    elif action == "navigate to url":

        return handleNavigateToUrl(event['url'])
        
    else:

        return

def generateScript(data):
    
    output = initializeScript(data['browser_type'])

    timeline = data['actions']
    for event in timeline:
        output = output + processEvent(event)

    return output

# if __name__ == "__main__":
    # generateScript()
    
