
import time
import autoit
import yaml
import productManager
import sys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver import Chrome
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
configFileUrl = "config.yaml"
config = ""
    
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
                showlog1 = True
           
            progress2 = driver.find_element_by_xpath(config["image2UploadProgressId"]).get_attribute("innerHTML")
            if showlog2 == False and progress2 == "100%" :
                showlog2 =True

            progress3 = driver.find_element_by_xpath(config["image3UploadProgressId"]).get_attribute("innerHTML")
            if  showlog3 == False and progress3 == "100%":
                showlog3 =True
            time.sleep(0.5)

            if(showlog1 == True and showlog2 == True and showlog3 == True):
                printLog("Upload all images success on "+ str(time.time()-timein)+" seconds")
                return True
        else:
            printLog("Upload error: Timeout")
            return False

    printLog("Upload images success on "+ str(time.time()-timein)+" seconds")
    return True
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
        if(len(config["activeOtp"])) == 6:
            otpInput = getElementByXpathUntilTimeout(driver,config["otpId"],3)
            otpInput.send_keys(config["activeOtp"])
            rememberBrowser = getItemByIdUntilTimeout(driver,config["rememberBrowserId"],3)
            rememberBrowser.click()
            login = getItemByIdUntilTimeout(driver,config["signInOtpButttonId"],3)
            login.click()
            return True
        else: 
            time.sleep(0.5)
    return False
def saveClick(saveButton, product, timeout):
    
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
def clickUntilTimeout(item, timeout):
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item.click()
            return True
        except:
            time.sleep(1)
    return False
def cleanUntilTimeout(item, timeout):
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item.clear()
            return True
        except:
            time.sleep(1)
    return False
def sendKeyUntilTimeout(item,key,timeout):
    mustend = time.time() + float(timeout)
    while time.time() < mustend:
        try:
            item.send_keys(key)
            return True
        except:
            time.sleep(1)
    return False
def printLog(log):
    print("___ "+log)
def checkIfEditButtonIsInteract(drive,editId):
    items = drive.find_elements_by_xpath(editId)
    # print("product size: ", len(items))
    if len(items) >0:
        while True:
            try:
                items[0].click()
                tabs = drive.window_handles
                drive.switch_to.window(tabs[1]) #go to 2nd tab
                drive.close()
                drive.switch_to.window(tabs[0]) # back to main tab

                return items
            except Exception as e :
                time.sleep(1)
                items = drive.find_elements_by_xpath(editId)
    else:
        return False
    return items
def isLastPage(driver,nextPageId):
    try:
        driver.find_element_by_xpath(config["nextPageId"])
        printLog("Open next page")
        return False
    except :
        printLog("Last page")
        return True
def editProduct(driver):
    title = getElementByXpathUntilTimeout(driver,config["titleId"],30)
    if title != False:
        sendKeyResult = sendKeyUntilTimeout(title,config["replaceCharacter"],10)
        if sendKeyResult == False:
            return False
        # title.send_keys(config["replaceCharacter"])
        length = len(title.get_attribute('value'))
        if length >200:
            subTitle = (title.get_attribute('value'))[0:199]
            cleanUntilTimeout(title,10)
            title.send_keys(subTitle)
            printLog("Title length: "+str(length)+" | New title: "+title.get_attribute('value'))
        else:
            printLog("Title length: "+str(length)+" | New title: "+title.get_attribute('value'))
        try:
            driver.find_element_by_xpath(config["saveId"]).click()
        except:
            return False
        time.sleep(float(config["waitTimeForEachProduct"]))
        return True
    return False
if __name__ == "__main__":
    count = 0
    lastPage = False
    config = loadConfigFile(configFileUrl)
    sizeUrl = productManager.getProductSizeUrl(config["productSizePath"])
    opts = Options()
    opts.add_argument("--user-data-dir="+config["activeProfilePath"]) # add user data to chrome-data folder
    # opts.add_argument("user-data-dir=C:\\Users\\AtechM_03\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2")
    if (config["showInterface"] != "true"):
        opts.set_headless()
        opts.add_argument('headless')
        opts.add_argument('--disable-infobars')
        opts.add_argument('--disable-dev-shm-usage')
        opts.add_argument('--no-sandbox')
        # opts.add_argument('--remote-debugging-port=9222')
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
            browser.find_element_by_xpath(config["emailId"]).send_keys(config["activeEmail"])
        except:
            print("skip email!")
        browser.find_element_by_xpath(config["passwordId"]).send_keys(config["activePassword"])
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
    printLog("Start active product:")
    inactivePage = getElementByXpathUntilTimeout(browser, config["inactiveId"], 10)
    inactivePage.click()
    printLog("Load inactive page done")

    # table = browser.find_element_by_xpath(config["tableId"])


    # rows = table.find_elements_by_tag_name("tr") # get all row of one page
    # for row in rows:

    # time.sleep(5)
    
    while(lastPage == False):
        products = checkIfEditButtonIsInteract(browser,config["editId"])
        # print("interact ok!")
        if products != False:
            # products = browser.find_elements_by_xpath(config["editId"])
            # print("product size: ", len(products))
            for product in products:
                clickUntilTimeout(product, 10)
                # time.sleep(2)
                tabs = browser.window_handles
                browser.switch_to.window(tabs[1]) #go to 2nd tab
                try:
                    editResult = editProduct(browser)
                    if editResult == False:
                        printLog("Error product: "+str(count+1)+": "+"Can't not save! May be, you do not fill all require datas to save.")
                        print("_____________________________________")
                    else:
                        printLog("Done product: "+str(count+1))
                        print("_____________________________________")
                        time.sleep(float(config["waitTimeForEachPage"]))
                    count +=1
                    browser.close()
                    browser.switch_to.window(tabs[0]) # back to main tab
                except Exception as e:
                    printLog("Error product: "+str(count+1)+": "+str(e))
                    print("_____________________________________")
                    count +=1
                    browser.close()
                    browser.switch_to.window(tabs[0]) # back to main tab
            
        lastPage = isLastPage(browser,config["nextPageId"])
        if lastPage != True:
            browser.execute_script("scroll(0, 250)")
            nextPage = browser.find_element_by_xpath(config["nextPageId"])
            nextPage.click()
            # ActionChains(browser).move_to_element(nextPage).click().perform()
    if(config["quitBrowserAfterDone"] != "false"):
        browser.quit()
    printLog("All Doned!")
    