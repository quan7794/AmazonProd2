
import time
import autoit
import yaml
import productManager
import sys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver import Chrome
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options

configFileUrl= "config.yaml"
config = ""


def loadConfigFile(configFileUrl):
    with open(configFileUrl) as f:
        data = yaml.load(f, Loader=yaml.loader.BaseLoader)
        # print(data)
    return data


def uploadImage(driver,imageId, imageUrl,log):
    printLog(log)
    # item = getItemByIdUntilTimeout(browser,imageId,4)# open image upload dialog
    # item.click()
    driver.find_element_by_xpath(imageId).click() # open image upload dialog
    autoit.win_wait_active("Open")
    autoit.control_focus(config["uploadFileTitleName"],"[CLASS:Edit; INSTANCE:1]")
    time.sleep(0.5)
    autoit.control_set_text(config["uploadFileTitleName"],"[CLASS:Edit; INSTANCE:1]",imageUrl)
    # autoit.clip_put(imageUrl)
    # autoit.send("^v")
    time.sleep(float(config["uploadImageDelayTime"]))
    autoit.control_click("Open", "[CLASS:Button; INSTANCE:1]")
    time.sleep(1)
    autoit.win_wait_close("Open")
    
def importOtp(driver,timeout):
    
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        config = loadConfigFile(configFileUrl)
        if(len(config["otp"])) == 6:
            otpInput = getElementByXpathUntilTimeout(driver,config["otpId"],3)
            otpInput.send_keys(config["otp"])
            rememberBrowser = getItemByIdUntilTimeout(driver,config["rememberBrowserId"],3)
            rememberBrowser.click()
            login = getItemByIdUntilTimeout(driver,config["signInOtpButttonId"],3)
            login.click()
            return True
        else: 
            time.sleep(0.5)
    return False
def saveClick(saveButton,product,timeout):
    
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            saveButton.click()
            time.sleep(float(config["saveTimeout"]))
            printLog("Save success")

            return True
        except:
            time.sleep(0.5)
def getElementByXpathUntilTimeout(driver, itemId,timeout):
    item = ""
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item = driver.find_element_by_xpath(itemId)
            # print("geted: ",item)
            return item
        except:
            time.sleep(1)
    return False
def getItemByIdUntilTimeout(driver, itemId, timeout):
    item =""
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item = driver.find_element_by_id(itemId)
            return item
        except:
            time.sleep(1)
    return False
def clickUntilTimeout(driver, item, timeout):
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item.click()
            return True
        except:
            time.sleep(1)
    return False
def cleanUntilTimeout(driver, item, timeout):
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item.clear()
            return True
        except:
            time.sleep(1)
    return False
def printLog(log):
    print("___ "+log)

def checkUploadImageProgress(driver,timein,timeout):
    showlog1 = False
    showlog2 = False
    showlog3 = False
    progress1 =""
    progress2 =""
    progress3= ""
    mustend = float(timein) + float(timeout)
    time.sleep(1)
    while (showlog1 == False or showlog2 == False or showlog3 == False):
        if (time.time() <= mustend):
            progress1 = driver.find_element_by_xpath(config["image1UploadProgressId"]).get_attribute("innerHTML")
            # print("Progress",progress1, progress2, progress3,sep=", ")
            if showlog1 == False and progress1 == "100%":
                printLog("Uploaded main image")
                showlog1 = True
           
            progress2 = driver.find_element_by_xpath(config["image2UploadProgressId"]).get_attribute("innerHTML")
            if showlog2 == False and progress2 == "100%" :
                printLog("Uploaded size1 image")
                showlog2 =True

            progress3 = driver.find_element_by_xpath(config["image3UploadProgressId"]).get_attribute("innerHTML")
            if  showlog3 == False and progress3 == "100%":
                printLog("Uploaded size2 image")
                showlog3 =True
            time.sleep(0.5)

            if(showlog1 == True and showlog2 == True and showlog3 == True):
                printLog("Upload images success on "+ str(time.time()-timein)+" seconds")
                return True
        else:
            printLog("Upload error: Timeout")
            return False

    printLog("Upload images success on "+ str(time.time()-timein)+" seconds")
    return True
    
