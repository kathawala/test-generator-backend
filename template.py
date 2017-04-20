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
