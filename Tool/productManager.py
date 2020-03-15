import os
def getProducts(pathUrl):
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
    try:
        os.rename(productDataUrl, DoneUrl)
        print("Move done", DoneUrl)
    except Exception as e:
        print("Error: ",e)
    

#litle demo:
# products = getProduct("productData/")

# for product in products:
#         print("Product name : ",getProductName(product) )
#         print("Product url : ",getProductUrl("productData/",product) )
#         moveProductToDone(getProductUrl("productData/",product),getProductUrl("DONE/",product))
    
    