if __name__ == "__main__":
    config = loadConfigFile(configFileUrl)
    sizeUrl = productManager.getProductSizeUrl(config["productSizePath"])
    opts = Options()
    opts.add_argument("--user-data-dir="+config["webDataPath"]) # add user data to chrome-data folder
    if (config["showInterface"] != "true"):
        opts.set_headless()
        opts.add_argument('headless')
        opts.add_argument('--disable-infobars')
        opts.add_argument('--disable-dev-shm-usage')
        opts.add_argument('--no-sandbox')
        opts.add_argument('--remote-debugging-port=9222')
    # print(config["webDataPath"])
    browser = Chrome(options=opts)
    # browser.implicitly_wait(20)
    browser.delete_all_cookies()
    # browser = Chrome()
    browser.get(config["inventoryUrl"])
    printLog("Open inventory manager")
    # time.sleep(1)
    if (getElementByXpathUntilTimeout(browser, config["loginDoneId"], 3) == False):

        try:
            browser.find_element_by_xpath(config["emailId"]).send_keys(config["email"])
        except:
            print("skip email!")
        browser.find_element_by_xpath(config["passwordId"]).send_keys(config["password"])
        browser.find_element_by_xpath(config["rememberLoginId"]).click()
        browser.find_element_by_xpath(config["loginButtonId"]).click()
        if (getElementByXpathUntilTimeout(browser, config["loginDoneId"], 3) == False): #v check one more time to avoid firstime login
            if(getElementByXpathUntilTimeout(browser, config["otpId"], 2) != False):
                printLog("First time login, waiting for OTP (  default is: 60 seconds for timeout)")
                otpTimeout = importOtp(browser, config["waitOtpTimeout"])
                if otpTimeout == False:
                    printLog("Login fail, OTP error or timeout!")
                    sys.exit()
                

    # browser.get(config["inventoryUrl"])
    printLog("Done login")
    print("_______________________________________________________________")
    printLog("Start clone product:")
    
    products = productManager.getProduct(config["productDataPath"])
    for product in products:
        try:
            dropdowMenu = getElementByXpathUntilTimeout(browser,config["editProductDropdownId"],3) # open edit dropdown
            dropdowMenu.click()
            # browser.find_element_by_xpath(config["editProductDropdownId"]).click() # open edit dropdown old
            # print(editMenu)
            printLog("Cloning "+ productManager.getProductName(product))

            copys =getElementByXpathUntilTimeout(browser,config["copyListItemId"],3)
            if("Copy listing" in copys.text):
                copys.click()
            else:
                copys =getElementByXpathUntilTimeout(browser,config["copyListItemBackupId"],3)
                copys.click()
                
            tabs = browser.window_handles
            browser.switch_to.window(tabs[1]) #go to 2nd tab
            # time.sleep(3)
            # productName = WebDriverWait(browser, 30).until(lambda x: x.find_element_by_xpath("productTitleId"))
            # productName.send_keys("Billie Eilish, 90's, Vintage, Unisex, Black Tshirt" + str(time.time())) # change product name
            title = getElementByXpathUntilTimeout(browser, config["productTitleId"], 10)
            cleanUntilTimeout(browser, title, 20)
            title.send_keys(productManager.getProductName(product)) # change product name
            # getElementByXpathUntilTimeout(browser, config["productTitleId"], 10)
            # productName.send_keys(productName.text + " ver1_1") # change product name
            timein = time.time()
            uploadImage(browser, config["image1Id"]+"",productManager.getProductUrl(config["productDataPath"],product),"Uploading main image")
            time.sleep(2)
            imagesTab = getElementByXpathUntilTimeout(browser, config["imageTabId"], 10)
            imagesTab.click() #switch to image tab to upload more 2 image.
            uploadImage(browser, config["image2Id"]+"", sizeUrl[0],"Uploading size1 image")
            time.sleep(2)
            
            uploadImage(browser, config["image3Id"]+"", sizeUrl[1],"Uploading size2 image")

            #     uploadImage(browser, config["image2Id"]+"", url)
            #     time.sleep(2)
            uploadImageResult = checkUploadImageProgress(browser, config["uploadImageTimeout"])
            
            saveButton = browser.find_element_by_xpath(config["saveButtonId"]+"")
            saveClick(saveButton, 10, product) #save edit
            browser.close()
            browser.switch_to.window(tabs[0]) # back to main tab

            browser.close()
            browser.switch_to.window(tabs[0]) # back to main tab

        except Exception as e:
            printLog("Clone error for: ", productManager.getProductName(product))
            printLog(e)
            print("_______________________________________________________________")

            # browser.close()
            # browser.switch_to.window(tabs[0]) # back to main tab
    # browser.quit()
    printLog("Quit tool!")



