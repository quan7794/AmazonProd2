import os
def getProduct(pathUrl):
    entries = os.listdir(pathUrl)
    # for entry in entries:
        # print("Detected product: ",entry )
    return entries

def getProductName(product):
    return product[:-4]
def getProductSizeUrl(pathUrl):
    sizes  = os.listdir(pathUrl)
    urls =[]
    for size in sizes:
        urls.append(getProductUrl(pathUrl,size))
    return urls
def getProductUrl(productSoftPath, product):
    return os.path.abspath(productSoftPath+product)
def moveProductToDone(productDataUrl, DoneUrl):
    os.rename(productDataUrl, DoneUrl)

#litle demo:
# products = importProduct("productData/")

# for product in products:
#         print("Product name : ",getProductName(product) )
#         print("Product url : ",getProductUrl("productData/",product) )

    
    
